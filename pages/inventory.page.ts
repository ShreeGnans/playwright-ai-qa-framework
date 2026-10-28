import { Page, Locator } from "@playwright/test";

export class InventoryPage {
  private productsTitle: Locator;
  private productItems: Locator;
  private productNames: Locator;
  private productPrices: Locator;
  private addBackpackButton: Locator;
  private addBikeLightButton: Locator;
  private removeBackpackButton: Locator;
  private cartBadge: Locator;
  private cartIcon: Locator;
  private page: Page;

  constructor(page: Page) {
    this.productsTitle = page.locator(".title");
    this.productItems = page.locator(".inventory_item");
    this.productNames = page.locator(".inventory_item_name");
    this.productPrices = page.locator(".inventory_item_price");

    this.addBackpackButton = page.locator(
      '[data-test="add-to-cart-sauce-labs-backpack"]',
    );

    this.addBikeLightButton = page.locator(
      '[data-test="add-to-cart-sauce-labs-bike-light"]',
    );

    this.removeBackpackButton = page.locator(
      '[data-test="remove-sauce-labs-backpack"]',
    );

    this.cartBadge = page.locator(".shopping_cart_badge");
    this.cartIcon = page.locator(".shopping_cart_link");
    this.page = page;
  }

  async getProductsTitle(): Promise<string | null> {
    return await this.productsTitle.textContent();
  }

  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  async getProductNames(): Promise<string[]> {
    return await this.productNames.allTextContents();
  }

  async getProductPrices(): Promise<string[]> {
    return await this.productPrices.allTextContents();
  }

  async addBackpackToCart(): Promise<void> {
    await this.addBackpackButton.click();
  }

  async addBikeLightToCart(): Promise<void> {
    await this.addBikeLightButton.click();
  }

  async removeBackpackFromCart(): Promise<void> {
    await this.removeBackpackButton.click();
  }

  async getCartBadgeCount(): Promise<string | null> {
    return await this.cartBadge.textContent();
  }

  getCartBadge(): Locator {
    return this.cartBadge;
  }

  async isCartBadgeHidden(): Promise<boolean> {
    return await this.cartBadge.isHidden();
  }

  async openCart(): Promise<void> {
    await this.cartIcon.click();
  }
  async addProductToCart(productName: string): Promise<void> {
    const product = this.page
      .locator(".inventory_item")
      .filter({ hasText: productName });
    await product.getByRole("button", { name: "Add to cart " }).click();
  }
}
