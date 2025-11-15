const { test, expect } = require('@playwright/test');

test.describe('SauceDemo Shopping Flow', () => {
  
  test('User can login, add product to cart, verify it, and logout', async ({ page }) => {
    // Step 1: Navigate to SauceDemo
    await page.goto('/');
    
    // Step 2: Login with valid credentials
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    
    // Verify successful login by checking URL and page title
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');
    
    // Step 3: Add first product to cart
    // Get the product name before adding to cart
    const productName = await page.locator('.inventory_item').first().locator('.inventory_item_name').textContent();
    console.log(`Adding product to cart: ${productName}`);
    
    // Click "Add to cart" button for the first product
    await page.locator('.inventory_item').first().locator('button[id^="add-to-cart"]').click();
    
    // Verify cart badge shows 1 item
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    
    // Step 4: Navigate to cart
    await page.click('.shopping_cart_link');
    
    // Verify we're on the cart page
    await expect(page).toHaveURL(/.*cart.html/);
    await expect(page.locator('.title')).toHaveText('Your Cart');
    
    // Step 5: Verify the product name in the cart matches what was added
    const cartProductName = await page.locator('.inventory_item_name').textContent();
    expect(cartProductName).toBe(productName);
    console.log(`Verified product in cart: ${cartProductName}`);
    
    // Additional verification: Check quantity is 1
    const quantity = await page.locator('.cart_quantity').textContent();
    expect(quantity).toBe('1');
    
    // Step 6: Logout
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    
    // Verify successful logout by checking we're back at login page
    await expect(page).toHaveURL('/');
    await expect(page.locator('#login-button')).toBeVisible();
    
    console.log('Test completed successfully!');
  });
  
});
