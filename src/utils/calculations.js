const SETTINGS_KEY = "cash-manager-settings";

export function getCurrency() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);

    if (saved) {
      const settings = JSON.parse(saved);

      return settings.currency || "BDT";
    }
  } catch (error) {
    console.error(
      "Failed to load currency setting:",
      error,
    );
  }

  return "BDT";
}

export function formatCurrency(
  amount,
  currency = getCurrency(),
) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

export function calculateTotals(
  transactions,
) {
  const income = transactions
    .filter(
      (transaction) =>
        transaction.type === "income",
    )
    .reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount || 0),
      0,
    );

  const expense = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense",
    )
    .reduce(
      (total, transaction) =>
        total +
        Number(transaction.amount || 0),
      0,
    );

  return {
    income,
    expense,
    balance: income - expense,
  };
}

export function calculateAccountBalances(
  transactions,
) {
  const balances = {
    Cash: 0,
    Bank: 0,
    "Mobile Banking": 0,
  };

  transactions.forEach(
    (transaction) => {
      const account =
        transaction.account;

      if (
        !Object.prototype.hasOwnProperty.call(
          balances,
          account,
        )
      ) {
        return;
      }

      const amount =
        Number(transaction.amount) || 0;

      if (
        transaction.type === "income"
      ) {
        balances[account] += amount;
      }

      if (
        transaction.type === "expense"
      ) {
        balances[account] -= amount;
      }

      if (
        transaction.type === "transfer" &&
        transaction.transferType === "out"
      ) {
        balances[account] -= amount;
      }

      if (
        transaction.type === "transfer" &&
        transaction.transferType === "in"
      ) {
        balances[account] += amount;
      }
    },
  );

  return balances;
}