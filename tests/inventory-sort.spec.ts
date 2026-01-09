import {test, expect} from '@playwright/test';
import {LoginPage} from '../pages/LoginPage';
import {ProductsPage} from '../pages/ProductsPage';
import {users} from '../test-data/Users';

test.describe('Inventory Sorting - Enterprise Level', () => {
    
    // login before each test to reach products page
    test.beforeEach(async ({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(users.standardUser.username, users.standardUser.password);
        const productsPage = new ProductsPage(page);
        await productsPage.isOnProductsPage();
    });
    
    test('Verify sorting by Name (A to Z)', async ({page}) => {
        const productsPage = new ProductsPage(page);
        await productsPage.sortItemsBy('az');
        const itemNames = await productsPage.getInventoryItemsNames();
        const sortedNames = [...itemNames].sort((a, b) => a.localeCompare(b));
        expect(itemNames).toEqual(sortedNames);
    });

    test('Verify sorting by Name (Z to A)', async ({page}) => {
        const productsPage = new ProductsPage(page);
        await productsPage.sortItemsBy('za');
        const itemNames = await productsPage.getInventoryItemsNames();
        const sortedNames = [...itemNames].sort((a, b) => b.localeCompare(a));
        expect(itemNames).toEqual(sortedNames);
    });

    test('Verify sorting by Price (Low to High)', async ({page}) => {
        const productsPage = new ProductsPage(page);
        await productsPage.sortItemsBy('lohi');
        const itemPrices = await productsPage.getInventoryItemsPrices();
        const sortedPrices = [...itemPrices].sort((a, b) => a - b);
        expect(itemPrices).toEqual(sortedPrices);
    });

    test('Verify sorting by Price (High to Low)', async ({page}) => {
        const productsPage = new ProductsPage(page);
        await productsPage.sortItemsBy('hilo');
        const itemPrices = await productsPage.getInventoryItemsPrices();
        const sortedPrices = [...itemPrices].sort((a, b) => b - a);
        expect(itemPrices).toEqual(sortedPrices);
    });

    test('Sorting should not affect Add to Cart functionality', async ({page}) => {
        const productsPage = new ProductsPage(page);

        // Sort by sorting by Price (High to Low) and add first item to cart
        await productsPage.sortItemsBy('hilo');
        await productsPage.addItemById('sauce-labs-backpack');
        let cartCount = await productsPage.getCartItemCount();
        expect(cartCount).toBe(1);

        await productsPage.sortItemsBy('lohi');
        await productsPage.addItemById('sauce-labs-bike-light');
        cartCount = await productsPage.getCartItemCount();
        expect(cartCount).toBe(2);

        // Remove an item after sorting
        await productsPage.sortItemsBy('az');
        await productsPage.removeItemById('sauce-labs-backpack');
        cartCount = await productsPage.getCartItemCount();
        expect(cartCount).toBe(1);
    });

    //  test.afterEach(async ({page}) => {
    //     const productsPage = new ProductsPage(page);
    //     await productsPage.logout();
    //     const loginPage = new LoginPage(page);
    //     await expect(loginPage.isOnLoginPage());
    // });

});
   