
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