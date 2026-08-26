const STORAGE_KEY = "cash-management-transactions";

export function getTransactions() {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);

    if (!storedData) {
      return [];
    }

    return JSON.parse(storedData);
  } catch (error) {
    console.error("Failed to load transactions:", error);
    return [];
  }
}

export function saveTransactions(transactions) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(transactions)
    );
  } catch (error) {
    console.error("Failed to save transactions:", error);
  }
}

export function clearTransactions() {
  localStorage.removeItem(STORAGE_KEY);
}