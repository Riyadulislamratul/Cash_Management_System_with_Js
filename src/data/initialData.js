export const initialTransactions = [
  {
    id: 1,
    type: "income",
    amount: 50000,
    category: "Salary",
    account: "Cash",
    description: "Monthly salary",
    date: "2026-08-25",
  },
  {
    id: 2,
    type: "expense",
    amount: 1200,
    category: "Food",
    account: "Cash",
    description: "Lunch and groceries",
    date: "2026-08-25",
  },
  {
    id: 3,
    type: "expense",
    amount: 3500,
    category: "Shopping",
    account: "Bank",
    description: "Monthly shopping",
    date: "2026-08-24",
  },
  {
    id: 4,
    type: "income",
    amount: 15000,
    category: "Freelance",
    account: "Bank",
    description: "Freelance project",
    date: "2026-08-23",
  },
];

export const initialAccounts = [
  {
    id: 1,
    name: "Cash",
    type: "cash",
  },
  {
    id: 2,
    name: "Bank",
    type: "bank",
  },
  {
    id: 3,
    name: "Mobile Banking",
    type: "mobile",
  },
];