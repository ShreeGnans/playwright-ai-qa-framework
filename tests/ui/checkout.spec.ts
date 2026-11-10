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

test("CHK_011 - Verify user can cancel checkout from overview page", async ({
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
  await checkoutOverviewPage.clickCancel();
  await expect(page).toHaveURL(/inventory.html/);
});

test("CHK_012 - Verify checkout form validation for special characters", async ({
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
  await checkoutPage.enterFirstName("	@#$%");
  await checkoutPage.enterLastName("Kumar");
  await checkoutPage.enterPostalCode("600001");
  await checkoutPage.clickContinue();
  await expect(page).toHaveURL(/checkout-step-two\.html/);
});

test("CHK_013 - Verify checkout accepts leading and trailing spaces", async ({
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
  await checkoutPage.enterFirstName(" priya ");
  await checkoutPage.enterLastName(" Kumar ");
  await checkoutPage.enterPostalCode("600001");
  await checkoutPage.clickContinue();
  await expect(page).toHaveURL(/checkout-step-two\.html/);
});

test("CHK_014 - Verify checkout with numeric values in First Name and Last Name", async ({
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
  await checkoutPage.enterFirstName("12345");
  await checkoutPage.enterLastName("6789");
  await checkoutPage.enterPostalCode("600001");
  await checkoutPage.clickContinue();
  await expect(page).toHaveURL(/checkout-step-two\.html/);
});

test("CHK_015 - Verify checkout with maximum-length input", async ({
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
  await checkoutPage.enterFirstName("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  await checkoutPage.enterLastName("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  await checkoutPage.enterPostalCode("600001");
  await checkoutPage.clickContinue();
  await expect(page).toHaveURL(/checkout-step-two\.html/);
});

test("CHK_016 - Verify checkout with an empty cart", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const checkoutOverviewPage = new CheckoutOverviewPage(page);
  await expect(page).toHaveURL(/inventory.html/);
  await inventoryPage.openCart();
  const title = await cartPage.getCartTitle();
  expect(title).toBe("Your Cart");
  await expect(page.locator(".cart_item")).toHaveCount(0);
  await cartPage.clickCheckout();
  await expect(page).toHaveURL(/checkout-step-one\.html/);
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
  expect(itemAmo).toBe("$0");

  const taxAmo = tax.replace("Tax: ", "");
  expect(taxAmo).toBe("$0.00");

  const totalAmo = total.replace("Total: ", "");
  expect(totalAmo).toBe("$0.00");

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

test("CHK_017 - Verify successful checkout with multiple products", async ({
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

test("CHK_018 - Verify cart items are retained when cancelling checkout", async ({
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
  await checkoutPage.clickCancelCheckOutOverview();
  await expect(page).toHaveURL(/cart.html/);
  await expect(inventoryPage.getCartBadge()).toHaveText("2");
  const productNames = await cartPage.getProductNames();
  expect(productNames).toEqual(
    expect.arrayContaining(["Sauce Labs Backpack", "Sauce Labs Bike Light"]),
  );
});

test("CHK_019 - Verify cart contents after navigating back from checkout overview", async ({
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
  await checkoutOverviewPage.clickCancel();
  await expect(page).toHaveURL(/.inventory.html/);
  await inventoryPage.openCart();
  const productNames = await cartPage.getProductNames();
  expect(productNames).toEqual(
    expect.arrayContaining(["Sauce Labs Backpack", "Sauce Labs Bike Light"]),
  );
});

test("CHK_020 -Verify cart updates when one product is removed", async ({
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
  await expect(inventoryPage.getCartBadge()).toHaveText("2");
  await inventoryPage.openCart();
  await cartPage.removeBackpackButton();
  const productName = await cartPage.getProductName();
  expect(productName).toBe("Sauce Labs Bike Light");
});
