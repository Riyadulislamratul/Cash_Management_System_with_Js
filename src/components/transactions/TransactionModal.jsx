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

import { useSettings } from "../../context/SettingsContext";

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

const currencySymbols = {
  BDT: "৳",
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
};

export default function TransactionModal({
  open,
  onClose,
  onSubmit,
  transaction,
}) {
  const { currency } = useSettings();

  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(transaction);

  const currencySymbol =
    currencySymbols[currency] || currency;

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
      setForm({
        ...defaultForm,
        date: new Date().toISOString().split("T")[0],
      });
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
    const amount = Number(form.amount);

    if (
      form.amount === "" ||
      form.amount === null ||
      form.amount === undefined
    ) {
      newErrors.amount = "Amount is required.";
    } else if (!Number.isFinite(amount)) {
      newErrors.amount = "Please enter a valid amount.";
    } else if (amount <= 0) {
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

    if (form.description.length > 200) {
      newErrors.description =
        "Description cannot exceed 200 characters.";
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
      description: form.description.trim(),
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.98,
            }}
            transition={{
              duration: 0.2,
            }}
            onMouseDown={(event) =>
              event.stopPropagation()
            }
            className="
              flex
              max-h-[94dvh]
              w-full
              flex-col
              overflow-hidden
              rounded-t-3xl
              bg-white
              shadow-2xl
              sm:max-h-[90vh]
              sm:max-w-xl
              sm:rounded-2xl
            "
          >
            {/* =================================================
                HEADER
            ================================================== */}

            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0 pr-3">
                <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">
                  {isEditing
                    ? "Edit Transaction"
                    : "Add Transaction"}
                </h2>

                <p className="mt-1 truncate text-xs text-slate-400">
                  Record your income or expense.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close transaction form"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 active:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* =================================================
                FORM SCROLL AREA
            ================================================== */}

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <form
                onSubmit={handleSubmit}
                className="space-y-5 p-4 sm:p-6"
              >
                {/* =================================================
                    TYPE
                ================================================== */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Transaction Type
                  </label>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleTypeChange("income")
                      }
                      className={`
                        min-h-12 rounded-xl border px-3 py-3
                        text-sm font-semibold transition
                        active:scale-[0.98]
                        ${
                          form.type === "income"
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 text-slate-500 hover:bg-slate-50"
                        }
                      `}
                    >
                      Income
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleTypeChange("expense")
                      }
                      className={`
                        min-h-12 rounded-xl border px-3 py-3
                        text-sm font-semibold transition
                        active:scale-[0.98]
                        ${
                          form.type === "expense"
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-slate-200 text-slate-500 hover:bg-slate-50"
                        }
                      `}
                    >
                      Expense
                    </button>
                  </div>
                </div>

                {/* =================================================
                    AMOUNT
                ================================================== */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Amount
                  </label>

                  <div
                    className={`
                      flex min-h-12 overflow-hidden rounded-xl border
                      ${
                        errors.amount
                          ? "border-red-400"
                          : "border-slate-200"
                      }
                    `}
                  >
                    <div className="flex shrink-0 items-center bg-slate-50 px-3 text-slate-500 sm:px-4">
                      <CircleDollarSign size={17} />
                    </div>

                    <span className="flex shrink-0 items-center bg-slate-50 px-1.5 text-sm font-medium text-slate-500 sm:px-2">
                      {currencySymbol}
                    </span>

                    <input
                      type="number"
                      name="amount"
                      value={form.amount}
                      onChange={handleChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      className="min-w-0 w-full border-0 bg-white px-3 py-3 text-sm outline-none focus:ring-0"
                    />
                  </div>

                  {errors.amount && (
                    <ErrorMessage
                      message={errors.amount}
                    />
                  )}
                </div>

                {/* =================================================
                    CATEGORY
                ================================================== */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category
                  </label>

                  <div className="relative">
                    <Tag
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className={`
                        min-h-12 w-full appearance-none rounded-xl
                        border bg-white py-3 pl-11 pr-4
                        text-sm outline-none
                        ${
                          errors.category
                            ? "border-red-400"
                            : "border-slate-200"
                        }
                      `}
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

                {/* =================================================
                    ACCOUNT
                ================================================== */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Account
                  </label>

                  <div className="relative">
                    <Wallet
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <select
                      name="account"
                      value={form.account}
                      onChange={handleChange}
                      className={`
                        min-h-12 w-full appearance-none rounded-xl
                        border bg-white py-3 pl-11 pr-4
                        text-sm outline-none
                        ${
                          errors.account
                            ? "border-red-400"
                            : "border-slate-200"
                        }
                      `}
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

                {/* =================================================
                    DATE
                ================================================== */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className={`
                        min-h-12 w-full rounded-xl border
                        bg-white py-3 pl-11 pr-4
                        text-sm outline-none
                        ${
                          errors.date
                            ? "border-red-400"
                            : "border-slate-200"
                        }
                      `}
                    />
                  </div>

                  {errors.date && (
                    <ErrorMessage
                      message={errors.date}
                    />
                  )}
                </div>

                {/* =================================================
                    DESCRIPTION
                ================================================== */}

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
                      className="pointer-events-none absolute left-4 top-4 text-slate-400"
                    />

                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      maxLength={200}
                      rows={4}
                      placeholder="Add a note..."
                      className={`
                        w-full resize-none rounded-xl border
                        bg-white px-11 py-3 text-sm
                        outline-none
                        ${
                          errors.description
                            ? "border-red-400"
                            : "border-slate-200"
                        }
                      `}
                    />
                  </div>

                  <div
                    className={`
                      mt-1 text-right text-[10px]
                      ${
                        form.description.length >= 200
                          ? "text-red-500"
                          : "text-slate-400"
                      }
                    `}
                  >
                    {form.description.length}/200
                  </div>

                  {errors.description && (
                    <ErrorMessage
                      message={errors.description}
                    />
                  )}
                </div>

                {/* =================================================
                    ACTIONS
                ================================================== */}

                <div className="flex flex-col-reverse gap-2.5 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end sm:gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="min-h-11 w-full rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 active:bg-slate-200 sm:w-auto"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className={`
                      min-h-11 w-full rounded-xl px-6 py-3
                      text-sm font-semibold text-white
                      shadow-sm transition
                      active:scale-[0.98]
                      sm:w-auto
                      ${
                        form.type === "income"
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-red-600 hover:bg-red-700"
                      }
                    `}
                  >
                    {isEditing
                      ? "Update Transaction"
                      : "Save Transaction"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* =========================================================
   ERROR MESSAGE
========================================================= */

function ErrorMessage({ message }) {
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
      <AlertCircle size={13} className="shrink-0" />
      <span>{message}</span>
    </p>
  );
}