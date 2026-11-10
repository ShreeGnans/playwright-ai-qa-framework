import { test, expect } from "../../fixtures/baseTest";
import { InventoryPage } from "../../pages/inventory.page";
import { CartPage } from "../../pages/cart.page";
import { CheckoutPage } from "../../pages/checkout.page";
import { CheckoutOverviewPage } from "../../pages/checkoutOverview.page";

test("ACART_001 -Verify cart items persist after navigating away and returning to the cart.", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBikeLightToCart();
  await expect(inventoryPage.getCartBadge()).toHaveText("2");
  await inventoryPage.openCart();
  const updatedProductName = await cartPage.getProductNames();

  expect(updatedProductName).toEqual([
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
  ]);
  await cartPage.clickContinueShopping();
  await expect(page).toHaveURL(/inventory.html/);
  await inventoryPage.openCart();
  const updatedProductNames = await cartPage.getProductNames();

  expect(updatedProductNames).toEqual([
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
  ]);
  await expect(inventoryPage.getCartBadge()).toHaveText("2");
});

test("ACART_002 -Verify that removing one product from the cart updates the cart badge and remaining cart items correctly.", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBikeLightToCart();
  await expect(inventoryPage.getCartBadge()).toHaveText("2");
  await inventoryPage.openCart();
  const updatedProductName = await cartPage.getProductNames();

  expect(updatedProductName).toEqual([
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
  ]);
  await cartPage.removeBackpackButton();
  const productName = await cartPage.getProductName();
  expect(productName).toBe("Sauce Labs Bike Light");
  await expect(inventoryPage.getCartBadge()).toHaveText("1");
});

test("ACART_003 -Verify cart behaviour after removing all products.", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBikeLightToCart();
  await inventoryPage.addBoltTshirtToCart();
  await expect(inventoryPage.getCartBadge()).toHaveText("3");
  await inventoryPage.openCart();
  await cartPage.removeBackpackButton();
  await cartPage.removeBikeLightButton();
  await cartPage.removeBoltTshirtButton();
  await expect(inventoryPage.isCartBadgeHidden()).toBeTruthy();
});
