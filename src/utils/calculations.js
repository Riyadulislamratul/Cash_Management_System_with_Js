export function formatCurrency(amount, currency = "BDT") {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

export function calculateTotals(transactions) {
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

  transactions.forEach((transaction) => {
    const account =
      transaction.account;

    // Ignore unknown accounts
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

    // Income increases account balance
    if (
      transaction.type === "income"
    ) {
      balances[account] += amount;
    }

    // Expense decreases account balance
    if (
      transaction.type === "expense"
    ) {
      balances[account] -= amount;
    }

    // Transfer out decreases source account
    if (
      transaction.type === "transfer" &&
      transaction.transferType === "out"
    ) {
      balances[account] -= amount;
    }

    // Transfer in increases destination account
    if (
      transaction.type === "transfer" &&
      transaction.transferType === "in"
    ) {
      balances[account] += amount;
    }
  });

  return balances;
}