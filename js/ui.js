/**
 * User Interface Controller Module
 * Handles DOM updates, form validation and dynamic HTML
 */

export class UIRenderer {
  constructor() {
    this.totalBalanceEl = document.getElementById("total-balance");
    this.tableBodyEl = document.getElementById("expense-list-tbody");
    this.emptyStateEl = document.getElementById("empty-state");

    this.formEl = document.getElementById("expense-form");
    this.nameInput = document.getElementById("expense-name");
    this.amountInput = document.getElementById("expense-amount");
    this.categoryInput = document.getElementById("expense-category");
  }

  /**
   * Format numbers into USD currency
   */
  formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value || 0);
  }

  /**
   * Updates total expense amount on the UI
   */
  renderTotalExpenseAmount(totalAmount) {
    this.totalBalanceEl.textContent = this.formatCurrency(totalAmount);
  }

  /**
   * Dynamically update table rows
   */
  renderExpenseList(expenses) {
    this.tableBodyEl.innerHTML = "";

    if (expenses.length === 0) {
      this.emptyStateEl.classList.remove("hidden");
      return;
    }

    this.emptyStateEl.classList.add("hidden");

    const fragment = document.createDocumentFragment();

    expenses.forEach((expense) => {
      const tr = document.createElement("tr");
      tr.setAttribute("data-id", expense.id);

      tr.innerHTML = `
        <td><strong>${this.escapeHTML(expense.name)}</strong></td>
        <td><span class="category-badge">${this.escapeHTML(expense.category)}</span></td>
        <td class="text-right"><strong>${this.formatCurrency(expense.amount)}</strong></td>
        <td class="text-center">
            <button class="btn-delete" title="Delete Expense" data-id="${expense.id}">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        </td>
      `;

      fragment.appendChild(tr);
    });

    this.tableBodyEl.appendChild(fragment);
  }

  /**
   * Form input validation
   */
  validateForm() {
    let isValid = true;
    this.clearErrors();

    if (!this.nameInput.value.trim()) {
      this.showInputError("name-error", "Please enter a valid expense name.");
      this.nameInput.classList.add("invalid");
      isValid = false;
    }

    const amount = parseFloat(this.amountInput.value);
    if (isNaN(amount) || amount <= 0) {
      this.showInputError(
        "amount-error",
        "Please enter an amount greater than 0.",
      );
      this.amountInput.classList.add("invalid");
      isValid = false;
    }

    if (!this.categoryInput.value) {
      this.showInputError("category-error", "Please select a category.");
      this.categoryInput.classList.add("invalid");
      isValid = false;
    }

    return isValid;
  }

  showInputError(elementId, message) {
    document.getElementById(elementId).textContent = message;
  }

  clearErrors() {
    ["name-error", "amount-error", "category-error"].forEach((id) => {
      document.getElementById(id).textContent = "";
    });
    [this.nameInput, this.amountInput, this.categoryInput].forEach((el) => {
      el.classList.remove("invalid");
    });
  }

  getFormData() {
    return {
      name: this.nameInput.value,
      amount: this.amountInput.value,
      category: this.categoryInput.value,
    };
  }

  resetForm() {
    this.formEl.reset();
    this.clearErrors();
  }

  /**
   * Prevents XSS attacks by sanitizing string inputs.
   * Safely handles undefined or null inputs.
   */
  escapeHTML(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(
      /[&<>'"]/g,
      (tag) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[tag] || tag,
    );
  }
}
