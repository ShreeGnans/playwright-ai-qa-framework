import { Page, Locator } from "@playwright/test";

export class CheckoutPage {
  private checkoutTitle: Locator;
  private firstNameInput: Locator;
  private lastNameInput: Locator;
  private postalCodeInput: Locator;
  private continueButton: Locator;
  private errorMessage: Locator;
  private checkOutInformationCancel: Locator;

  constructor(page: Page) {
    this.checkoutTitle = page.locator(".title");
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.checkOutInformationCancel = page.locator('[data-test="cancel"]');
  }

  async getCheckoutTitle(): Promise<string | null> {
    return await this.checkoutTitle.textContent();
  }

  async enterFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  async enterLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async enterPostalCode(postalCode: string): Promise<void> {
    await this.postalCodeInput.fill(postalCode);
  }
  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }
  getErrorMessage(): Locator {
    return this.errorMessage;
  }

  async clickCancelCheckOutOverview(): Promise<void> {
    await this.checkOutInformationCancel.click();
  }
}
