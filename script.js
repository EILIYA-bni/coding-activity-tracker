
const form = document.getElementById("tracker-form");
const dayInputs = document.getElementById("day-inputs");
const results = document.getElementById("results");
const error = document.getElementById("error");

// Generate 14 input fields
for (let day = 1; day <= 14; day++) {
    const label = document.createElement("label");

    label.className = "day-field";

    label.innerHTML = `
        <span>Day ${day}</span>
        <input
            type="number"
            min="0"
            step="1"
            placeholder="Minutes"
            required
        >
    `;

    dayInputs.appendChild(label);
}


form.addEventListener("submit", function(event) {
    event.preventDefault();

    const inputs = document.querySelectorAll(
        "#day-inputs input"
    );

    const codingMinutes = [];

    error.textContent = "";

    for (let i = 0; i < inputs.length; i++) {
        const rawValue = inputs[i].value.trim();
        const minutes = Number(rawValue);

        if (
            rawValue === "" ||
            !Number.isInteger(minutes) ||
            minutes < 0
        ) {
            error.textContent =
                `Enter valid minutes for Day ${i + 1}`;
            results.hidden = true;
            inputs[i].focus();
            return;
        }

        codingMinutes.push(minutes);
    }

    // Total time
    let total = 0;

    for (let time of codingMinutes) {
        total += time;
    }

    document.getElementById("total-time").textContent =
        `${total} minutes`;

    // Calculate average coding time.
    let averageTime = total / codingMinutes.length;
    document.getElementById("average-time").textContent = `${averageTime.toFixed(2)} Minutes`;

    // Find the most productive day
    let highestTime = 0;
    let numberDayHighestTime = 0;

    for (let i = 0; i < codingMinutes.length; i++) {
        if (codingMinutes[i] > highestTime) {
            highestTime = codingMinutes[i];
            numberDayHighestTime = i + 1;
        }
    }

    const bestDay = document.getElementById("best-day");

    if (highestTime === 0) {
        bestDay.textContent = "No coding activity";
    } else {
        bestDay.textContent =
            `Day ${numberDayHighestTime} (${highestTime} minutes)`;
    }

    document.getElementById("best-day").textContent = `Day ${numberDayHighestTime}`;
    // Count active and inactive days.
    let activeDayCount = 0, inActiveDayCount = 0, goalAchieved = 0;
    for (let time of codingMinutes) {
        if (time > 0) {
            activeDayCount++;
            if (time >= 60) {
                goalAchieved++;
            }
        }
        else {
            inActiveDayCount++;
        }
    }
    document.getElementById("active-days").textContent = `Active Days: ${activeDayCount}\tInactive Days: ${inActiveDayCount}`;
    // Find the longest coding streak.
    let streakDay = 0, streakDayUpdate = 0;
    for (let time of codingMinutes) {
        if (time > 0) {
            streakDayUpdate++;

            if (streakDayUpdate > streakDay) {
                streakDay = streakDayUpdate;
            }
        }
        else {
            streakDayUpdate = 0;
        }
    }
    document.getElementById("longest-streak").textContent = `${streakDay} days`;
    // Count days meeting the 60-minute goal.
    document.getElementById("goals-met").textContent = `${goalAchieved} days`;
    
    // Generate visual activity chart

    const heatmap = document.getElementById("activity-heatmap");
    const chart = document.getElementById("activity-chart");

    heatmap.innerHTML = "";
    chart.innerHTML = "";

    // Find maximum coding time for chart scaling
    let maxMinutes = 0;

    for (let time of codingMinutes) {
        if (time > maxMinutes) {
            maxMinutes = time;
        }
    }

    for (let i = 0; i < codingMinutes.length; i++) {
        const minutes = codingMinutes[i];

        let status = "inactive";

        if (minutes >= 60) {
            status = "goal";
        } else if (minutes > 0) {
            status = "active";
        }

        // Create heatmap square
        const square = document.createElement("div");

        square.className = `heatmap-day ${status}`;
        square.textContent = i + 1;
        square.title = `Day ${i + 1}: ${minutes} minutes`;

        heatmap.appendChild(square);

        // Create bar chart column
        const column = document.createElement("div");
        column.className = "chart-column";

        const track = document.createElement("div");
        track.className = "chart-track";

        const bar = document.createElement("div");
        bar.className = `chart-bar ${status}`;

        const height = maxMinutes > 0
            ? (minutes / maxMinutes) * 100
            : 0;

        bar.style.height = `${height}%`;
        bar.title = `Day ${i + 1}: ${minutes} minutes`;

        const label = document.createElement("span");
        label.className = "chart-label";
        label.textContent = i + 1;

        track.appendChild(bar);
        column.appendChild(track);
        column.appendChild(label);
        chart.appendChild(column);
    }


    results.hidden = false;
});

form.addEventListener("reset", function() {
    error.textContent = "";
    results.hidden = true;
});
