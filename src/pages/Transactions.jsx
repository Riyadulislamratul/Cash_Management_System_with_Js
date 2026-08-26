import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Edit3,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { useCash } from "../context/CashContext";
import { formatCurrency } from "../utils/calculations";
import TransactionModal from "../components/transactions/TransactionModal";

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

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesFilter =
        filter === "all" || transaction.type === filter;

      const searchText = search.toLowerCase();

      const matchesSearch =
        transaction.category
          .toLowerCase()
          .includes(searchText) ||
        transaction.account
          .toLowerCase()
          .includes(searchText) ||
        transaction.description
          ?.toLowerCase()
          .includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [transactions, search, filter]);

  const handleOpenAdd = () => {
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
        data
      );
    } else {
      addTransaction(data);
    }

    setModalOpen(false);
    setEditingTransaction(null);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (confirmed) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Transactions
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage all your income and expenses.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      {/* Filters */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search category, account or description..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-slate-500"
            />
          </div>

          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value)
            }
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
          >
            <option value="all">All Transactions</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
        </div>
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Transaction
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Account
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Amount
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((transaction) => {
                const isIncome =
                  transaction.type === "income";

                return (
                  <tr
                    key={transaction.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
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

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {transaction.category}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {transaction.description ||
                              "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-600">
                      {transaction.account}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {transaction.date}
                    </td>

                    <td
                      className={`px-6 py-4 text-right text-sm font-bold ${
                        isIncome
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            handleEdit(transaction)
                          }
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                          title="Edit"
                        >
                          <Edit3 size={17} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(transaction.id)
                          }
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTransactions.length === 0 && (
            <div className="px-6 py-16 text-center">
              <p className="font-medium text-slate-700">
                No transactions found
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Try changing your search or filter.
              </p>
            </div>
          )}
        </div>
      </div>

      <TransactionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSubmit}
        transaction={editingTransaction}
      />
    </div>
  );
}