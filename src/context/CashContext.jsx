import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { initialTransactions, initialAccounts } from "../data/initialData";
import {
  getTransactions,
  saveTransactions,
} from "../utils/storage";

const CashContext = createContext(null);

export function CashProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const storedTransactions = getTransactions();

    if (storedTransactions.length > 0) {
      return storedTransactions;
    }

    return initialTransactions;
  });

  const [accounts] = useState(initialAccounts);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

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

  const updateTransaction = (id, updatedTransaction) => {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.id === id
          ? {
              ...transaction,
              ...updatedTransaction,
              amount: Number(updatedTransaction.amount),
            }
          : transaction
      )
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((current) =>
      current.filter((transaction) => transaction.id !== id)
    );
  };

  const totalIncome = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      );
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      );
  }, [transactions]);

  const totalCash = totalIncome - totalExpense;

  const value = {
    transactions,
    accounts,

    totalIncome,
    totalExpense,
    totalCash,

    addTransaction,
    updateTransaction,
    deleteTransaction,
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
      "useCash must be used inside CashProvider"
    );
  }

  return context;
}