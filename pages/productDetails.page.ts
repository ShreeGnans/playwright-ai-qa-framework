import { Page, Locator } from "@playwright/test";

export class ProductDetailsPage {
  private productName: Locator;
  private productDescription: Locator;
  private productPrice: Locator;
  private addToCart: Locator;
  private removeButton: Locator;
  private productActionButton: Locator;
  private backToProducts: Locator;

  constructor(page: Page) {
    this.productName = page.locator(".inventory_details_name");
    this.productDescription = page.locator(".inventory_details_desc");
    this.productPrice = page.locator(".inventory_details_price");
    this.addToCart = page.locator('[data-test="add-to-cart"]');
    this.removeButton = page.locator('[data-test="remove"]');
    this.productActionButton = page.locator(
      ".inventory_details_container [data-test='add-to-cart'], .inventory_details_container [data-test='remove']",
    );
    this.backToProducts = page.locator('[data-test = "back-to-products"]');
  }

  async getProductName(): Promise<string | null> {
    return await this.productName.textContent();
  }
  async getProductDescription(): Promise<string | null> {
    return await this.productDescription.textContent();
  }
  async getProductPrice(): Promise<string | null> {
    return await this.productPrice.textContent();
  }
  async clickAddToCart(): Promise<void> {
    await this.addToCart.click();
  }
  async clickRemoveButton(): Promise<void> {
    await this.removeButton.click();
  }
  async clickBackToProducts(): Promise<void> {
    await this.backToProducts.click();
  }
  async getAddToCartButtonText(): Promise<string | null> {
    return await this.productActionButton.textContent();
  }
}
