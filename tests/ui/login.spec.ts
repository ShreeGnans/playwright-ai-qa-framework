import { test, expect } from "../../fixtures/baseTest";
import { loginTestData } from "../../test-data/loginData";

test.beforeEach(async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
});

// Valid login
test("SD_LOGIN_001 - Verify valid user login", async ({ loginPage, page }) => {
  await loginPage.login("standard_user", "secret_sauce");

  await expect(page).toHaveURL(/inventory.html/);
});

// Data-driven invalid login tests
for (const data of loginTestData) {
  test(data.testId, async ({ page, loginPage }) => {
    if (data.description !== undefined) {
      console.log(data.description);
    }

    await loginPage.login(data.username, data.password);

    const errorMessage = page.locator('[data-test="error"]');

    await expect(errorMessage).toBeVisible();

    await expect(errorMessage).toHaveText(data.expectedError);

    await expect(page).toHaveURL("https://www.saucedemo.com/");
  });
}
