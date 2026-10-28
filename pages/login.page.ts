import { Page } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  async enterUsername(username: string): Promise<void> {
    await this.page.getByPlaceholder("Username").fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.page.getByPlaceholder("Password").fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.page.getByRole("button", { name: "Login" }).click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }
}
