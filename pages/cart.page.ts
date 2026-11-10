import { Page, Locator } from "@playwright/test";

export class CartPage {
  private cartTitle: Locator;
  private productName: Locator;
  private productPrice: Locator;
  private checkoutButton: Locator;
  private productNames: Locator;
  private removeBackpack: Locator;
  private continueButton: Locator;
  private removeBikeLight: Locator;
  private removeBoltTshirt: Locator;

  constructor(page: Page) {
    this.cartTitle = page.locator(".title");
    this.productName = page.locator(".inventory_item_name");
    this.productPrice = page.locator(".inventory_item_price");
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.productNames = page.locator(".inventory_item_name");
    this.removeBackpack = page.locator(
      '[data-test="remove-sauce-labs-backpack"]',
    );
    this.continueButton = page.locator('[data-test="continue-shopping"]');
    this.removeBikeLight = page.locator(
      '[data-test="remove-sauce-labs-bike-light"]',
    );
    this.removeBoltTshirt = page.locator(
      '[data-test="remove-sauce-labs-bolt-t-shirt"]',
    );
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

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
  async getProductNames(): Promise<string[]> {
    return await this.productNames.allTextContents();
  }

  async removeBackpackButton(): Promise<void> {
    return await this.removeBackpack.click();
  }
  async removeBikeLightButton(): Promise<void> {
    return await this.removeBikeLight.click();
  }
  async removeBoltTshirtButton(): Promise<void> {
    return await this.removeBoltTshirt.click();
  }
  async clickContinueShopping(): Promise<void> {
    return this.continueButton.click();
  }
}
