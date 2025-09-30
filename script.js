const checkboxes = [
	...document.querySelectorAll('input[type="checkbox"][data-bit]')
];
const hexOut = document.getElementById("hexOut");
const decOut = document.getElementById("decOut");
const binOut = document.getElementById("binOut");
const quickSingles = document.getElementById("quickSingles");
const decodeIn = document.getElementById("decodeIn");
const desc = document.getElementById("desc");
const comboPresets = document.getElementById("comboPresets");

const FLAG_META = [
	{ bit: 0x01, label: "Block Walk (orange)" },
	{ bit: 0x02, label: "Block Light + Line of Sight (green)" },
	{ bit: 0x04, label: "Block Jump / Teleport (blue)" },
	{ bit: 0x08, label: "Block Player Walk (not mercenary) (purple)" },
	{ bit: 0x10, label: "Block Missiles (yellow)" },
	{ bit: 0x20, label: "Block Light (gray)" },
	{ bit: 0x40, label: "Monster-only Block (white)" },
	{ bit: 0x80, label: "Reserved / Unknown (tan)" }
];

function valueFromChecks() {
	return checkboxes.reduce(
		(v, cb) => (cb.checked ? v | parseInt(cb.dataset.bit, 16) : v),
		0
	);
}

function applyValue(v) {
	checkboxes.forEach((cb) => {
		const bit = parseInt(cb.dataset.bit, 16);
		cb.checked = !!(v & bit);
	});
	render(v);
}

function render(v) {
	hexOut.textContent = v.toString(16).toUpperCase().padStart(2, "0");
	decOut.textContent = v.toString(10);
	binOut.textContent = v.toString(2).padStart(8, "0");

	// human description
	const active = FLAG_META.filter((f) => v & f.bit).map((f) => f.label);
	if (active.length === 0) {
		desc.textContent = "Walkable";
	} else {
		// if Solid is set, make that clear up front
		const solidFirst = active.sort((a, b) =>
			a.startsWith("Solid") ? -1 : b.startsWith("Solid") ? 1 : 0
		);
		desc.textContent = solidFirst.join(" + ");
	}
}

// events
checkboxes.forEach((cb) =>
	cb.addEventListener("change", () => render(valueFromChecks()))
);

quickSingles.addEventListener("change", () => {
	if (!quickSingles.value) return;
	applyValue(parseInt(quickSingles.value, 16));
});

comboPresets.addEventListener("click", (e) => {
	const btn = e.target.closest(".chip");
	if (!btn) return;
	applyValue(parseInt(btn.dataset.hex, 16));
});

decodeIn.addEventListener("input", () => {
	const v = decodeIn.value.trim().toUpperCase();
	if (/^[0-9A-F]{1,2}$/.test(v)) {
		applyValue(parseInt(v, 16));
	}
});

// init
render(0);
