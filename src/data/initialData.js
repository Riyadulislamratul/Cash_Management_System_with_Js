export const initialTransactions = [
  {
    id: "demo-1",
    type: "income",
    amount: 50000,
    category: "Salary",
    account: "Cash",
    description: "Monthly salary",
    date: "2026-08-25",
  },
  {
    id: "demo-2",
    type: "expense",
    amount: 1200,
    category: "Food",
    account: "Cash",
    description: "Lunch and groceries",
    date: "2026-08-25",
  },
  {
    id: "demo-3",
    type: "expense",
    amount: 3500,
    category: "Shopping",
    account: "Bank",
    description: "Monthly shopping",
    date: "2026-08-24",
  },
];

export const initialAccounts = [
  {
    id: "cash",
    name: "Cash",
    type: "cash",
  },
  {
    id: "bank",
    name: "Bank",
    type: "bank",
  },
  {
    id: "mobile",
    name: "Mobile Banking",
    type: "mobile",
  },
];