import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const defaultForm = {
  type: "income",
  amount: "",
  category: "",
  account: "Cash",
  description: "",
  date: new Date().toISOString().split("T")[0],
};

const categories = {
  income: [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Gift",
    "Other",
  ],
  expense: [
    "Food",
    "Shopping",
    "Transport",
    "Bills",
    "Rent",
    "Entertainment",
    "Health",
    "Other",
  ],
};

export default function TransactionModal({
  open,
  onClose,
  onSubmit,
  transaction,
}) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (transaction) {
      setForm({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        account: transaction.account,
        description: transaction.description || "",
        date: transaction.date,
      });
    } else {
      setForm(defaultForm);
    }
  }, [transaction, open]);

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleTypeChange = (type) => {
    setForm((current) => ({
      ...current,
      type,
      category: "",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!form.category) {
      alert("Please select a category.");
      return;
    }

    onSubmit(form);

    setForm(defaultForm);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {transaction
                    ? "Edit Transaction"
                    : "Add Transaction"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Record your income or expense.
                </p>
              </div>

              <button
                onClick={onClose}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {/* Type */}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleTypeChange("income")}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    form.type === "income"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  Income
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeChange("expense")}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    form.type === "expense"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  Expense
                </button>
              </div>

              {/* Amount */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Amount
                </label>

                <div className="flex overflow-hidden rounded-xl border border-slate-200 focus-within:border-slate-500">
                  <span className="flex items-center bg-slate-50 px-4 text-slate-500">
                    ৳
                  </span>

                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full border-0 px-4 py-3 outline-none"
                  />
                </div>
              </div>

              {/* Category */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                >
                  <option value="">
                    Select category
                  </option>

                  {categories[form.type].map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Account */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Account
                </label>

                <select
                  name="account"
                  value={form.account}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank</option>
                  <option value="Mobile Banking">
                    Mobile Banking
                  </option>
                </select>
              </div>

              {/* Date */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
                />
              </div>

              {/* Description */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Optional description..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-500"
                />
              </div>

              {/* Buttons */}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`rounded-xl px-6 py-3 text-sm font-semibold text-white transition ${
                    form.type === "income"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {transaction ? "Update" : "Save Transaction"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}