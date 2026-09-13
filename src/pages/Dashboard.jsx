import {
  ArrowDownLeft,
  ArrowRightLeft,
  ArrowUpRight,
  Banknote,
  Building2,
  CalendarDays,
  Plus,
  Receipt,
  Smartphone,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { useCash } from "../context/CashContext";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/calculations";

export default function Dashboard() {
  const {
    transactions,
    totalIncome,
    totalExpense,
    totalCash,
    accountBalances,
  } = useCash();

  const { currency } = useSettings();

  /*
   * Show the latest 6 transactions.
   */
  const recentTransactions = transactions
    .slice()
    .sort((a, b) => {
      const dateA = new Date(
        `${a.date || ""}T00:00:00`,
      ).getTime();

      const dateB = new Date(
        `${b.date || ""}T00:00:00`,
      ).getTime();

      return dateB - dateA;
    })
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Welcome back. Here's your financial overview.
          </p>
        </div>

        <Link
          to="/transactions"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          <Plus size={17} />
          Add Transaction
        </Link>
      </div>

      {/* =====================================================
          MAIN SUMMARY CARDS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard
          title="Total Cash"
          amount={totalCash}
          currency={currency}
          icon={Wallet}
          description="Current net balance"
          type="balance"
        />

        <SummaryCard
          title="Total Income"
          amount={totalIncome}
          currency={currency}
          icon={TrendingUp}
          description="Total money received"
          type="income"
        />

        <SummaryCard
          title="Total Expense"
          amount={totalExpense}
          currency={currency}
          icon={TrendingDown}
          description="Total money spent"
          type="expense"
        />
      </div>

      {/* =====================================================
          ACCOUNT BALANCES
      ====================================================== */}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Your Accounts
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Current balance by account
            </p>
          </div>

          <Link
            to="/accounts"
            className="text-xs font-semibold text-slate-500 transition hover:text-slate-900"
          >
            Manage Accounts →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <AccountBalanceCard
            title="Cash"
            balance={accountBalances?.Cash || 0}
            currency={currency}
            icon={Wallet}
            description="Physical cash"
          />

          <AccountBalanceCard
            title="Bank"
            balance={accountBalances?.Bank || 0}
            currency={currency}
            icon={Building2}
            description="Bank account"
          />

          <AccountBalanceCard
            title="Mobile Banking"
            balance={
              accountBalances?.["Mobile Banking"] || 0
            }
            currency={currency}
            icon={Smartphone}
            description="Mobile financial services"
          />
        </div>
      </section>

      {/* =====================================================
          RECENT TRANSACTIONS
      ====================================================== */}

      <motion.section
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.3,
        }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        {/* Section Header */}

        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Transactions
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Your latest financial activity
            </p>
          </div>

          <Link
            to="/transactions"
            className="text-xs font-semibold text-slate-500 transition hover:text-slate-900"
          >
            View All →
          </Link>
        </div>

        {/* Transactions */}

        {recentTransactions.length === 0 ? (
          <EmptyTransactions />
        ) : (
          <div className="divide-y divide-slate-100">
            {recentTransactions.map(
              (transaction, index) => (
                <TransactionRow
                  key={
                    transaction.id ||
                    `${transaction.date}-${index}`
                  }
                  transaction={transaction}
                  currency={currency}
                />
              ),
            )}
          </div>
        )}
      </motion.section>

      {/* =====================================================
          QUICK ACTIONS
      ====================================================== */}

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Manage your money quickly
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <QuickAction
            to="/transactions"
            icon={Plus}
            title="Add Transaction"
            description="Record income or expense"
          />

          <QuickAction
            to="/accounts"
            icon={ArrowRightLeft}
            title="Transfer Money"
            description="Move money between accounts"
          />

          <QuickAction
            to="/reports"
            icon={Receipt}
            title="View Reports"
            description="Analyze your finances"
          />
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  amount,
  currency,
  icon: Icon,
  description,
  type,
}) {
  const styles = {
    balance: {
      wrapper: "border-slate-200 bg-white",
      icon: "bg-slate-100 text-slate-700",
      amount: "text-slate-900",
    },

    income: {
      wrapper:
        "border-emerald-100 bg-emerald-50/40",
      icon:
        "bg-emerald-100 text-emerald-700",
      amount:
        "text-emerald-700",
    },

    expense: {
      wrapper:
        "border-red-100 bg-red-50/40",
      icon:
        "bg-red-100 text-red-700",
      amount:
        "text-red-700",
    },
  };

  const style = styles[type];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -2,
      }}
      className={`rounded-2xl border p-5 shadow-sm ${style.wrapper}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500">
            {title}
          </p>

          <p
            className={`mt-3 text-2xl font-bold ${style.amount}`}
          >
            {formatCurrency(amount, currency)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.icon}`}
        >
          <Icon size={19} />
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   ACCOUNT BALANCE CARD
========================================================= */

function AccountBalanceCard({
  title,
  balance,
  currency,
  icon: Icon,
  description,
}) {
  return (
    <motion.div
      whileHover={{
        y: -2,
      }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Icon size={19} />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900">
              {title}
            </p>

            <p className="text-[11px] text-slate-400">
              {description}
            </p>
          </div>
        </div>

        <Banknote
          size={17}
          className="text-slate-300"
        />
      </div>

      <p className="mt-5 text-xl font-bold text-slate-900">
        {formatCurrency(balance, currency)}
      </p>
    </motion.div>
  );
}

/* =========================================================
   TRANSACTION ROW
========================================================= */

function TransactionRow({
  transaction,
  currency,
}) {
  const isIncome =
    transaction.type === "income";

  const isExpense =
    transaction.type === "expense";

  const isTransfer =
    transaction.type === "transfer";

  const amount =
    Number(transaction.amount) || 0;

  let icon = Receipt;
  let iconWrapper =
    "bg-slate-100 text-slate-600";
  let amountClass =
    "text-slate-700";
  let amountPrefix = "";

  if (isIncome) {
    icon = ArrowDownLeft;
    iconWrapper =
      "bg-emerald-50 text-emerald-600";
    amountClass =
      "text-emerald-600";
    amountPrefix = "+";
  }

  if (isExpense) {
    icon = ArrowUpRight;
    iconWrapper =
      "bg-red-50 text-red-600";
    amountClass =
      "text-red-600";
    amountPrefix = "-";
  }

  if (isTransfer) {
    icon = ArrowRightLeft;
    iconWrapper =
      "bg-blue-50 text-blue-600";
    amountClass =
      "text-blue-600";
  }

  const Icon = icon;

  return (
    <div className="flex items-center gap-3 px-5 py-4 transition hover:bg-slate-50">
      {/* Icon */}

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconWrapper}`}
      >
        <Icon size={18} />
      </div>

      {/* Details */}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">
          {transaction.category ||
            (isTransfer
              ? "Transfer"
              : "Transaction")}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
          <span>
            {transaction.account ||
              "Unknown Account"}
          </span>

          <span>•</span>

          <span className="inline-flex items-center gap-1">
            <CalendarDays size={11} />

            {formatDate(transaction.date)}
          </span>

          {transaction.description && (
            <>
              <span>•</span>

              <span className="max-w-[180px] truncate">
                {transaction.description}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Amount */}

      <div className="shrink-0 text-right">
        <p
          className={`text-sm font-bold ${amountClass}`}
        >
          {amountPrefix}
          {formatCurrency(amount, currency)}
        </p>

        <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
          {isTransfer
            ? "Transfer"
            : transaction.type}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY TRANSACTIONS
========================================================= */

function EmptyTransactions() {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        <Receipt size={21} />
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-700">
        No transactions yet
      </p>

      <p className="mx-auto mt-1 max-w-sm text-xs text-slate-400">
        Start tracking your money by adding your
        first income or expense.
      </p>

      <Link
        to="/transactions"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
      >
        <Plus size={15} />
        Add Transaction
      </Link>
    </div>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  to,
  icon: Icon,
  title,
  description,
}) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{
          y: -2,
        }}
        className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Icon size={19} />
        </div>

        <div>
          <p className="text-sm font-bold text-slate-900">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(date) {
  if (!date) {
    return "No date";
  }

  const parsedDate = new Date(
    `${String(date).slice(0, 10)}T00:00:00`,
  );

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString(
    "en-BD",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}