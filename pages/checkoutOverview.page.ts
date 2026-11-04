import { Page, Locator } from "@playwright/test";

export class CheckoutOverviewPage {
  private productName: Locator;
  private quantity: Locator;
  private price: Locator;
  private itemTotal: Locator;
  private tax: Locator;
  private total: Locator;
  private finishButton: Locator;
  private cancelButton: Locator;

  constructor(page: Page) {
    this.productName = page.locator('[data-test="inventory-item-name"]');
    this.quantity = page.locator('[data-test="item-quantity"]');
    this.price = page.locator('[data-test="inventory-item-price"]');
    this.itemTotal = page.locator('[data-test = "subtotal-label"]');
    this.tax = page.locator('[data-test = "tax-label"]');
    this.total = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
  }

  async getProductName(): Promise<string | null> {
    return await this.productName.textContent();
  }
  async getQuantity(): Promise<string | null> {
    return await this.quantity.textContent();
  }

  async getPrice(): Promise<string | null> {
    return await this.price.textContent();
  }

  async getItemTotal(): Promise<string | null> {
    return await this.itemTotal.textContent();
  }

  async getTax(): Promise<string | null> {
    return await this.tax.textContent();
  }
  async getTotal(): Promise<string | null> {
    return await this.total.textContent();
  }

  async clickFinish(): Promise<void> {
    await this.finishButton.click();
  }
  async clickCancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
