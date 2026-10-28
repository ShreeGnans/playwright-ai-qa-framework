import { test, expect } from "../../fixtures/baseTest";
import { InventoryPage } from "../../pages/inventory.page";
import { CartPage } from "../../pages/cart.page";
import { CheckoutPage } from "../../pages/checkout.page";

test("CHK_001 - Verify Checkout Information Page", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await inventoryPage.addBackpackToCart();

  await inventoryPage.openCart();
  await cartPage.clickCheckout();
  await expect(page).toHaveURL(/checkout-step-one\.html/);
  const title = await checkoutPage.getCheckoutTitle();
  expect(title).toBe("Checkout: Your Information");
});
