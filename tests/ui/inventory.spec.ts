import { test, expect } from "../../fixtures/baseTest";
import { InventoryPage } from "../../pages/inventory.page";
import { CartPage } from "../../pages/cart.page";

// INV_001 - Verify Products heading
test("INV_001 - Verify Products heading after login", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");
  const inventoryPage = new InventoryPage(page);
  const title = await inventoryPage.getProductsTitle();
  expect(title).toBe("Products");
});

// INV_002 - Verify product count
test("INV_002 - Verify product count", async ({ page, loginPage }) => {
  await page.goto("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");
  const inventoryPage = new InventoryPage(page);
  // Wait until all six products are displayed
  await expect(page.locator(".inventory_item")).toHaveCount(6);
  const productCount = await inventoryPage.getProductCount();

  console.log("Actual Product Count:", productCount);

  expect(productCount).toBe(6);
});

// INV_003 - Verify product names
test("INV_003 - Verify inventory product names", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);

  const expectedProducts: string[] = [
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
    "Sauce Labs Bolt T-Shirt",
    "Sauce Labs Fleece Jacket",
    "Sauce Labs Onesie",
    "Test.allTheThings() T-Shirt (Red)",
  ];

  await expect(page.locator(".inventory_item")).toHaveCount(6);

  const actualProducts = await inventoryPage.getProductNames();

  expect(actualProducts).toEqual(expectedProducts);
});

// INV_004 - Verify product prices
test("INV_004 - Verify product prices", async ({ page, loginPage }) => {
  await page.goto("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);

  await expect(page.locator(".inventory_item_price")).toHaveCount(6);

  const productPrices = await inventoryPage.getProductPrices();

  console.log("Actual Product Prices:", productPrices);

  expect(productPrices).toHaveLength(6);

  for (const price of productPrices) {
    const numericPrice = Number(price.replace("$", ""));

    console.log("Original Price:", price);
    console.log("Converted Price:", numericPrice);

    expect(Number.isFinite(numericPrice)).toBe(true);
    expect(numericPrice).toBeGreaterThan(0);
  }
});

// INV_005 - Verify Add to Cart
test("INV_005 - Verify Add to Cart functionality", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);

  await inventoryPage.addBackpackToCart();

  await expect(inventoryPage.getCartBadge()).toHaveText("1");
});

// INV_006 - Verify Remove from Cart
test("INV_006 - Verify Remove from Cart functionality", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);

  await inventoryPage.addBackpackToCart();

  await expect(inventoryPage.getCartBadge()).toHaveText("1");

  await inventoryPage.removeBackpackFromCart();

  await expect(inventoryPage.getCartBadge()).toBeHidden();
});

// INV_007 - Verify Cart Page
test("INV_007 - Verify Cart Page", async ({ page, loginPage }) => {
  await page.goto("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);

  await inventoryPage.addBackpackToCart();

  await inventoryPage.openCart();

  await expect(page).toHaveURL(/cart\.html/);

  const cartPage = new CartPage(page);

  const title = await cartPage.getCartTitle();
  expect(title).toBe("Your Cart");

  const productName = await cartPage.getProductName();
  expect(productName).toBe("Sauce Labs Backpack");
});

// INV_008 - Verify Product Price in Cart
test("INV_008 - Verify Product Price in Cart", async ({ page, loginPage }) => {
  await page.goto("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);

  await expect(page.locator(".inventory_item_price")).toHaveCount(6);

  const inventoryPrices = await inventoryPage.getProductPrices();

  const backpackPrice = inventoryPrices[0];

  await inventoryPage.addBackpackToCart();
  await inventoryPage.openCart();

  const cartPage = new CartPage(page);

  const cartPrice = await cartPage.getProductPrice();

  expect(cartPrice).toBe(backpackPrice);
});

// INV_009 - Verify Multiple Products in Cart
test("INV_009 - Verify Multiple Products in Cart", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);

  await inventoryPage.addBackpackToCart();

  await inventoryPage.addBikeLightToCart();

  await expect(inventoryPage.getCartBadge()).toHaveText("2");
});

test("INV_010 - Verify Dynamic Add to Cart", async ({ page, loginPage }) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);

  const products: string[] = [
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
    "Sauce Labs Bolt T-Shirt",
  ];
  for (const product of products) {
    await inventoryPage.addProductToCart(product);
  }
  await expect(inventoryPage.getCartBadge()).toHaveText("3");
});
