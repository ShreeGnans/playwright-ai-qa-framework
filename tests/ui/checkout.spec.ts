import { test, expect } from "../../fixtures/baseTest";
import { InventoryPage } from "../../pages/inventory.page";
import { CartPage } from "../../pages/cart.page";
import { CheckoutPage } from "../../pages/checkout.page";
import { CheckoutOverviewPage } from "../../pages/checkoutOverview.page";

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

test("CHK_002 - Verify Valid Checkout Information", async ({
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
  await checkoutPage.enterFirstName("Priya");
  await checkoutPage.enterLastName("Kumar");
  await checkoutPage.enterPostalCode("600001");
  await checkoutPage.clickContinue();
  await expect(page).toHaveURL(/checkout-step-two\.html/);
});

test("CHK_003 - Verify Mandatory First Name Validation", async ({
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
  await checkoutPage.enterFirstName("");
  await checkoutPage.enterLastName("Kumar");
  await checkoutPage.enterPostalCode("600001");
  await checkoutPage.clickContinue();
  await expect(checkoutPage.getErrorMessage()).toHaveText(
    "Error: First Name is required",
  );
  await expect(page).toHaveURL(/checkout-step-one\.html/);
});

test("CHK_004 - CHK_004 — Verify Mandatory Last Name Validation", async ({
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
  await checkoutPage.enterFirstName("Priya");
  await checkoutPage.enterLastName("");
  await checkoutPage.enterPostalCode("600001");
  await checkoutPage.clickContinue();
  await expect(checkoutPage.getErrorMessage()).toHaveText(
    "Error: Last Name is required",
  );
  await expect(page).toHaveURL(/checkout-step-one\.html/);
});

test("CHK_005 - Verify Mandatory Postal Code Validation", async ({
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
  await checkoutPage.enterFirstName("Priya");
  await checkoutPage.enterLastName("Kumar");
  await checkoutPage.enterPostalCode("");
  await checkoutPage.clickContinue();
  await expect(checkoutPage.getErrorMessage()).toHaveText(
    "Error: Postal Code is required",
  );
  await expect(page).toHaveURL(/checkout-step-one\.html/);
});

test("CHK_006 - Verify Validation When All Checkout Fields Are Empty", async ({
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
  await checkoutPage.enterFirstName("");
  await checkoutPage.enterLastName("");
  await checkoutPage.enterPostalCode("");
  await checkoutPage.clickContinue();
  await expect(checkoutPage.getErrorMessage()).toHaveText(
    "Error: First Name is required",
  );
  await expect(page).toHaveURL(/checkout-step-one\.html/);
});

test("CHK_007 - Verify Valid Checkout Details in CheckoutOverview", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const checkoutOverviewPage = new CheckoutOverviewPage(page);

  await inventoryPage.addBackpackToCart();

  await inventoryPage.openCart();
  await cartPage.clickCheckout();

  await checkoutPage.enterFirstName("Priya");
  await checkoutPage.enterLastName("Kumar");
  await checkoutPage.enterPostalCode("600001");
  await checkoutPage.clickContinue();

  await expect(page).toHaveURL(/checkout-step-two\.html/);

  const name = await checkoutOverviewPage.getProductName();
  const quantity = await checkoutOverviewPage.getQuantity();
  const price = await checkoutOverviewPage.getPrice();

  expect(name).toBe("Sauce Labs Backpack");
  expect(quantity).toBe("1");
  expect(price).toBe("$29.99");
});

test("CHK_008 - VVerify Item Total, Tax and Total Amoun", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const checkoutOverviewPage = new CheckoutOverviewPage(page);

  await inventoryPage.addBackpackToCart();

  await inventoryPage.openCart();
  await cartPage.clickCheckout();

  await checkoutPage.enterFirstName("Priya");
  await checkoutPage.enterLastName("Kumar");
  await checkoutPage.enterPostalCode("600001");
  await checkoutPage.clickContinue();

  await expect(page).toHaveURL(/checkout-step-two\.html/);

  const itemTotal = await checkoutOverviewPage.getItemTotal();
  const tax = await checkoutOverviewPage.getTax();
  const total = await checkoutOverviewPage.getTotal();

  if (itemTotal === null || tax === null || total === null) {
    throw new Error("Checkout price details are missing");
  }

  const itemAmo = itemTotal.replace("Item total: ", "");
  expect(itemAmo).toBe("$29.99");

  const taxAmo = tax.replace("Tax: ", "");
  expect(taxAmo).toBe("$2.40");

  const totalAmo = total.replace("Total: ", "");
  expect(totalAmo).toBe("$32.39");

  // Convert extracted amounts into numbers
  const itemAmount = Number(itemAmo.replace("$", ""));
  const taxAmount = Number(taxAmo.replace("$", ""));
  const finalAmount = Number(totalAmo.replace("$", ""));

  console.log("Item Amount:", itemAmount);
  console.log("Tax Amount:", taxAmount);
  console.log("Final Amount:", finalAmount);

  // Verify calculation
  expect(itemAmount + taxAmount).toBeCloseTo(finalAmount, 2);
});

test("CHK_009 - Verify Checkout Overview with Multiple Products.", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const checkoutOverviewPage = new CheckoutOverviewPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBikeLightToCart();

  await inventoryPage.openCart();
  await cartPage.clickCheckout();

  await checkoutPage.enterFirstName("Priya");
  await checkoutPage.enterLastName("Kumar");
  await checkoutPage.enterPostalCode("600001");
  await checkoutPage.clickContinue();

  await expect(page).toHaveURL(/checkout-step-two\.html/);

  const itemTotal = await checkoutOverviewPage.getItemTotal();
  const tax = await checkoutOverviewPage.getTax();
  const total = await checkoutOverviewPage.getTotal();

  if (itemTotal === null || tax === null || total === null) {
    throw new Error("Checkout price details are missing");
  }

  const itemAmo = itemTotal.replace("Item total: ", "");
  expect(itemAmo).toBe("$39.98");

  const taxAmo = tax.replace("Tax: ", "");
  expect(taxAmo).toBe("$3.20");

  const totalAmo = total.replace("Total: ", "");
  expect(totalAmo).toBe("$43.18");

  // Convert extracted amounts into numbers
  const itemAmount = Number(itemAmo.replace("$", ""));
  const taxAmount = Number(taxAmo.replace("$", ""));
  const finalAmount = Number(totalAmo.replace("$", ""));

  console.log("Item Amount:", itemAmount);
  console.log("Tax Amount:", taxAmount);
  console.log("Final Amount:", finalAmount);

  // Verify calculation
  expect(itemAmount + taxAmount).toBeCloseTo(finalAmount, 2);
});

test("CHK_010 - Verify successful order completion.", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const checkoutOverviewPage = new CheckoutOverviewPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBikeLightToCart();

  await inventoryPage.openCart();
  await cartPage.clickCheckout();

  await checkoutPage.enterFirstName("Priya");
  await checkoutPage.enterLastName("Kumar");
  await checkoutPage.enterPostalCode("600001");
  await checkoutPage.clickContinue();

  await expect(page).toHaveURL(/checkout-step-two\.html/);

  const itemTotal = await checkoutOverviewPage.getItemTotal();
  const tax = await checkoutOverviewPage.getTax();
  const total = await checkoutOverviewPage.getTotal();

  if (itemTotal === null || tax === null || total === null) {
    throw new Error("Checkout price details are missing");
  }

  const itemAmo = itemTotal.replace("Item total: ", "");
  expect(itemAmo).toBe("$39.98");

  const taxAmo = tax.replace("Tax: ", "");
  expect(taxAmo).toBe("$3.20");

  const totalAmo = total.replace("Total: ", "");
  expect(totalAmo).toBe("$43.18");

  // Convert extracted amounts into numbers
  const itemAmount = Number(itemAmo.replace("$", ""));
  const taxAmount = Number(taxAmo.replace("$", ""));
  const finalAmount = Number(totalAmo.replace("$", ""));

  console.log("Item Amount:", itemAmount);
  console.log("Tax Amount:", taxAmount);
  console.log("Final Amount:", finalAmount);

  // Verify calculation
  expect(itemAmount + taxAmount).toBeCloseTo(finalAmount, 2);
  await checkoutOverviewPage.clickFinish();
  await expect(page.locator(".complete-header")).toHaveText(
    "Thank you for your order!",
  );
  await expect(page).toHaveURL(/checkout-complete\.html/);
});
