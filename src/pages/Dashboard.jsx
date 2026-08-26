import {
  Activity,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { motion } from "framer-motion";

import SummaryCard from "../components/dashboard/SummaryCard";
import { useCash } from "../context/CashContext";
import { formatCurrency } from "../utils/calculations";

export default function Dashboard() {
  const {
    totalCash,
    totalIncome,
    totalExpense,
    transactions,
  } = useCash();

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page Header */}

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening with your money.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm">
          {new Date().toLocaleDateString("en-BD", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </motion.div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Cash"
          amount={formatCurrency(totalCash)}
          icon={Wallet}
          description="Current balance"
          type="default"
        />

        <SummaryCard
          title="Total Income"
          amount={formatCurrency(totalIncome)}
          icon={TrendingUp}
          description="All income"
          type="income"
        />

        <SummaryCard
          title="Total Expense"
          amount={formatCurrency(totalExpense)}
          icon={TrendingDown}
          description="All expenses"
          type="expense"
        />

        <SummaryCard
          title="Transactions"
          amount={transactions.length}
          icon={Activity}
          description="Total records"
          type="transactions"
        />
      </div>

      {/* Recent Transactions */}

      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
          <div>
            <h2 className="font-bold text-slate-900">
              Recent Transactions
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Your latest cash activities
            </p>
          </div>

          <a
            href="/transactions"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            View all →
          </a>
        </div>

        {recentTransactions.length > 0 ? (
          <div>
            {recentTransactions.map((transaction) => {
              const isIncome =
                transaction.type === "income";

              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 last:border-b-0"
                >
                  {/* Icon */}

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isIncome
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {isIncome ? (
                      <ArrowDownLeft size={19} />
                    ) : (
                      <ArrowUpRight size={19} />
                    )}
                  </div>

                  {/* Info */}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {transaction.category}
                    </p>

                    <p className="truncate text-xs text-slate-400">
                      {transaction.description ||
                        "No description"}
                    </p>
                  </div>

                  {/* Account */}

                  <div className="hidden text-right sm:block">
                    <p className="text-xs font-medium text-slate-600">
                      {transaction.account}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      {transaction.date}
                    </p>
                  </div>

                  {/* Amount */}

                  <p
                    className={`w-28 text-right text-sm font-bold ${
                      isIncome
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <Wallet
              size={36}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-3 text-sm font-semibold text-slate-700">
              No transactions yet
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Add your first income or expense to get started.
            </p>
          </div>
        )}
      </motion.section>
    </div>
  );
}