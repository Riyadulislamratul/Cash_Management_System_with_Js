import {
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
  Smartphone,
  Wallet,
  ArrowRightLeft,
} from "lucide-react";
import { motion } from "framer-motion";

import { useCash } from "../context/CashContext";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/calculations";

const accountConfig = {
  Cash: {
    icon: Wallet,
    description: "Physical cash in hand",
    iconClass: "bg-emerald-50 text-emerald-600",
  },
  Bank: {
    icon: Landmark,
    description: "Money held in your bank account",
    iconClass: "bg-blue-50 text-blue-600",
  },
  "Mobile Banking": {
    icon: Smartphone,
    description: "Mobile financial services balance",
    iconClass: "bg-violet-50 text-violet-600",
  },
};

export default function Accounts() {
  const { transactions, accountBalances } = useCash();
  const { currency } = useSettings();

  const accounts = Object.keys(accountConfig);

  const getAccountTransactions = (account) => {
    return transactions
      .filter((transaction) => transaction.account === account)
      .slice(0, 5);
  };

  const getAccountStats = (account) => {
    const accountTransactions = transactions.filter(
      (transaction) => transaction.account === account,
    );

    const income = accountTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0,
      );

    const expense = accountTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0,
      );

    const transfersIn = accountTransactions
      .filter(
        (transaction) =>
          transaction.type === "transfer" &&
          transaction.transferType === "in",
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0,
      );

    const transfersOut = accountTransactions
      .filter(
        (transaction) =>
          transaction.type === "transfer" &&
          transaction.transferType === "out",
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0,
      );

    return {
      income,
      expense,
      transfersIn,
      transfersOut,
    };
  };

  const totalBalance = accounts.reduce(
    (total, account) =>
      total + Number(accountBalances[account] || 0),
    0,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Accounts
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage and monitor your Cash, Bank and Mobile Banking
          balances.
        </p>
      </div>

      {/* Total Balance */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-slate-900 p-6 text-white shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
            <Wallet size={21} />
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400">
              Total Account Balance
            </p>

            <p className="mt-1 text-2xl font-bold sm:text-3xl">
              {formatCurrency(totalBalance, currency)}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {accounts.map((account) => (
            <div
              key={account}
              className="rounded-xl bg-white/5 px-4 py-3"
            >
              <p className="text-xs text-slate-400">
                {account}
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                {formatCurrency(
                  accountBalances[account] || 0,
                  currency,
                )}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {accounts.map((account, index) => {
          const config = accountConfig[account];
          const Icon = config.icon;
          const balance = Number(
            accountBalances[account] || 0,
          );

          const stats = getAccountStats(account);
          const recentTransactions =
            getAccountTransactions(account);

          return (
            <motion.div
              key={account}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.08,
              }}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              {/* Account Header */}
              <div className="border-b border-slate-100 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${config.iconClass}`}
                    >
                      <Icon size={21} />
                    </div>

                    <div>
                      <h2 className="text-sm font-bold text-slate-800">
                        {account}
                      </h2>

                      <p className="mt-1 text-xs text-slate-400">
                        {config.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-medium text-slate-400">
                    Current Balance
                  </p>

                  <p
                    className={`mt-1 text-2xl font-bold ${
                      balance >= 0
                        ? "text-slate-900"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(balance, currency)}
                  </p>
                </div>
              </div>

              {/* Account Statistics */}
              <div className="grid grid-cols-2 gap-px border-b border-slate-100 bg-slate-100">
                <div className="bg-white p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <ArrowDownLeft size={14} />
                    </div>

                    <span className="text-xs text-slate-400">
                      Income
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-bold text-emerald-600">
                    {formatCurrency(
                      stats.income,
                      currency,
                    )}
                  </p>
                </div>

                <div className="bg-white p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-600">
                      <ArrowUpRight size={14} />
                    </div>

                    <span className="text-xs text-slate-400">
                      Expense
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-bold text-red-600">
                    {formatCurrency(
                      stats.expense,
                      currency,
                    )}
                  </p>
                </div>
              </div>

              {/* Transfers */}
              <div className="grid grid-cols-2 gap-3 p-4">
                <div className="rounded-xl bg-blue-50 p-3">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft
                      size={14}
                      className="text-blue-600"
                    />

                    <span className="text-xs text-blue-600">
                      Transfer In
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-bold text-blue-700">
                    {formatCurrency(
                      stats.transfersIn,
                      currency,
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft
                      size={14}
                      className="text-slate-500"
                    />

                    <span className="text-xs text-slate-500">
                      Transfer Out
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-bold text-slate-700">
                    {formatCurrency(
                      stats.transfersOut,
                      currency,
                    )}
                  </p>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="border-t border-slate-100">
                <div className="flex items-center justify-between px-4 py-3">
                  <p className="text-xs font-bold text-slate-700">
                    Recent Transactions
                  </p>

                  <span className="text-[11px] text-slate-400">
                    {recentTransactions.length} shown
                  </span>
                </div>

                {recentTransactions.length > 0 ? (
                  <div>
                    {recentTransactions.map(
                      (transaction) => {
                        const isIncome =
                          transaction.type ===
                          "income";

                        const isTransfer =
                          transaction.type ===
                          "transfer";

                        return (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between border-t border-slate-50 px-4 py-3"
                          >
                            <div className="flex min-w-0 items-center gap-2.5">
                              <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                  isTransfer
                                    ? "bg-blue-50 text-blue-600"
                                    : isIncome
                                      ? "bg-emerald-50 text-emerald-600"
                                      : "bg-red-50 text-red-600"
                                }`}
                              >
                                {isTransfer ? (
                                  <ArrowRightLeft
                                    size={14}
                                  />
                                ) : isIncome ? (
                                  <ArrowDownLeft
                                    size={14}
                                  />
                                ) : (
                                  <ArrowUpRight
                                    size={14}
                                  />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-slate-700">
                                  {transaction.category ||
                                    (isTransfer
                                      ? "Transfer"
                                      : "Transaction")}
                                </p>

                                <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                  {transaction.date}
                                </p>
                              </div>
                            </div>

                            <p
                              className={`ml-3 shrink-0 text-xs font-bold ${
                                isTransfer
                                  ? "text-blue-600"
                                  : isIncome
                                    ? "text-emerald-600"
                                    : "text-red-600"
                              }`}
                            >
                              {!isTransfer &&
                                (isIncome ? "+" : "-")}

                              {formatCurrency(
                                transaction.amount,
                                currency,
                              )}
                            </p>
                          </div>
                        );
                      },
                    )}
                  </div>
                ) : (
                  <div className="border-t border-slate-50 px-4 py-8 text-center">
                    <p className="text-xs text-slate-400">
                      No transactions for this account.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Information */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <ArrowRightLeft size={17} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-blue-900">
              Account balances are automatic
            </h3>

            <p className="mt-1 text-xs leading-5 text-blue-700">
              Income increases the selected account, expenses
              decrease it, and transfers automatically move
              money between accounts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}