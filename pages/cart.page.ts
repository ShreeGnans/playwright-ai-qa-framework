import { Page, Locator } from "@playwright/test";

export class CartPage {
  private cartTitle: Locator;
  private productName: Locator;
  private productPrice: Locator;

  constructor(page: Page) {
    this.cartTitle = page.locator(".title");
    this.productName = page.locator(".inventory_item_name");
    this.productPrice = page.locator(".inventory_item_price");
  }

  async getCartTitle(): Promise<string | null> {
    return await this.cartTitle.textContent();
  }

  async getProductName(): Promise<string | null> {
    return await this.productName.textContent();
  }

  async getProductPrice(): Promise<string | null> {
    return await this.productPrice.textContent();
  }
}
