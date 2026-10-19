/**
 * State Management Class
 * Handles state updates and logic (calculations, sorting and filtering data).
 */
export class ExpenseState {
  /**
   * @param {StorageService} storageService - Storage dependency
   */
  constructor(storageService) {
    this.storageService = storageService;
    this.expenses = this.storageService.getExpenses();

    this.listeners = [];
  }

  /**
   * Register a subscriber callback for state changes.
   * @param {Function} listener - Function is executed whenever there is change in state.
   */
  subscribe(listener) {
    this.listeners.push(listener);
  }

  /**
   * Notifies all subscribers when state changes.
   */
  notify() {
    this.listeners.forEach((listener) => listener(this));
  }

  /**
   * Add a new expense to the state and localStorage
   * @param {Object} expenseData - {name, amount, category}
   */
  addExpense(expenseData) {
    const newExpense = {
      id: crypto.randomUUID ? crypto.randomUUID() : "exp-" + Date.now(),
      name: expenseData.name.trim(),
      amount: parseFloat(expenseData.amount),
      category: expenseData.category,
      createdAt: new Date().toISOString(),
    };

    this.expenses.unshift(newExpense);
    this.saveAndNotify();
  }

  /**
   * Removes an expense by its ID.
   * @param {string} id
   */
  deleteExpense(id) {
    this.expenses = this.expenses.filter((exp) => exp.id != id);
    this.saveAndNotify();
  }

  /**
   * Save current array state to LocalStorage and trigger observers.
   */
  saveAndNotify() {
    this.storageService.saveExpenses(this.expenses);
    this.notify();
  }

  /**
   * Calculates total expenses balance
   */
  getTotalBalance() {
    const totalAmount = this.expenses.reduce(
      (sum, item) => sum + item.amount,
      0,
    );

    return totalAmount;
  }
}
