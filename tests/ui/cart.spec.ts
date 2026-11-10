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

test("ACART_008 -Verify cart contents after logout and login", async ({
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
  await loginPage.logout();
  await expect(page).toHaveURL("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");
  await inventoryPage.openCart();
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

test("ACART_010 -Verify cart contents after navigating between pages", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  await inventoryPage.addBackpackToCart();
  await inventoryPage.openCart();
  const updatedProductNameRefresh = await cartPage.getProductNames();

  expect(updatedProductNameRefresh).toEqual(["Sauce Labs Backpack"]);
  await cartPage.clickContinueShopping();
  await inventoryPage.addBikeLightToCart();
  await inventoryPage.openCart();
  const updatedProductName = await cartPage.getProductNames();

  expect(updatedProductName).toEqual([
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
