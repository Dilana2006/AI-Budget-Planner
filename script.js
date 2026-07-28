const fields = [
  "income","housing","utilities","groceries","transportation","insurance",
  "phone","internet","entertainment","subscriptions","debt","other"
];

fields.forEach(id => {
  document.getElementById(id).addEventListener("input", calculate);
});

function calculate() {
  let total = 0;
  fields.forEach(id => {
    total += Number(document.getElementById(id).value) || 0;
  });
  let income = Number(document.getElementById("income").value) || 0;
  let remaining = income - total;
  let rate = income > 0 ? ((remaining / income) * 100).toFixed(1) : 0;
  document.getElementById("expenses").innerText = "$" + total;
  document.getElementById("remaining").innerText = "$" + remaining;
  document.getElementById("rate").innerText = rate + "%";
}

const WEBHOOK_URL = "https://d2006d.app.n8n.cloud/webhook/budget-planner";

function num(id) {
  return Number(document.getElementById(id).value) || 0;
}

async function analyzeBudget() {
  const result = document.getElementById("aiResult");
  result.innerHTML = `<h3>🤖 AI is analyzing...</h3><p>Reviewing your spending habits and financial goals.</p>`;

  // Map website input IDs -> workflow's expected JSON keys
  const payload = {
    monthlyIncome: num("income"),
    housing: num("housing"),
    utilities: num("utilities"),
    groceries: num("groceries"),
    transportation: num("transportation"),
    insurance: num("insurance"),
    phone: num("phone"),
    internet: num("internet"),
    entertainment: num("entertainment"),
    subscriptions: num("subscriptions"),
    debtPayments: num("debt"),
    otherExpenses: num("other"),
    savingsGoal: document.getElementById("goal").value || "",
    targetAmount: num("target"),
    notes: document.getElementById("notes").value || ""
  };

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      result.innerHTML = `<h3>⚠️ Please check your input</h3><p>${data.message || "Something went wrong."}</p>`;
      return;
    }

    const list = (arr) => (arr || []).map(x => `<li>${x}</li>`).join("");

    result.innerHTML = `
      <h3>Budget Summary</h3>
      <p><strong>Budget Health:</strong> ${data.budgetHealth || "-"}</p>
      <p>${data.summary || ""}</p>

      <p><strong>Income:</strong> $${data.income} |
         <strong>Expenses:</strong> $${data.expenses} |
         <strong>Remaining:</strong> $${data.remaining} |
         <strong>Savings Rate:</strong> ${data.savingsRate}%</p>

      <h4>✅ Strengths</h4><ul>${list(data.strengths)}</ul>
      <h4>⚠️ Weaknesses</h4><ul>${list(data.weaknesses)}</ul>
      <h4>💡 Recommendations</h4><ul>${list(data.recommendations)}</ul>
      <h4>💰 Saving Ideas</h4><ul>${list(data.savingIdeas)}</ul>

      <p><strong>Largest Expense:</strong> ${data.largestExpense || "-"}</p>
      <p><strong>Estimated Months to Goal:</strong> ${data.estimatedMonths}</p>
      <p><em>${data.motivation || ""}</em></p>
    `;
  } catch (err) {
    result.innerHTML = `<h3>❌ Connection error</h3><p>Could not reach the AI service. Please try again.</p>`;
  }
}