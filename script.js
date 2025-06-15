const display = document.getElementById("display");
const historyPanel = document.getElementById("history");
let history = JSON.parse(localStorage.getItem("calcHistory")) || [];
let ans = 0;
let isRadian = true;
let isResultDisplayed = false;

// Append value to display
function appendValue(val) {
    if (isResultDisplayed) {
        display.value = "";
        isResultDisplayed = false;
    }
    display.value += val;
}

// Clear display
function clearDisplay() {
    display.value = "";
    isResultDisplayed = false;
}

// Delete last character
function deleteLast() {
    display.value = display.value.slice(0, -1);
}

// Calculate expression
function calculate() {
    try {
        let expression = display.value.replace(/π/g, Math.PI).replace(/e/g, Math.E);

        expression = expression.replace(/sin\(([^)]+)\)/g, (_, val) =>
            Math.sin(toRadiansIfNeeded(eval(val)))
        );
        expression = expression.replace(/cos\(([^)]+)\)/g, (_, val) =>
            Math.cos(toRadiansIfNeeded(eval(val)))
        );
        expression = expression.replace(/tan\(([^)]+)\)/g, (_, val) =>
            Math.tan(toRadiansIfNeeded(eval(val)))
        );
        expression = expression.replace(/log\(([^)]+)\)/g, (_, val) =>
            Math.log10(eval(val))
        );
        expression = expression.replace(/ln\(([^)]+)\)/g, (_, val) =>
            Math.log(eval(val))
        );
        expression = expression.replace(/sqrt\(([^)]+)\)/g, (_, val) =>
            Math.sqrt(eval(val))
        );
        expression = expression.replace(/([0-9.]+)\^2/g, (_, val) =>
            Math.pow(eval(val), 2)
        );
        expression = expression.replace(/([0-9.]+)\^([0-9.]+)/g, (_, base, exp) =>
            Math.pow(eval(base), eval(exp))
        );

        let result = eval(expression);
        result = parseFloat(result.toFixed(5));
        display.value = result;
        ans = result;
        isResultDisplayed = true;

        saveHistory(`${expression} = ${result}`);
    } catch {
        display.value = "Error";
        isResultDisplayed = true;
    }
}

// Convert to radians if needed
function toRadiansIfNeeded(val) {
    return isRadian ? val : (val * Math.PI) / 180;
}

// Insert Ans
function appendAns() {
    if (isResultDisplayed) {
        display.value = "";
        isResultDisplayed = false;
    }
    display.value += ans;
}

// Toggle dark/light theme
function toggleTheme() {
    document.body.classList.toggle("light");
}

// Toggle scientific section
function toggleScientific() {
    const sciPanel = document.querySelector(".scientific");
    sciPanel.classList.toggle("hidden");

    const btn = document.getElementById("scientificToggleBtn");
    if (btn) {
        btn.textContent = sciPanel.classList.contains("hidden")
            ? "🧪 Scientific Mode"
            : "🧮 Standard Mode";
    }
}

// Append functions like sin(, cos(, etc.
function appendFunc(func) {
    if (isResultDisplayed) {
        display.value = "";
        isResultDisplayed = false;
    }

    if (func === 'pi') display.value += 'π';
    else if (func === 'e') display.value += 'e';
    else if (func === '^2') display.value += '^2';
    else display.value += func + '(';
}

// Toggle angle mode (radian/degree)
function toggleAngleUnit() {
    isRadian = !isRadian;
    alert(`Switched to ${isRadian ? "Radian" : "Degree"} mode`);
}

// Copy display content
function copyToClipboard() {
    if (display.value) {
        navigator.clipboard.writeText(display.value);
    }
}

// Toggle history panel
function toggleHistory() {
    historyPanel.classList.toggle("hidden");
    document.querySelector(".history-toggle").textContent =
        historyPanel.classList.contains("hidden") ? "🕘 Show History" : "🕘 Hide History";
}

// Save history to localStorage
function saveHistory(entry) {
    history.unshift(entry);
    if (history.length > 20) history.pop();
    localStorage.setItem("calcHistory", JSON.stringify(history));
    updateHistory();
}

// Update history display
function updateHistory() {
    historyPanel.innerHTML = "";
    history.forEach(entry => {
        const item = document.createElement("div");
        item.textContent = entry;
        item.style.cursor = "pointer";
        item.onclick = () => {
            display.value = entry.split("=")[0].trim();
        };
        historyPanel.appendChild(item);
    });
}

// Clear history entirely
function clearHistory() {
    history = [];
    localStorage.removeItem("calcHistory");
    updateHistory();
}

// Load history on page load
updateHistory();
