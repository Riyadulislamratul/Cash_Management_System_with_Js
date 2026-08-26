import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useCash } from "../../context/CashContext";
import { formatCurrency } from "../../utils/calculations";

export default function RecentTransactions() {
  const { transactions } = useCash();

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="transactions-card">
      <div className="section-header">
        <div>
          <h3>Recent Transactions</h3>
          <p>Your latest cash activities</p>
        </div>

        <a href="/transactions">View All</a>
      </div>

      <div className="transaction-list">
        {recentTransactions.map((transaction) => {
          const isIncome = transaction.type === "income";

          return (
            <div className="transaction-row" key={transaction.id}>
              <div className={`transaction-icon ${isIncome ? "income" : "expense"}`}>
                {isIncome ? (
                  <ArrowDownLeft size={19} />
                ) : (
                  <ArrowUpRight size={19} />
                )}
              </div>

              <div className="transaction-info">
                <strong>{transaction.category}</strong>
                <span>{transaction.description}</span>
              </div>

              <div className="transaction-account">
                <span>{transaction.account}</span>
                <small>{transaction.date}</small>
              </div>

              <strong
                className={`transaction-amount ${
                  isIncome ? "income-text" : "expense-text"
                }`}
              >
                {isIncome ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}