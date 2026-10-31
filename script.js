// Analyze Risk
function analyzeRisk() {

    let risk = document.getElementById("risk").value.trim();

    let likelihoodInput = document.getElementById("likelihood").value;
    let impactInput = document.getElementById("impact").value;

    let likelihood = Number(likelihoodInput);
    let impact = Number(impactInput);

    let result = document.getElementById("result");
    let recommendation = document.getElementById("recommendation");

    result.innerHTML = "";
    recommendation.innerHTML = "";

    // Validate input
    if (risk === "") {
        result.textContent = "Please enter a risk description.";
        return;
    }

    if (
        likelihoodInput === "" ||
        impactInput === "" ||
        !Number.isInteger(likelihood) ||
        !Number.isInteger(impact) ||
        likelihood < 1 || likelihood > 5 ||
        impact < 1 || impact > 5
    ) {
        result.textContent = "Please enter Likelihood and Impact between 1 and 5.";
        return;
    }

    // Calculate Risk Score
    let score = likelihood * impact;

    // Identify Risk Level
    let level;

    if (score <= 4) {
        level = "Low";
    }
    else if (score <= 14) {
        level = "Medium";
    }
    else {
        level = "High";
    }

    // Security Control Recommendation
    let riskText = risk.toLowerCase();
    let control;

    if (riskText.includes("password")) {
        control = "Enable Multi-Factor Authentication (MFA) and enforce a strong password policy.";
    }
    else if (riskText.includes("backup")) {
        control = "Schedule regular backups and test data recovery.";
    }
    else if (riskText.includes("malware")) {
        control = "Use antivirus software and regularly update systems.";
    }
    else if (
        riskText.includes("unauthorized") ||
        riskText.includes("access")
    ) {
        control = "Implement access controls, MFA and regular access reviews.";
    }
    else {
        control = "Review the risk and apply suitable security controls.";
    }

    // Display Risk Result
    result.innerHTML = `
        <h3>Risk Assessment Result</h3>
        <p><strong>Risk:</strong> ${escapeHTML(risk)}</p>
        <p><strong>Likelihood:</strong> ${likelihood}</p>
        <p><strong>Impact:</strong> ${impact}</p>
        <p><strong>Risk Score:</strong> ${score}</p>
        <p><strong>Risk Level:</strong> ${level}</p>
    `;

    // Display Recommendation
    recommendation.innerHTML = `
        <h3>Recommended Security Control</h3>
        <p>${escapeHTML(control)}</p>
        <small>Basic rule-based learning recommendation, not an AI-generated assessment.</small>
    `;

    // Create Assessment Object
    let assessment = {
        risk: risk,
        likelihood: likelihood,
        impact: impact,
        score: score,
        level: level,
        control: control,
        date: new Date().toLocaleString()
    };

    // Save Assessment
    let history = JSON.parse(
        localStorage.getItem("riskHistory") || "[]"
    );

    history.unshift(assessment);

    localStorage.setItem(
        "riskHistory",
        JSON.stringify(history)
    );

    // Update History and Dashboard
    displayHistory();
    updateDashboard();
}


// Display Risk History
function displayHistory() {

    let historyDiv = document.getElementById("history");

    let history = JSON.parse(
        localStorage.getItem("riskHistory") || "[]"
    );

    historyDiv.innerHTML = "";

    if (history.length === 0) {
        historyDiv.innerHTML =
            '<p class="empty-message">No risk assessments saved yet.</p>';
        return;
    }

    history.forEach(function(item) {

        let card = document.createElement("div");

        card.className = "history-card";

        card.innerHTML = `
            <h3>${escapeHTML(item.risk)}</h3>
            <p><strong>Risk Score:</strong> ${item.score}</p>
            <p><strong>Risk Level:</strong> ${escapeHTML(item.level)}</p>
            <p><strong>Security Control:</strong> ${escapeHTML(item.control)}</p>
            <p><small>${escapeHTML(item.date)}</small></p>
        `;

        historyDiv.appendChild(card);
    });
}


// Update Risk Dashboard
function updateDashboard() {

    let history = JSON.parse(
        localStorage.getItem("riskHistory") || "[]"
    );

    let total = history.length;

    let high = history.filter(
        item => item.level === "High"
    ).length;

    let medium = history.filter(
        item => item.level === "Medium"
    ).length;

    let low = history.filter(
        item => item.level === "Low"
    ).length;

    document.getElementById("totalRisks").textContent = total;
    document.getElementById("highRisks").textContent = high;
    document.getElementById("mediumRisks").textContent = medium;
    document.getElementById("lowRisks").textContent = low;
}


// Clear Risk History
function clearHistory() {

    let confirmClear = confirm(
        "Are you sure you want to clear all risk history?"
    );

    if (confirmClear) {

        localStorage.removeItem("riskHistory");

        displayHistory();
        updateDashboard();

        document.getElementById("result").innerHTML = "";
        document.getElementById("recommendation").innerHTML = "";
    }
}


// Escape HTML
function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, function(character) {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return entities[character];
    });
}


// Load Data When Page Opens
displayHistory();
updateDashboard();