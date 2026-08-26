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

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState(null);

  const [deleteId, setDeleteId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

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

  const handleAdd = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

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

  const handleDelete = () => {
    if (!deleteId) {
      return;
    }

    deleteTransaction(deleteId);
    setDeleteId(null);
  };

  const incomeCount = transactions.filter(
    (item) => item.type === "income",
  ).length;

  const expenseCount = transactions.filter(
    (item) => item.type === "expense",
  ).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Transactions
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage all your income and expenses.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-400">
            Total Transactions
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {transactions.length}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
          <p className="text-xs font-medium text-emerald-600">
            Income Transactions
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-700">
            {incomeCount}
          </p>
        </div>

        <div className="rounded-2xl border border-red-100 bg-red-50/50 p-5">
          <p className="text-xs font-medium text-red-600">
            Expense Transactions
          </p>

          <p className="mt-2 text-2xl font-bold text-red-700">
            {expenseCount}
          </p>
        </div>
      </div>

      {/* Search */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
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
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-11 items-center justify-center rounded-xl bg-slate-100 px-3 text-slate-500">
              <Filter size={17} />
            </div>

            <select
              value={filter}
              onChange={(event) =>
                setFilter(event.target.value)
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-slate-400"
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

        {(search || filter !== "all") && (
          <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
            <p className="text-xs text-slate-400">
              Showing {filteredTransactions.length} of{" "}
              {transactions.length} transactions
            </p>

            <button
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Transaction
                </th>

                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Account
                </th>

                <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Date
                </th>

                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Amount
                </th>

                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
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

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                isIncome
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {isIncome ? (
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
                              <p className="truncate text-sm font-semibold text-slate-800">
                                {transaction.category}
                              </p>

                              <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                                {transaction.description ||
                                  "No description"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Account */}

                        <td className="px-6 py-4">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                            {transaction.account}
                          </span>
                        </td>

                        {/* Date */}

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {transaction.date}
                        </td>

                        {/* Amount */}

                        <td
                          className={`px-6 py-4 text-right text-sm font-bold ${
                            isIncome
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {formatCurrency(
                            transaction.amount,
                          )}
                        </td>

                        {/* Actions */}

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() =>
                                handleEdit(
                                  transaction,
                                )
                              }
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                              title="Edit transaction"
                            >
                              <Edit3 size={17} />
                            </button>

                            <button
                              onClick={() =>
                                setDeleteId(
                                  transaction.id,
                                )
                              }
                              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                              title="Delete transaction"
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

        {/* Empty */}

        {filteredTransactions.length === 0 && (
          <div className="px-6 py-20 text-center">
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
                onClick={handleAdd}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white"
              >
                <Plus size={15} />
                Add Transaction
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}

      <TransactionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSubmit}
        transaction={editingTransaction}
      />

      {/* Delete Confirmation */}

      <ConfirmDialog
        open={Boolean(deleteId)}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}