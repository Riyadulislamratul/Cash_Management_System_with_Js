import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Edit3,
  Filter,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useCash } from "../context/CashContext";
import { useSettings } from "../context/SettingsContext";
import { formatCurrency } from "../utils/calculations";

import TransactionModal from "../components/transactions/TransactionModal";
import ConfirmDialog from "../components/common/ConfirmDialog";

export default function Transactions() {
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useCash();

  const { currency } = useSettings();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState(null);

  const [deleteId, setDeleteId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  /* =========================================================
     FILTER TRANSACTIONS
  ========================================================= */

  const filteredTransactions = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesFilter =
        filter === "all" ||
        transaction.type === filter;

      if (!searchValue) {
        return matchesFilter;
      }

      const searchableText = [
        transaction.category,
        transaction.account,
        transaction.description,
        transaction.date,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesFilter &&
        searchableText.includes(searchValue)
      );
    });
  }, [transactions, search, filter]);

  /* =========================================================
     ADD
  ========================================================= */

  const handleAdd = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = (data) => {
    if (editingTransaction) {
      updateTransaction(
        editingTransaction.id,
        data,
      );
    } else {
      addTransaction(data);
    }

    setModalOpen(false);
    setEditingTransaction(null);
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = () => {
    if (!deleteId) {
      return;
    }

    deleteTransaction(deleteId);
    setDeleteId(null);
  };

  /* =========================================================
     STATISTICS
  ========================================================= */

  const incomeCount = transactions.filter(
    (item) => item.type === "income",
  ).length;

  const expenseCount = transactions.filter(
    (item) => item.type === "expense",
  ).length;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Transactions
          </h1>

          <p className="mt-1 text-sm leading-5 text-slate-500">
            Manage all your income and expenses.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98] sm:w-auto"
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {/* Total */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs font-medium text-slate-400">
            Total Transactions
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {transactions.length}
          </p>
        </div>

        {/* Income */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-5">
          <p className="text-xs font-medium text-emerald-600">
            Income Transactions
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-700">
            {incomeCount}
          </p>
        </div>

        {/* Expense */}
        <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4 sm:p-5">
          <p className="text-xs font-medium text-red-600">
            Expense Transactions
          </p>

          <p className="mt-2 text-2xl font-bold text-red-700">
            {expenseCount}
          </p>
        </div>
      </div>

      {/* =====================================================
          SEARCH + FILTER
      ====================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}
          <div className="relative min-w-0 flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search transactions..."
              aria-label="Search transactions"
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Filter */}
          <div className="flex w-full items-center gap-2 lg:w-auto">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
              <Filter size={17} />
            </div>

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
              aria-label="Filter transactions"
              className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 sm:px-4 lg:w-48 lg:flex-none"
            >
              <option value="all">
                All Transactions
              </option>

              <option value="income">
                Income Only
              </option>

              <option value="expense">
                Expense Only
              </option>
            </select>
          </div>
        </div>

        {/* Filter status */}
        {(search || filter !== "all") && (
          <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400">
              Showing {filteredTransactions.length} of{" "}
              {transactions.length} transactions
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="self-start text-xs font-semibold text-slate-600 transition hover:text-slate-900 sm:self-auto"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* =====================================================
          TRANSACTIONS
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Mobile hint */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3 sm:hidden">
          <p className="text-xs font-medium text-slate-500">
            Transactions
          </p>

          <p className="text-[11px] text-slate-400">
            Swipe horizontally →
          </p>
        </div>

        <div className="overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[820px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="whitespace-nowrap px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 sm:px-6">
                  Transaction
                </th>

                <th className="whitespace-nowrap px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 sm:px-6">
                  Account
                </th>

                <th className="whitespace-nowrap px-4 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 sm:px-6">
                  Date
                </th>

                <th className="whitespace-nowrap px-4 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400 sm:px-6">
                  Amount
                </th>

                <th className="whitespace-nowrap px-4 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400 sm:px-6">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredTransactions.map(
                  (transaction) => {
                    const isIncome =
                      transaction.type === "income";

                    const isTransfer =
                      transaction.type === "transfer";

                    return (
                      <motion.tr
                        key={transaction.id}
                        layout
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          x: -20,
                        }}
                        className="border-b border-slate-100 last:border-0"
                      >
                        {/* Transaction */}
                        <td className="px-4 py-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                isTransfer
                                  ? "bg-blue-50 text-blue-600"
                                  : isIncome
                                    ? "bg-emerald-50 text-emerald-600"
                                    : "bg-red-50 text-red-600"
                              }`}
                            >
                              {isTransfer ? (
                                <ArrowRightLeftIcon />
                              ) : isIncome ? (
                                <ArrowDownLeft
                                  size={19}
                                />
                              ) : (
                                <ArrowUpRight
                                  size={19}
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[220px] truncate text-sm font-semibold text-slate-800">
                                {transaction.category ||
                                  (isTransfer
                                    ? "Transfer"
                                    : "Transaction")}
                              </p>

                              <p className="mt-1 max-w-[220px] truncate text-xs text-slate-400">
                                {transaction.description ||
                                  "No description"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Account */}
                        <td className="px-4 py-4 sm:px-6">
                          <span className="whitespace-nowrap rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                            {transaction.account}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-500 sm:px-6">
                          {transaction.date}
                        </td>

                        {/* Amount */}
                        <td
                          className={`whitespace-nowrap px-4 py-4 text-right text-sm font-bold sm:px-6 ${
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
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4 sm:px-6">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  transaction,
                                )
                              }
                              aria-label="Edit transaction"
                              title="Edit transaction"
                              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 active:bg-slate-200"
                            >
                              <Edit3 size={17} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setDeleteId(
                                  transaction.id,
                                )
                              }
                              aria-label="Delete transaction"
                              title="Delete transaction"
                              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 active:bg-red-100"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  },
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {filteredTransactions.length === 0 && (
          <div className="px-5 py-16 text-center sm:px-6 sm:py-20">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Search
                size={24}
                className="text-slate-400"
              />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-700">
              No transactions found
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">
              {search || filter !== "all"
                ? "Try changing your search or filter."
                : "You haven't added any transactions yet."}
            </p>

            {!search && filter === "all" && (
              <button
                type="button"
                onClick={handleAdd}
                className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                <Plus size={15} />
                Add Transaction
              </button>
            )}
          </div>
        )}
      </div>

      {/* =====================================================
          TRANSACTION MODAL
      ====================================================== */}

      <TransactionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSubmit}
        transaction={editingTransaction}
      />

      {/* =====================================================
          DELETE CONFIRMATION
      ====================================================== */}

      <ConfirmDialog
        open={Boolean(deleteId)}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

/* =========================================================
   TRANSFER ICON
========================================================= */

function ArrowRightLeftIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 3 4 4-4 4" />
      <path d="M20 7H4" />
      <path d="m8 21-4-4 4-4" />
      <path d="M4 17h16" />
    </svg>
  );
}