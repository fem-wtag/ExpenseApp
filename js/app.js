import { StorageService } from "./storage.js";
import { ExpenseState } from "./state.js";
import { UIRenderer } from "./ui.js";

/**
 * Application core bootstrapper
 */
class ExpenseApp {
  constructor() {
    this.storageService = new StorageService();
    this.state = new ExpenseState(this.storageService);
    this.ui = new UIRenderer();

    this.init();
  }

  /**
   * Initialize app
   */
  init() {
    //Subscribe view updates to state observer
    this.state.subscribe((stateInstance) =>
      this.handleStateChange(stateInstance),
    );

    //Bind DOM event listeners
    this.bindEvents();

    //Trigger initial rendering
    this.state.notify();
  }

  /**
   * Reactive state listener calback triggered when state mutates
   */
  handleStateChange(state) {
    const amountTotal = state.getTotalBalance();

    this.ui.renderExpenseList(state.expenses);
    this.ui.renderTotalExpenseAmount(state.getTotalBalance());
  }

  /**
   * Bind event handlers
   */
  bindEvents() {
    //Expense form submission
    document.getElementById("expense-form").addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.ui.validateForm()) {
        const formData = this.ui.getFormData();
        this.state.addExpense(formData);
        this.ui.resetForm();
      }
    });

    document
      .getElementById("expense-list-tbody")
      .addEventListener("click", (e) => {
        const deleteBtn = e.target.closest(".btn-delete");
        if (deleteBtn) {
          const id = deleteBtn.getAttribute("data-id");
          if (confirm("Are you sure you want to delete this expense entry?")) {
            this.state.deleteExpense(id);
          }
        }
      });
  }
}

//Instantiate application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new ExpenseApp();
});
