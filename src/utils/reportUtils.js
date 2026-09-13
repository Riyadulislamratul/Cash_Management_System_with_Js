import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

/* =========================================================
   FILTER TRANSACTIONS
========================================================= */

export function getReportTransactions(
  transactions,
  startDate = "",
  endDate = "",
) {
  return transactions.filter((transaction) => {
    // Transfers are not income/expense transactions
    if (transaction.type === "transfer") {
      return false;
    }

    const transactionDate = String(
      transaction.date || "",
    ).slice(0, 10);

    if (!transactionDate) {
      return false;
    }

    if (startDate && transactionDate < startDate) {
      return false;
    }

    if (endDate && transactionDate > endDate) {
      return false;
    }

    return true;
  });
}

/* =========================================================
   TOTALS
========================================================= */

export function getReportTotals(transactions) {
  const income = transactions
    .filter(
      (transaction) =>
        transaction.type === "income",
    )
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount || 0),
      0,
    );

  const expense = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense",
    )
    .reduce(
      (sum, transaction) =>
        sum + Number(transaction.amount || 0),
      0,
    );

  return {
    income,
    expense,
    balance: income - expense,
  };
}

/* =========================================================
   CATEGORY REPORT
========================================================= */

export function groupByCategory(transactions) {
  const groups = {};

  transactions.forEach((transaction) => {
    const category =
      transaction.category || "Other";

    if (!groups[category]) {
      groups[category] = {
        category,
        income: 0,
        expense: 0,
      };
    }

    const amount =
      Number(transaction.amount) || 0;

    if (transaction.type === "income") {
      groups[category].income += amount;
    }

    if (transaction.type === "expense") {
      groups[category].expense += amount;
    }
  });

  return Object.values(groups);
}

/* =========================================================
   ACCOUNT REPORT
========================================================= */

export function groupByAccount(transactions) {
  const groups = {};

  transactions.forEach((transaction) => {
    const account =
      transaction.account || "Unknown";

    if (!groups[account]) {
      groups[account] = {
        account,
        income: 0,
        expense: 0,
        transferIn: 0,
        transferOut: 0,
        balance: 0,
      };
    }

    const amount =
      Number(transaction.amount) || 0;

    if (transaction.type === "income") {
      groups[account].income += amount;
    }

    if (transaction.type === "expense") {
      groups[account].expense += amount;
    }

    if (
      transaction.type === "transfer" &&
      transaction.transferType === "in"
    ) {
      groups[account].transferIn += amount;
    }

    if (
      transaction.type === "transfer" &&
      transaction.transferType === "out"
    ) {
      groups[account].transferOut += amount;
    }
  });

  return Object.values(groups).map(
    (item) => ({
      ...item,

      balance:
        item.income -
        item.expense +
        item.transferIn -
        item.transferOut,
    }),
  );
}

/* =========================================================
   DAILY REPORT
========================================================= */

export function groupByDate(transactions) {
  const groups = {};

  transactions.forEach((transaction) => {
    const date = String(
      transaction.date || "",
    ).slice(0, 10);

    if (!date) return;

    if (!groups[date]) {
      groups[date] = {
        date,
        income: 0,
        expense: 0,
        balance: 0,
      };
    }

    const amount =
      Number(transaction.amount) || 0;

    if (transaction.type === "income") {
      groups[date].income += amount;
    }

    if (transaction.type === "expense") {
      groups[date].expense += amount;
    }

    groups[date].balance =
      groups[date].income -
      groups[date].expense;
  });

  return Object.values(groups).sort(
    (a, b) =>
      a.date.localeCompare(b.date),
  );
}

/* =========================================================
   MONTHLY REPORT
========================================================= */

export function groupByMonth(transactions) {
  const groups = {};

  transactions.forEach((transaction) => {
    const month = String(
      transaction.date || "",
    ).slice(0, 7);

    if (!month) return;

    if (!groups[month]) {
      groups[month] = {
        month,
        income: 0,
        expense: 0,
        balance: 0,
      };
    }

    const amount =
      Number(transaction.amount) || 0;

    if (transaction.type === "income") {
      groups[month].income += amount;
    }

    if (transaction.type === "expense") {
      groups[month].expense += amount;
    }

    groups[month].balance =
      groups[month].income -
      groups[month].expense;
  });

  return Object.values(groups).sort(
    (a, b) =>
      a.month.localeCompare(b.month),
  );
}

/* =========================================================
   YEARLY REPORT
========================================================= */

export function groupByYear(transactions) {
  const groups = {};

  transactions.forEach((transaction) => {
    const year = String(
      transaction.date || "",
    ).slice(0, 4);

    if (!year) return;

    if (!groups[year]) {
      groups[year] = {
        year,
        income: 0,
        expense: 0,
        balance: 0,
      };
    }

    const amount =
      Number(transaction.amount) || 0;

    if (transaction.type === "income") {
      groups[year].income += amount;
    }

    if (transaction.type === "expense") {
      groups[year].expense += amount;
    }

    groups[year].balance =
      groups[year].income -
      groups[year].expense;
  });

  return Object.values(groups).sort(
    (a, b) =>
      a.year.localeCompare(b.year),
  );
}

/* =========================================================
   CSV DOWNLOAD
========================================================= */

export function downloadCSV(
  rows,
  filename,
) {
  if (!rows || !rows.length) {
    return;
  }

  const headers = Object.keys(rows[0]);

  const csvRows = [
    headers.join(","),

    ...rows.map((row) =>
      headers
        .map((header) => {
          const value =
            row[header] ?? "";

          return `"${String(value).replaceAll(
            '"',
            '""',
          )}"`;
        })
        .join(","),
    ),
  ];

  const csv = csvRows.join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

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

/* =========================================================
   EXCEL DOWNLOAD
========================================================= */

export function downloadExcel(
  rows,
  filename,
) {
  if (!rows || !rows.length) {
    return;
  }

  try {
    // Create worksheet from JSON data
    const worksheet =
      XLSX.utils.json_to_sheet(rows);

    // Create workbook
    const workbook =
      XLSX.utils.book_new();

    // Add worksheet
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Report",
    );

    // Automatically adjust column widths
    const headers = Object.keys(rows[0]);

    worksheet["!cols"] = headers.map(
      (header) => {
        const maxLength = Math.max(
          header.length,

          ...rows.map((row) =>
            String(
              row[header] ?? "",
            ).length,
          ),
        );

        return {
          wch: Math.min(
            Math.max(maxLength + 2, 12),
            30,
          ),
        };
      },
    );

    // Download Excel file
    XLSX.writeFile(
      workbook,
      filename,
    );
  } catch (error) {
    console.error(
      "Excel download failed:",
      error,
    );

    alert(
      "Unable to create the Excel file. Please try again.",
    );
  }
}

/* =========================================================
   PDF DOWNLOAD
========================================================= */

export function downloadPDF({
  title,
  subtitle,
  columns,
  rows,
  filename,
}) {
  if (!rows || !rows.length) {
    return;
  }

  try {
    // Create PDF
    const doc = new jsPDF({
      orientation:
        columns.length > 5
          ? "landscape"
          : "portrait",

      unit: "mm",

      format: "a4",
    });

    /* -----------------------------------------------------
       TITLE
    ----------------------------------------------------- */

    doc.setFontSize(18);

    doc.setFont("helvetica", "bold");

    doc.text(
      title || "Cash Management Report",
      14,
      18,
    );

    /* -----------------------------------------------------
       SUBTITLE
    ----------------------------------------------------- */

    if (subtitle) {
      doc.setFontSize(9);

      doc.setFont(
        "helvetica",
        "normal",
      );

      doc.text(
        subtitle,
        14,
        25,
      );
    }

    /* -----------------------------------------------------
       GENERATED DATE
    ----------------------------------------------------- */

    const generatedDate =
      new Date().toLocaleDateString(
        "en-BD",
      );

    doc.setFontSize(8);

    doc.text(
      `Generated: ${generatedDate}`,
      14,
      31,
    );

    /* -----------------------------------------------------
       TABLE
    ----------------------------------------------------- */

    autoTable(doc, {
      startY: 38,

      head: [columns],

      body: rows,

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 3,
        overflow: "linebreak",
      },

      headStyles: {
        fontStyle: "bold",
      },

      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },

      margin: {
        top: 38,
        right: 14,
        bottom: 20,
        left: 14,
      },

      didDrawPage: function (data) {
        const pageNumber =
          doc.internal.getNumberOfPages();

        const pageHeight =
          doc.internal.pageSize.height;

        doc.setFontSize(8);

        doc.setFont(
          "helvetica",
          "normal",
        );

        doc.text(
          `Page ${pageNumber}`,
          data.settings.margin.left,
          pageHeight - 8,
        );
      },
    });

    /* -----------------------------------------------------
       SAVE PDF
    ----------------------------------------------------- */

    doc.save(filename);
  } catch (error) {
    console.error(
      "PDF download failed:",
      error,
    );

    alert(
      "Unable to create the PDF file. Please try again.",
    );
  }
}