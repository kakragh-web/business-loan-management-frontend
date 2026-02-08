import { useState } from "react";

export default function LoanCalculator() {
  const [amount, setAmount] = useState("");
  const [interest, setInterest] = useState("");
  const [years, setYears] = useState("");
  const [results, setResults] = useState(null);

  const calculateLoan = (e) => {
    e.preventDefault();

    const principal = parseFloat(amount);
    const monthlyInterest = parseFloat(interest) / 100 / 12;
    const payments = parseFloat(years) * 12;

    if (isNaN(principal) || isNaN(monthlyInterest) || isNaN(payments)) {
      alert("Please enter valid numbers for all fields.");
      return;
    }

    const x = Math.pow(1 + monthlyInterest, payments);
    const monthly = (principal * x * monthlyInterest) / (x - 1);

    if (isFinite(monthly)) {
      const total = monthly * payments;
      const totalInterestAmount = total - principal;

      setResults({
        monthly: monthly.toFixed(2),
        total: total.toFixed(2),
        totalInterest: totalInterestAmount.toFixed(2),
      });
    }
  };

  return (
    <div className="calculator-page">
      <div className="calculator">
        <div className="calculator-header">
          <h2>Smart Loan Calculator</h2>
          <p className="subtitle">
            Calculate your monthly payments and total interest easily
          </p>
        </div>

        <div className="calculator-body">
          <div className="input-section">
            <form onSubmit={calculateLoan}>
              <div className="input-group">
                <label htmlFor="amount">Loan Amount ($)</label>
                <input
                  type="number"
                  id="amount"
                  placeholder="e.g., 250000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <span className="input-icon">$</span>
              </div>

              <div className="input-group">
                <label htmlFor="interest">Annual Interest Rate (%)</label>
                <input
                  type="number"
                  id="interest"
                  step="0.1"
                  placeholder="e.g., 5.5"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                />
                <span className="input-icon">%</span>
              </div>

              <div className="input-group">
                <label htmlFor="years">Loan Term (Years)</label>
                <input
                  type="number"
                  id="years"
                  placeholder="e.g., 30"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                />
                <span className="input-icon">Yrs</span>
              </div>

              <button type="submit" className="calculate-btn">
                Calculate Loan <span className="button-icon">→</span>
              </button>
            </form>
          </div>

          <div className="results">
            <h3>Loan Summary</h3>
            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">Monthly Payment</span>
                <span className="result-value">
                  ${results ? results.monthly : "0.00"}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Total Payment</span>
                <span className="result-value">
                  ${results ? results.total : "0.00"}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Total Interest</span>
                <span className="result-value">
                  ${results ? results.totalInterest : "0.00"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
