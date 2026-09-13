import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function getReportTransactions(
  transactions,
  startDate,
  endDate,
) {
  return transactions.filter((transaction) => {
    return (
      transaction.date >= startDate &&
      transaction.date <= endDate
    );
  });
}

export function getReportTotals(transactions) {
  const income = transactions
    .filter(
      (transaction) =>
        transaction.type === "income",
    )
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount),
      0,
    );

  const expense = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense",
    )
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount),
      0,
    );

  return {
    income,
    expense,
    balance: income - expense,
  };
}

export function groupByCategory(transactions) {
  const result = {};

  transactions
    .filter(
      (transaction) =>
        transaction.type !== "transfer",
    )
    .forEach((transaction) => {
      const category = transaction.category;

      if (!result[category]) {
        result[category] = {
          income: 0,
          expense: 0,
        };
      }

      if (transaction.type === "income") {
        result[category].income += Number(
          transaction.amount,
        );
      }

      if (transaction.type === "expense") {
        result[category].expense += Number(
          transaction.amount,
        );
      }
    });

  return Object.entries(result)
    .map(([category, values]) => ({
      category,
      income: values.income,
      expense: values.expense,
      total:
        values.income - values.expense,
    }))
    .sort(
      (a, b) =>
        Math.abs(b.expense) -
        Math.abs(a.expense),
    );
}

export function groupByAccount(transactions) {
  const accounts = {
    Cash: {
      income: 0,
      expense: 0,
      transfersIn: 0,
      transfersOut: 0,
    },

    Bank: {
      income: 0,
      expense: 0,
      transfersIn: 0,
      transfersOut: 0,
    },

    "Mobile Banking": {
      income: 0,
      expense: 0,
      transfersIn: 0,
      transfersOut: 0,
    },
  };

  transactions.forEach((transaction) => {
    const account = transaction.account;

    if (!accounts[account]) {
      return;
    }

    const amount = Number(transaction.amount);

    if (transaction.type === "income") {
      accounts[account].income += amount;
    }

    if (transaction.type === "expense") {
      accounts[account].expense += amount;
    }

    if (
      transaction.type === "transfer" &&
      transaction.transferType === "in"
    ) {
      accounts[account].transfersIn += amount;
    }

    if (
      transaction.type === "transfer" &&
      transaction.transferType === "out"
    ) {
      accounts[account].transfersOut += amount;
    }
  });

  return Object.entries(accounts).map(
    ([account, values]) => ({
      account,
      ...values,
      net:
        values.income -
        values.expense +
        values.transfersIn -
        values.transfersOut,
    }),
  );
}

export function groupByDate(transactions) {
  const result = {};

  transactions
    .filter(
      (transaction) =>
        transaction.type !== "transfer",
    )
    .forEach((transaction) => {
      if (!result[transaction.date]) {
        result[transaction.date] = {
          income: 0,
          expense: 0,
        };
      }

      if (transaction.type === "income") {
        result[transaction.date].income +=
          Number(transaction.amount);
      }

      if (transaction.type === "expense") {
        result[transaction.date].expense +=
          Number(transaction.amount);
      }
    });

  return Object.entries(result)
    .map(([date, values]) => ({
      date,
      income: values.income,
      expense: values.expense,
      balance:
        values.income - values.expense,
    }))
    .sort((a, b) =>
      a.date.localeCompare(b.date),
    );
}

export function groupByMonth(transactions) {
  const result = {};

  transactions
    .filter(
      (transaction) =>
        transaction.type !== "transfer",
    )
    .forEach((transaction) => {
      const month =
        transaction.date.substring(0, 7);

      if (!result[month]) {
        result[month] = {
          income: 0,
          expense: 0,
        };
      }

      if (transaction.type === "income") {
        result[month].income +=
          Number(transaction.amount);
      }

      if (transaction.type === "expense") {
        result[month].expense +=
          Number(transaction.amount);
      }
    });

  return Object.entries(result)
    .map(([month, values]) => ({
      month,
      income: values.income,
      expense: values.expense,
      balance:
        values.income - values.expense,
    }))
    .sort((a, b) =>
      a.month.localeCompare(b.month),
    );
}

export function groupByYear(transactions) {
  const result = {};

  transactions
    .filter(
      (transaction) =>
        transaction.type !== "transfer",
    )
    .forEach((transaction) => {
      const year =
        transaction.date.substring(0, 4);

      if (!result[year]) {
        result[year] = {
          income: 0,
          expense: 0,
        };
      }

      if (transaction.type === "income") {
        result[year].income +=
          Number(transaction.amount);
      }

      if (transaction.type === "expense") {
        result[year].expense +=
          Number(transaction.amount);
      }
    });

  return Object.entries(result)
    .map(([year, values]) => ({
      year,
      income: values.income,
      expense: values.expense,
      balance:
        values.income - values.expense,
    }))
    .sort((a, b) =>
      a.year.localeCompare(b.year),
    );
}

export function downloadCSV(
  rows,
  filename,
) {
  if (!rows.length) {
    return;
  }

  const headers = Object.keys(rows[0]);

  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const value =
            row[header] ?? "";

          return `"${String(value).replace(
            /"/g,
            '""',
          )}"`;
        })
        .join(","),
    ),
  ].join("\n");

  const blob = new Blob(
    [csv],
    {
      type: "text/csv;charset=utf-8;",
    },
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function downloadExcel(
  rows,
  filename,
) {
  if (!rows.length) {
    return;
  }

  const worksheet =
    XLSX.utils.json_to_sheet(rows);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Report",
  );

  XLSX.writeFile(
    workbook,
    filename,
  );
}

export function downloadPDF({
  title,
  subtitle,
  columns,
  rows,
  filename,
}) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(title, 14, 18);

  doc.setFontSize(10);
  doc.text(subtitle, 14, 26);

  autoTable(doc, {
    startY: 34,
    head: [columns],
    body: rows,
    theme: "grid",
    styles: {
      fontSize: 9,
    },
    headStyles: {
      fontStyle: "bold",
    },
  });

  doc.save(filename);
}