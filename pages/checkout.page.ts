import { Page, Locator } from "@playwright/test";

export class CheckoutPage {
  private checkoutTitle: Locator;
  constructor(page: Page) {
    this.checkoutTitle = page.locator(".title");
  }

  async getCheckoutTitle(): Promise<string | null> {
    return await this.checkoutTitle.textContent();
  }
}
