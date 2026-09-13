import { useEffect, useMemo, useState } from "react";

import {
  BarChart3,
  CalendarDays,
  Download,
  FileSpreadsheet,
  FileText,
  PieChart,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { motion } from "framer-motion";

import { useCash } from "../context/CashContext";
import { useSettings } from "../context/SettingsContext";

import { formatCurrency } from "../utils/calculations";

import {
  downloadCSV,
  downloadExcel,
  downloadPDF,
  getReportTransactions,
  getReportTotals,
  groupByAccount,
  groupByCategory,
  groupByDate,
  groupByMonth,
  groupByYear,
} from "../utils/reportUtils";

const reportTypes = [
  {
    id: "daily",
    label: "Daily",
  },
  {
    id: "monthly",
    label: "Monthly",
  },
  {
    id: "yearly",
    label: "Yearly",
  },
  {
    id: "income-expense",
    label: "Income vs Expense",
  },
  {
    id: "category",
    label: "Category Breakdown",
  },
  {
    id: "account",
    label: "Account-wise",
  },
];

export default function Reports() {
  const { transactions } = useCash();
  const { currency } = useSettings();

  const [reportType, setReportType] = useState("monthly");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /*
   * Get all valid transaction dates.
   */
  const transactionDates = useMemo(() => {
    return transactions
      .map((transaction) =>
        String(transaction.date || "").slice(0, 10),
      )
      .filter(Boolean)
      .sort();
  }, [transactions]);

  /*
   * Automatically select a range covering
   * all existing transactions.
   */
  useEffect(() => {
    if (!transactionDates.length) {
      return;
    }

    if (!startDate && !endDate) {
      setStartDate(transactionDates[0]);
      setEndDate(
        transactionDates[transactionDates.length - 1],
      );
    }
  }, [transactionDates, startDate, endDate]);

  /*
   * Income/expense report transactions.
   *
   * Transfers are excluded because transfers
   * are not income or expenses.
   */
  const reportTransactions = useMemo(() => {
    return getReportTransactions(
      transactions,
      startDate,
      endDate,
    );
  }, [transactions, startDate, endDate]);

  /*
   * Account reports include transfers because
   * transfers change account balances.
   */
  const accountReportTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = String(
        transaction.date || "",
      ).slice(0, 10);

      if (startDate && transactionDate < startDate) {
        return false;
      }

      if (endDate && transactionDate > endDate) {
        return false;
      }

      return true;
    });
  }, [transactions, startDate, endDate]);

  /*
   * Calculate report totals.
   */
  const totals = useMemo(() => {
    return getReportTotals(reportTransactions);
  }, [reportTransactions]);

  /*
   * Generate report data.
   */
  const data = useMemo(() => {
    switch (reportType) {
      case "daily":
        return groupByDate(reportTransactions);

      case "monthly":
        return groupByMonth(reportTransactions);

      case "yearly":
        return groupByYear(reportTransactions);

      case "category":
        return groupByCategory(reportTransactions);

      case "account":
        return groupByAccount(accountReportTransactions);

      case "income-expense":
        return [
          {
            type: "Income",
            amount: totals.income,
          },
          {
            type: "Expense",
            amount: totals.expense,
          },
          {
            type: "Net Balance",
            amount: totals.balance,
          },
        ];

      default:
        return [];
    }
  }, [
    reportType,
    reportTransactions,
    accountReportTransactions,
    totals,
  ]);

  /*
   * Validate date range.
   */
  const invalidDateRange =
    startDate &&
    endDate &&
    startDate > endDate;

  /*
   * Reset dates to include all transactions.
   */
  const handleResetDates = () => {
    if (transactionDates.length) {
      setStartDate(transactionDates[0]);

      setEndDate(
        transactionDates[transactionDates.length - 1],
      );
    } else {
      setStartDate("");
      setEndDate("");
    }
  };

  /*
   * PDF download.
   *
   * Numeric values are formatted using
   * the currently selected currency.
   */
  const handlePDF = () => {
    if (!data.length || invalidDateRange) {
      return;
    }

    const columns = Object.keys(data[0]);

    const rows = data.map((item) =>
      columns.map((column) => {
        const value = item[column];

        return typeof value === "number"
          ? formatCurrency(value, currency)
          : value;
      }),
    );

    downloadPDF({
      title: `Cash Management - ${getReportTitle(
        reportType,
      )}`,

      subtitle:
        startDate && endDate
          ? `${startDate} to ${endDate}`
          : "All available transactions",

      columns,
      rows,

      filename: `cash-report-${reportType}.pdf`,
    });
  };

  /*
   * CSV download.
   */
  const handleCSV = () => {
    if (!data.length || invalidDateRange) {
      return;
    }

    downloadCSV(
      data,
      `cash-report-${reportType}.csv`,
    );
  };

  /*
   * Excel download.
   */
  const handleExcel = () => {
    if (!data.length || invalidDateRange) {
      return;
    }

    downloadExcel(
      data,
      `cash-report-${reportType}.xlsx`,
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Reports
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Analyze your income, expenses and accounts.
          </p>
        </div>

        {/* Download Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handlePDF}
            disabled={!data.length || invalidDateRange}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FileText size={16} />
            PDF
          </button>

          <button
            onClick={handleExcel}
            disabled={!data.length || invalidDateRange}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FileSpreadsheet size={16} />
            Excel
          </button>

          <button
            onClick={handleCSV}
            disabled={!data.length || invalidDateRange}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={16} />
            CSV
          </button>
        </div>
      </div>

      {/* Report Selector */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        <div className="flex min-w-max gap-1">
          {reportTypes.map((report) => (
            <button
              key={report.id}
              onClick={() => setReportType(report.id)}
              className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                reportType === report.id
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              {report.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date Filter */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          {/* Start Date */}
          <div className="flex-1">
            <label className="mb-2 block text-xs font-semibold text-slate-600">
              Start Date
            </label>

            <div className="relative">
              <CalendarDays
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                value={startDate}
                onChange={(event) =>
                  setStartDate(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="flex-1">
            <label className="mb-2 block text-xs font-semibold text-slate-600">
              End Date
            </label>

            <div className="relative">
              <CalendarDays
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                value={endDate}
                onChange={(event) =>
                  setEndDate(event.target.value)
                }
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={handleResetDates}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <RotateCcw size={15} />
            All Dates
          </button>
        </div>

        {/* Invalid Date Message */}
        {invalidDateRange && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-600">
            Start date cannot be later than end date.
          </div>
        )}

        {/* Transaction Count */}
        {!invalidDateRange && (
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span>
              {reportTransactions.length} income/expense
              transaction
              {reportTransactions.length !== 1
                ? "s"
                : ""}
            </span>

            {transactions.length > 0 && (
              <span>
                {transactions.length} total transaction
                {transactions.length !== 1
                  ? "s"
                  : ""}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Income"
          amount={totals.income}
          icon={TrendingUp}
          type="income"
          currency={currency}
        />

        <SummaryCard
          title="Expense"
          amount={totals.expense}
          icon={TrendingDown}
          type="expense"
          currency={currency}
        />

        <SummaryCard
          title="Net Balance"
          amount={totals.balance}
          icon={Wallet}
          type="balance"
          currency={currency}
        />
      </div>

      {/* Report Content */}
      <motion.div
        key={reportType}
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className="rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        {/* Report Header */}
        <div className="border-b border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              {reportType === "category" ? (
                <PieChart size={19} />
              ) : (
                <BarChart3 size={19} />
              )}
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                {getReportTitle(reportType)}
              </h2>

              <p className="text-xs text-slate-400">
                {startDate && endDate
                  ? `${startDate} → ${endDate}`
                  : "All available dates"}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <ReportTable
          reportType={reportType}
          data={data}
          invalidDateRange={invalidDateRange}
          currency={currency}
        />
      </motion.div>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  amount,
  icon: Icon,
  type,
  currency,
}) {
  const classes = {
    income:
      "border-emerald-100 bg-emerald-50/50 text-emerald-700",

    expense:
      "border-red-100 bg-red-50/50 text-red-700",

    balance:
      "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <div
      className={`rounded-2xl border p-5 ${classes[type]}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold">
          {title}
        </p>

        <Icon size={18} />
      </div>

      <p className="mt-3 text-2xl font-bold">
        {formatCurrency(amount, currency)}
      </p>
    </div>
  );
}

/* =========================================================
   REPORT TABLE
========================================================= */

function ReportTable({
  reportType,
  data,
  invalidDateRange,
  currency,
}) {
  if (invalidDateRange) {
    return (
      <div className="px-6 py-20 text-center">
        <BarChart3
          size={30}
          className="mx-auto text-slate-300"
        />

        <p className="mt-4 text-sm font-semibold text-slate-600">
          Invalid date range
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Please select a valid start and end date.
        </p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="px-6 py-20 text-center">
        <BarChart3
          size={30}
          className="mx-auto text-slate-300"
        />

        <p className="mt-4 text-sm font-semibold text-slate-600">
          No data available
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Try selecting a different date range or add a
          transaction first.
        </p>
      </div>
    );
  }

  /*
   * Income vs Expense
   */
  if (reportType === "income-expense") {
    return (
      <div className="grid gap-4 p-6 md:grid-cols-3">
        {data.map((item) => (
          <div
            key={item.type}
            className="rounded-xl border border-slate-100 bg-slate-50 p-5"
          >
            <p className="text-xs font-medium text-slate-400">
              {item.type}
            </p>

            <p className="mt-2 text-xl font-bold text-slate-900">
              {formatCurrency(item.amount, currency)}
            </p>
          </div>
        ))}
      </div>
    );
  }

  /*
   * Normal table reports.
   */
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[650px]">
        <thead className="bg-slate-50">
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th
                key={key}
                className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400"
              >
                {formatHeader(key)}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-t border-slate-100 transition hover:bg-slate-50/70"
            >
              {Object.entries(row).map(
                ([key, value]) => (
                  <td
                    key={key}
                    className="px-6 py-4 text-sm text-slate-600"
                  >
                    {typeof value === "number"
                      ? formatCurrency(
                          value,
                          currency,
                        )
                      : value}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================
   FORMAT TABLE HEADER
========================================================= */

function formatHeader(value) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

/* =========================================================
   REPORT TITLE
========================================================= */

function getReportTitle(type) {
  const titles = {
    daily: "Daily Report",
    monthly: "Monthly Report",
    yearly: "Yearly Report",
    "income-expense": "Income vs Expense",
    category: "Category Breakdown",
    account: "Account-wise Report",
  };

  return titles[type] || "Report";
}