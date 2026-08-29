import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { initialTransactions } from "../data/initialData";

import {
  calculateAccountBalances,
  calculateTotals,
} from "../utils/calculations";

const CashContext = createContext(null);

const STORAGE_KEY =
  "cash-management-transactions";

export function CashProvider({ children }) {
  const [transactions, setTransactions] = useState(
    () => {
      try {
        const saved =
          localStorage.getItem(STORAGE_KEY);

        if (saved) {
          return JSON.parse(saved);
        }

        return initialTransactions;
      } catch (error) {
        console.error(
          "Failed to load transactions:",
          error,
        );

        return initialTransactions;
      }
    },
  );

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(transactions),
    );
  }, [transactions]);

  const totals = useMemo(
    () => calculateTotals(transactions),
    [transactions],
  );

  const accountBalances = useMemo(
    () =>
      calculateAccountBalances(transactions),
    [transactions],
  );

  const addTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
      amount: Number(transaction.amount),
      createdAt: new Date().toISOString(),
    };

    setTransactions((current) => [
      newTransaction,
      ...current,
    ]);
  };

  const updateTransaction = (
    id,
    updatedTransaction,
  ) => {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.id === id
          ? {
              ...transaction,
              ...updatedTransaction,
              amount: Number(
                updatedTransaction.amount,
              ),
            }
          : transaction,
      ),
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((current) =>
      current.filter(
        (transaction) => transaction.id !== id,
      ),
    );
  };

  const addTransfer = ({
    fromAccount,
    toAccount,
    amount,
    date,
    description,
  }) => {
    const numericAmount = Number(amount);

    if (
      !fromAccount ||
      !toAccount ||
      fromAccount === toAccount ||
      numericAmount <= 0
    ) {
      return false;
    }

    const transferId = crypto.randomUUID();

    const outgoing = {
      id: `${transferId}-out`,
      type: "transfer",
      transferType: "out",
      amount: numericAmount,
      account: fromAccount,
      category: "Transfer",
      description:
        description ||
        `Transfer to ${toAccount}`,
      date,
      transferId,
      relatedAccount: toAccount,
      createdAt: new Date().toISOString(),
    };

    const incoming = {
      id: `${transferId}-in`,
      type: "transfer",
      transferType: "in",
      amount: numericAmount,
      account: toAccount,
      category: "Transfer",
      description:
        description ||
        `Transfer from ${fromAccount}`,
      date,
      transferId,
      relatedAccount: fromAccount,
      createdAt: new Date().toISOString(),
    };

    setTransactions((current) => [
      incoming,
      outgoing,
      ...current,
    ]);

    return true;
  };

  const value = {
    transactions,

    totalIncome: totals.income,
    totalExpense: totals.expense,
    totalCash: totals.balance,

    accountBalances,

    addTransaction,
    updateTransaction,
    deleteTransaction,
    addTransfer,
  };

  return (
    <CashContext.Provider value={value}>
      {children}
    </CashContext.Provider>
  );
}

export function useCash() {
  const context = useContext(CashContext);

  if (!context) {
    throw new Error(
      "useCash must be used inside CashProvider",
    );
  }

  return context;
}