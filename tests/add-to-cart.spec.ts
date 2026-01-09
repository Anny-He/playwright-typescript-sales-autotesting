import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { users } from '../test-data/Users';

test('Login and add item to Cart Tests', async({page}) => {

    //define page objects
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    // Step 1: Navigate to login page and perform login
    await loginPage.navigate();
    await loginPage.login(users.standardUser.username, users.standardUser.password);
    await expect(page).toHaveURL(/.*inventory.html/);

    // Step 2: Verify products page title and inventory items count
    const title = await productsPage.getTitleText();
    expect(title).toBe('Products');
    
    const itemCount = await productsPage.getInventoryItemsCount();
    expect(itemCount).toBe(6); // assuming there are 6 items in the inventory

    // Step 3: Add a specific item to the cart by its id
    const itemIdToAdd = 'sauce-labs-backpack'; // example item id
    await productsPage.addItemById(itemIdToAdd);
    
    // Step 4: Verify that the cart badge shows 1 item
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});