import { createContext, useContext, useMemo, useState } from "react";
import { initialAccounts, initialTransactions } from "../data/initialData";

const CashContext = createContext(null);

export function CashProvider({ children }) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [accounts] = useState(initialAccounts);

  const totalIncome = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((total, transaction) => total + transaction.amount, 0);
  }, [transactions]);

  const totalCash = totalIncome - totalExpense;

  const value = {
    transactions,
    setTransactions,
    accounts,
    totalIncome,
    totalExpense,
    totalCash,
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
    throw new Error("useCash must be used inside CashProvider");
  }

  return context;
}