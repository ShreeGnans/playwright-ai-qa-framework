import { test, expect } from "../../fixtures/baseTest";
import { InventoryPage } from "../../pages/inventory.page";
import { CartPage } from "../../pages/cart.page";
import { ProductDetailsPage } from "../../pages/productDetails.page";
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

test("INV_007 - Verify Cart Page", async ({ page, loginPage }) => {
  await page.goto("https://www.saucedemo.com/");

  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const cartPage = new CartPage(page);

  // Add product to cart
  await inventoryPage.addBackpackToCart();

  await expect(inventoryPage.getCartBadge()).toHaveText("1");

  // Navigate to cart
  await inventoryPage.openCart();

  await expect(page).toHaveURL(/cart\.html/);

  // Verify cart page heading
  await expect(page.locator(".title")).toHaveText("Your Cart");

  // Verify product in cart
  await expect(page.locator(".cart_item")).toHaveCount(1);

  const productName = await cartPage.getProductName();

  expect(productName?.trim()).toBe("Sauce Labs Backpack");
});

// INV_008 - Verify Product Price in Cart
test("INV_008 - Verify Product Price in Cart", async ({ page, loginPage }) => {
  await page.goto("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);

  await expect(page.locator(".inventory_item_price")).toHaveCount(6);

  const inventoryPrices = await inventoryPage.getProductPrices();

  const backpackPrice = await inventoryPage.getProductPrice(
    "Sauce Labs Backpack",
  );

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

test("AINV_001 - Verify all inventory sorting options", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.sortProducts("az");
  const actualProductNamesaz = await inventoryPage.getProductNames();
  const expectedProductNamesaz = [
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
    "Sauce Labs Bolt T-Shirt",
    "Sauce Labs Fleece Jacket",
    "Sauce Labs Onesie",
    "Test.allTheThings() T-Shirt (Red)",
  ];
  expect(actualProductNamesaz).toEqual(expectedProductNamesaz);
  await inventoryPage.sortProducts("za");
  const actualProductNamesza = await inventoryPage.getProductNames();
  const expectedProductNamesza = [
    "Test.allTheThings() T-Shirt (Red)",
    "Sauce Labs Onesie",
    "Sauce Labs Fleece Jacket",
    "Sauce Labs Bolt T-Shirt",
    "Sauce Labs Bike Light",
    "Sauce Labs Backpack",
  ];
  expect(actualProductNamesza).toEqual(expectedProductNamesza);
  await inventoryPage.sortProducts("lohi");
  const actualProductNameslohi = await inventoryPage.getProductNames();
  const expectedProductNameslohi = [
    "Sauce Labs Onesie",
    "Sauce Labs Bike Light",
    "Sauce Labs Bolt T-Shirt",
    "Test.allTheThings() T-Shirt (Red)",
    "Sauce Labs Backpack",
    "Sauce Labs Fleece Jacket",
  ];
  expect(actualProductNameslohi).toEqual(expectedProductNameslohi);
  await inventoryPage.sortProducts("hilo");
  const actualProductNameshilo = await inventoryPage.getProductNames();
  const expectedProductNameshilo = [
    "Sauce Labs Fleece Jacket",
    "Sauce Labs Backpack",
    "Sauce Labs Bolt T-Shirt",
    "Test.allTheThings() T-Shirt (Red)",
    "Sauce Labs Bike Light",
    "Sauce Labs Onesie",
  ];
  expect(actualProductNameshilo).toEqual(expectedProductNameshilo);
});

test("AINV_002 - Verify product details navigation", async ({
  page,
  loginPage,
}) => {
  // Login
  await page.goto("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const productDetailsPage = new ProductDetailsPage(page);

  await inventoryPage.addBackpackClickButton();

  await expect(page).toHaveURL(/inventory-item\.html\?id=4/);

  const productName = await productDetailsPage.getProductName();
  expect(productName).toBe("Sauce Labs Backpack");

  const productDescription = await productDetailsPage.getProductDescription();
  expect(productDescription?.trim()).not.toBe("");

  const productPrice = await productDetailsPage.getProductPrice();
  expect(productPrice).toBe("$29.99");
});

test("AINV_003 - Verify Add to Cart functionality from Product Details Page", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const productDetailsPage = new ProductDetailsPage(page);
  await inventoryPage.addBackpackClickButton();
  await expect(page).toHaveURL(/inventory-item\.html\?id=4/);
  const buttonText = await productDetailsPage.getAddToCartButtonText();
  expect(buttonText?.trim()).toBe("Add to cart");

  await productDetailsPage.clickAddToCart();
  const buttonTextRemove = await productDetailsPage.getAddToCartButtonText();
  expect(buttonTextRemove?.trim()).toBe("Remove");
  await expect(inventoryPage.getCartBadge()).toHaveText("1");
  await productDetailsPage.clickRemoveButton();
  await expect(inventoryPage.getCartBadge()).toBeHidden();
});

test("AINV_004 - Verify product details after navigating back to inventory", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const productDetailsPage = new ProductDetailsPage(page);
  await inventoryPage.addBackpackClickButton();
  await expect(page).toHaveURL(/inventory-item\.html\?id=4/);
  const productName = await productDetailsPage.getProductName();
  expect(productName).toBe("Sauce Labs Backpack");
  await productDetailsPage.clickBackToProducts();
  await expect(page).toHaveURL(/inventory\.html/);
  const actualProductNames = await inventoryPage.getProductNames();
  expect(actualProductNames).toHaveLength(6);
  expect(actualProductNames).toContain("Sauce Labs Backpack");
});

test("AINV_005 - Verify product sorting is retained after navigating back from product details", async ({
  page,
  loginPage,
}) => {
  await page.goto("https://www.saucedemo.com/");
  await loginPage.login("standard_user", "secret_sauce");

  const inventoryPage = new InventoryPage(page);
  const productDetailsPage = new ProductDetailsPage(page);
  await inventoryPage.sortProducts("lohi");
  const actualPrices = await inventoryPage.getProductPrices();
  const expectedPrices = [
    "$7.99",
    "$9.99",
    "$15.99",
    "$15.99",
    "$29.99",
    "$49.99",
  ];
  expect(actualPrices).toEqual(expectedPrices);
  await inventoryPage.addBackpackClickButton();
  await expect(page).toHaveURL(/inventory-item\.html\?id=4/);
  await productDetailsPage.clickBackToProducts();
  await expect(page).toHaveURL(/inventory.html/);
  expect(await inventoryPage.getSelectedSortOption()).toBe("az");
  const actualProductNames = await inventoryPage.getProductNames();

  const expectedProductNames = [
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
    "Sauce Labs Bolt T-Shirt",
    "Sauce Labs Fleece Jacket",
    "Sauce Labs Onesie",
    "Test.allTheThings() T-Shirt (Red)",
  ];

  expect(actualProductNames).toEqual(expectedProductNames);
});
