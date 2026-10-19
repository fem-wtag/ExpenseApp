//LocalStorage Controller Class - Handles persistent storage operations.

export class StorageService {
  /**
   * @param {string} storageKey
   */
  constructor(storageKey = "js_expense_tracker_data") {
    this.STORAGE_KEY = storageKey;
  }

  /**
   * Gets all expenses stored in LocalStorage in an Array.
   * @returns {Array}
   */
  getExpenses() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error fetching data from LocalStorage: ", error);
      return [];
    }
  }

  /**
   * Overwrites existing expense array in LocalStorage.
   * @param {Array} expenses - Array of expenses to persist.
   * @returns {boolean} - Returns true if data was written.
   */
  saveExpenses(expenses) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(expenses));
      return true;
    } catch (error) {
      console.error("Error saving data to localStorage: ", error);
      return false;
    }
  }
}
