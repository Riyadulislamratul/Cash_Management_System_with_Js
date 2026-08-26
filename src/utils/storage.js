const STORAGE_KEY = "cash-management-transactions";

export function getTransactions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(
      "Error loading transactions:",
      error,
    );

    return [];
  }
}

export function saveTransactions(transactions) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(transactions),
    );
  } catch (error) {
    console.error(
      "Error saving transactions:",
      error,
    );
  }
}

export function clearTransactions() {
  localStorage.removeItem(STORAGE_KEY);
}