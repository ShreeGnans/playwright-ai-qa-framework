import { test, expect } from "../../fixtures/baseTest";
import { InventoryPage } from "../../pages/inventory.page";
import { CartPage } from "../../pages/cart.page";
import { CheckoutPage } from "../../pages/checkout.page";
import { CheckoutOverviewPage } from "../../pages/checkoutOverview.page";

test("ACART_001 - Verify cart items persist after navigating away from and returning to the cart", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  // Add two products
  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBikeLightToCart();

  await expect(inventoryPage.getCartBadge()).toHaveText("2");

  // Open cart and verify products
  await inventoryPage.openCart();
  await expect(page).toHaveURL(/cart.html/);
  await expect(page.locator(".cart_item")).toHaveCount(2);

  const initialProductNames = await cartPage.getProductNames();

  expect(initialProductNames).toEqual([
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
  ]);

  // Navigate away from cart
  await cartPage.clickContinueShopping();
  await expect(page).toHaveURL(/inventory.html/);

  // Return to cart and verify persistence
  await inventoryPage.openCart();
  await expect(page).toHaveURL(/cart.html/);
  await expect(page.locator(".cart_item")).toHaveCount(2);

  const returnedProductNames = await cartPage.getProductNames();

  expect(returnedProductNames).toEqual(initialProductNames);
});

test("ACART_002 - Verify removing one product updates the cart contents and badge", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  // Add two products
  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBikeLightToCart();

  await expect(inventoryPage.getCartBadge()).toHaveText("2");

  // Open cart and remove Backpack
  await inventoryPage.openCart();
  await cartPage.removeBackpackButton();

  // Verify only Bike Light remains
  await expect(page.locator(".cart_item")).toHaveCount(1);

  expect(await cartPage.getProductNames()).toEqual(["Sauce Labs Bike Light"]);

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

test("ACART_004 -Verify that cart contents and badge count remain accurate when adding and removing products while navigating between Inventory and Cart.", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.openCart();
  await expect(inventoryPage.getCartBadge()).toHaveText("1");
  await cartPage.clickContinueShopping();
  await inventoryPage.addBikeLightToCart();
  await inventoryPage.openCart();
  await expect(inventoryPage.getCartBadge()).toHaveText("2");
  await cartPage.removeBackpackButton();
  await cartPage.clickContinueShopping();
  const backpackButton = await inventoryPage.getProductButtonText(
    "Sauce Labs Backpack",
  );
  expect(backpackButton).toBe("Add to cart");
  const bikeLightButton = await inventoryPage.getProductButtonText(
    "Sauce Labs Bike Light",
  );
  expect(bikeLightButton).toBe("Remove");
  await inventoryPage.openCart();
  await expect(inventoryPage.getCartBadge()).toHaveText("1");
});

test("ACART_005 -Verify cart product prices match inventory product prices.", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBikeLightToCart();
  const backpackInventoryPrice = await inventoryPage.getProductPrice(
    "Sauce Labs Backpack",
  );
  const bikelightInventoryPrice = await inventoryPage.getProductPrice(
    "Sauce Labs Bike Light",
  );
  await inventoryPage.openCart();
  const backpackCartPrice = await cartPage.getProductPrices(
    "Sauce Labs Backpack",
  );

  const bikeLightCartPrice = await cartPage.getProductPrices(
    "Sauce Labs Bike Light",
  );
  expect(backpackCartPrice).toBe(backpackInventoryPrice);
  expect(bikeLightCartPrice).toBe(bikelightInventoryPrice);
  const cartProducts = await cartPage.getProductNames();

  expect(cartProducts).toEqual([
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
  ]);
});

test("ACART_006 -Verify product quantities in the cart.", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBikeLightToCart();
  await inventoryPage.openCart();
  const backPackQuantity = await cartPage.getProductQuantity(
    "Sauce Labs Backpack",
  );
  const bikeLightQuantity = await cartPage.getProductQuantity(
    "Sauce Labs Bike Light",
  );
  expect(backPackQuantity).toBe("1");
  expect(bikeLightQuantity).toBe("1");
});

test("ACART_007 -Verify cart contents persist after page refresh", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBikeLightToCart();
  await inventoryPage.openCart();
  const updatedProductName = await cartPage.getProductNames();

  expect(updatedProductName).toEqual([
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
  ]);
  await page.reload();
  const updatedProductNameRefresh = await cartPage.getProductNames();

  expect(updatedProductNameRefresh).toEqual([
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
  ]);
  const backPackQuantity = await cartPage.getProductQuantity(
    "Sauce Labs Backpack",
  );
  const bikeLightQuantity = await cartPage.getProductQuantity(
    "Sauce Labs Bike Light",
  );
  expect(backPackQuantity).toBe("1");
  expect(bikeLightQuantity).toBe("1");
  await expect(inventoryPage.getCartBadge()).toHaveText("2");
});

test("ACART_008 - Verify cart contents after logout and login", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  // Add two products to the cart
  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBikeLightToCart();

  await expect(inventoryPage.getCartBadge()).toHaveText("2");

  // Open cart and verify initial products
  await inventoryPage.openCart();

  await expect(page).toHaveURL(/cart.html/);
  await expect(page.locator(".cart_item")).toHaveCount(2);

  const initialProductNames = await cartPage.getProductNames();

  expect(initialProductNames).toEqual([
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
  ]);

  // Logout
  await loginPage.logout();

  await expect(page).toHaveURL("https://www.saucedemo.com/");

  // Login again
  await loginPage.login("standard_user", "secret_sauce");

  await expect(page).toHaveURL(/inventory.html/);

  // Navigate to cart again
  await inventoryPage.openCart();

  await expect(page).toHaveURL(/cart.html/);

  // Verify cart items are retained
  await expect(page.locator(".cart_item")).toHaveCount(2);

  const updatedProductNames = await cartPage.getProductNames();

  expect(updatedProductNames).toEqual([
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
  ]);

  // Verify product quantities
  const backpackQuantity = await cartPage.getProductQuantity(
    "Sauce Labs Backpack",
  );

  const bikeLightQuantity = await cartPage.getProductQuantity(
    "Sauce Labs Bike Light",
  );

  expect(backpackQuantity).toBe("1");
  expect(bikeLightQuantity).toBe("1");

  // Verify cart badge
  await expect(inventoryPage.getCartBadge()).toHaveText("2");
});

test("ACART_009 -Verify cart state after removing a product and refreshing the page", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBikeLightToCart();
  await inventoryPage.openCart();
  await inventoryPage.removeBackpackFromCart();

  const updatedProductName = await cartPage.getProductNames();

  expect(updatedProductName).toEqual(["Sauce Labs Bike Light"]);
  await page.reload();
  const updatedProductNameRefresh = await cartPage.getProductNames();

  expect(updatedProductNameRefresh).toEqual(["Sauce Labs Bike Light"]);
  const bikeLightQuantity = await cartPage.getProductQuantity(
    "Sauce Labs Bike Light",
  );
  expect(bikeLightQuantity).toBe("1");
  await expect(inventoryPage.getCartBadge()).toHaveText("1");
});

test("ACART_010 - Verify existing cart items are retained when adding products after navigating between pages", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  // Add Backpack
  await inventoryPage.addBackpackToCart();
  await expect(inventoryPage.getCartBadge()).toHaveText("1");

  // Open cart and verify Backpack
  await inventoryPage.openCart();
  await expect(page.locator(".cart_item")).toHaveCount(1);

  expect(await cartPage.getProductNames()).toEqual(["Sauce Labs Backpack"]);

  // Return to inventory
  await cartPage.clickContinueShopping();
  await expect(page).toHaveURL(/inventory.html/);

  // Add Bike Light without removing Backpack
  await inventoryPage.addBikeLightToCart();
  await expect(inventoryPage.getCartBadge()).toHaveText("2");

  // Reopen cart and verify both products
  await inventoryPage.openCart();
  await expect(page).toHaveURL(/cart.html/);
  await expect(page.locator(".cart_item")).toHaveCount(2);

  const updatedProductNames = await cartPage.getProductNames();

  expect(updatedProductNames).toEqual([
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
  ]);

  // Verify individual quantities
  expect(await cartPage.getProductQuantity("Sauce Labs Backpack")).toBe("1");

  expect(await cartPage.getProductQuantity("Sauce Labs Bike Light")).toBe("1");

  await expect(inventoryPage.getCartBadge()).toHaveText("2");
});

test("ACART_011 - Verify cart badge updates correctly after sequentially removing products", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  // Add three products
  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBikeLightToCart();
  await inventoryPage.addBoltTshirtToCart();

  await expect(inventoryPage.getCartBadge()).toHaveText("3");

  await inventoryPage.openCart();

  // Remove Bike Light
  await cartPage.removeBikeLightButton();
  await expect(inventoryPage.getCartBadge()).toHaveText("2");
  await expect(page.locator(".cart_item")).toHaveCount(2);

  // Remove Backpack
  await cartPage.removeBackpackButton();
  await expect(inventoryPage.getCartBadge()).toHaveText("1");
  await expect(page.locator(".cart_item")).toHaveCount(1);

  // Remove Bolt T-Shirt
  await cartPage.removeBoltTshirtButton();

  // Verify empty cart
  await expect(inventoryPage.isCartBadgeHidden()).resolves.toBe(true);
  await expect(page.locator(".cart_item")).toHaveCount(0);
});

test("ACART_012 -Verify cart product order", async ({ page, loginPage }) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  await inventoryPage.addBikeLightToCart();
  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBoltTshirtToCart();
  await inventoryPage.openCart();
  const updatedProductName = await cartPage.getProductNames();

  expect(updatedProductName).toEqual([
    "Sauce Labs Bike Light",
    "Sauce Labs Backpack",
    "Sauce Labs Bolt T-Shirt",
  ]);
});

test("ACART_013 -Verify cart contents when adding duplicate products", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  await inventoryPage.addBackpackToCart();
  await inventoryPage.openCart();
  const productName = await cartPage.getProductName();
  expect(productName).toEqual("Sauce Labs Backpack");
  await cartPage.clickContinueShopping();
  const backpackButtonText = await inventoryPage.getProductButtonText(
    "Sauce Labs Backpack",
  );
  expect(backpackButtonText).toBe("Remove");
  await expect(inventoryPage.getCartBadge()).toHaveText("1");
});

test("ACART_014 -Verify cart contents after browser back and forward navigation.", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBikeLightToCart();
  await inventoryPage.openCart();
  const beforeProductName = await cartPage.getProductNames();

  expect(beforeProductName).toEqual([
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
  ]);
  await page.goBack();
  await page.goForward();
  const afterProductName = await cartPage.getProductNames();

  expect(afterProductName).toEqual([
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
  ]);
  const backPackQuantity = await cartPage.getProductQuantity(
    "Sauce Labs Backpack",
  );
  const bikeLightQuantity = await cartPage.getProductQuantity(
    "Sauce Labs Bike Light",
  );
  expect(backPackQuantity).toBe("1");
  expect(bikeLightQuantity).toBe("1");
  await expect(inventoryPage.getCartBadge()).toHaveText("2");
});

test("ACART_015 -Verify cart contents after sorting products on the inventory page", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);
  await inventoryPage.addBackpackToCart();
  await inventoryPage.addBikeLightToCart();
  const backpackInventoryPrice = await inventoryPage.getProductPrice(
    "Sauce Labs Backpack",
  );
  const bikelightInventoryPrice = await inventoryPage.getProductPrice(
    "Sauce Labs Bike Light",
  );
  await inventoryPage.openCart();
  const backpackCartPrice = await cartPage.getProductPrices(
    "Sauce Labs Backpack",
  );

  const bikeLightCartPrice = await cartPage.getProductPrices(
    "Sauce Labs Bike Light",
  );
  const productName = await cartPage.getProductNames();

  expect(productName).toEqual(["Sauce Labs Backpack", "Sauce Labs Bike Light"]);
  expect(backpackInventoryPrice).toBe(backpackCartPrice);
  expect(bikelightInventoryPrice).toBe(bikeLightCartPrice);
  const backPackQuantity = await cartPage.getProductQuantity(
    "Sauce Labs Backpack",
  );
  const bikeLightQuantity = await cartPage.getProductQuantity(
    "Sauce Labs Bike Light",
  );
  expect(backPackQuantity).toBe("1");
  expect(bikeLightQuantity).toBe("1");
  await expect(inventoryPage.getCartBadge()).toHaveText("2");
});
