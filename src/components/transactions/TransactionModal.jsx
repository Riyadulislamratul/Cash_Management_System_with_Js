import { useEffect, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CircleDollarSign,
  FileText,
  Tag,
  Wallet,
  X,
} from "lucide-react";
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
    "Education",
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
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(transaction);

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

    setErrors({});
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

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const handleTypeChange = (type) => {
    setForm((current) => ({
      ...current,
      type,
      category: "",
    }));

    setErrors({});
  };

  const validate = () => {
    const newErrors = {};

    if (!form.amount) {
      newErrors.amount = "Amount is required.";
    } else if (Number(form.amount) <= 0) {
      newErrors.amount =
        "Amount must be greater than zero.";
    }

    if (!form.category) {
      newErrors.category =
        "Please select a category.";
    }

    if (!form.account) {
      newErrors.account =
        "Please select an account.";
    }

    if (!form.date) {
      newErrors.date = "Please select a date.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      ...form,
      amount: Number(form.amount),
    });
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
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.96,
            }}
            transition={{ duration: 0.2 }}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            {/* Header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {isEditing
                    ? "Edit Transaction"
                    : "Add Transaction"}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Record your income or expense.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {/* Type */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Transaction Type
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handleTypeChange("income")
                    }
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
                    onClick={() =>
                      handleTypeChange("expense")
                    }
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      form.type === "expense"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    Expense
                  </button>
                </div>
              </div>

              {/* Amount */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Amount
                </label>

                <div
                  className={`flex overflow-hidden rounded-xl border ${
                    errors.amount
                      ? "border-red-400"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-center bg-slate-50 px-4 text-slate-500">
                    <CircleDollarSign size={17} />
                  </div>

                  <span className="flex items-center bg-slate-50 pr-2 text-sm text-slate-500">
                    ৳
                  </span>

                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="w-full border-0 px-3 py-3 text-sm outline-none"
                  />
                </div>

                {errors.amount && (
                  <ErrorMessage
                    message={errors.amount}
                  />
                )}
              </div>

              {/* Category */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>

                <div className="relative">
                  <Tag
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={`w-full appearance-none rounded-xl border bg-white py-3 pl-11 pr-4 text-sm outline-none ${
                      errors.category
                        ? "border-red-400"
                        : "border-slate-200"
                    }`}
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories[form.type].map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                {errors.category && (
                  <ErrorMessage
                    message={errors.category}
                  />
                )}
              </div>

              {/* Account */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Account
                </label>

                <div className="relative">
                  <Wallet
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    name="account"
                    value={form.account}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="Cash">
                      Cash
                    </option>

                    <option value="Bank">
                      Bank
                    </option>

                    <option value="Mobile Banking">
                      Mobile Banking
                    </option>
                  </select>
                </div>

                {errors.account && (
                  <ErrorMessage
                    message={errors.account}
                  />
                )}
              </div>

              {/* Date */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className={`w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none ${
                      errors.date
                        ? "border-red-400"
                        : "border-slate-200"
                    }`}
                  />
                </div>

                {errors.date && (
                  <ErrorMessage
                    message={errors.date}
                  />
                )}
              </div>

              {/* Description */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                  <span className="ml-1 font-normal text-slate-400">
                    (Optional)
                  </span>
                </label>

                <div className="relative">
                  <FileText
                    size={17}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    maxLength={200}
                    rows={3}
                    placeholder="Add a note..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-11 py-3 text-sm outline-none focus:border-slate-400"
                  />
                </div>

                <div className="mt-1 text-right text-[10px] text-slate-400">
                  {form.description.length}/200
                </div>
              </div>

              {/* Actions */}

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
                  className={`rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-sm transition ${
                    form.type === "income"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isEditing
                    ? "Update Transaction"
                    : "Save Transaction"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
      <AlertCircle size={13} />
      {message}
    </p>
  );
}