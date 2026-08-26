import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";

import SummaryCard from "../components/dashboard/SummaryCard";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import { useCash } from "../context/CashContext";
import { formatCurrency } from "../utils/calculations";

export default function Dashboard() {
  const {
    totalCash,
    totalIncome,
    totalExpense,
    transactions,
  } = useCash();

  return (
    <div className="dashboard">
      <div className="page-heading">
        <div>
          <h2>Dashboard</h2>
          <p>Welcome back. Here's your cash overview.</p>
        </div>

        <div className="today">
          {new Date().toLocaleDateString("en-BD", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="summary-grid">
        <SummaryCard
          title="Total Cash"
          amount={formatCurrency(totalCash)}
          icon={Wallet}
          description="Current balance"
          variant="primary"
        />

        <SummaryCard
          title="Total Income"
          amount={formatCurrency(totalIncome)}
          icon={TrendingUp}
          description="All income"
          variant="income"
        />

        <SummaryCard
          title="Total Expense"
          amount={formatCurrency(totalExpense)}
          icon={TrendingDown}
          description="All expenses"
          variant="expense"
        />

        <SummaryCard
          title="Transactions"
          amount={transactions.length}
          icon={Activity}
          description="Total records"
          variant="transactions"
        />
      </div>

      <RecentTransactions />
    </div>
  );
}