import {test, expect} from '@playwright/test';
import {LoginPage} from '../pages/LoginPage';
import {ProductsPage} from '../pages/ProductsPage';
import {users} from '../test-data/Users';

test.describe('Inventory Full Test Suite - Enterprise Level', () => {
    
    let productsPage: ProductsPage;
    let cartCount: number;
    
    test.beforeEach(async ({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(users.standardUser.username, users.standardUser.password);
        productsPage = new ProductsPage(page);
        await productsPage.isOnProductsPage();
    } );

    test('Verify all inventory items are displayed', async ({page}) => {
        const itemCount = await productsPage.getInventoryItemsCount();
        expect(itemCount).toBe(6); // there are 6 items in the inventory
        const itemNames = await productsPage.getInventoryItemsNames();
        const itemPrices = await productsPage.getInventoryItemsPrices();
        expect(itemNames.length).toBe(itemCount);
        expect(itemPrices.length).toBe(itemCount);  
    });

    test('Add single item to cart and verify cart badge', async ({page}) => {
        // Add a specific item to the cart by its id
        const itemIdToAdd = 'sauce-labs-backpack'; // example item id
        await productsPage.addItemById(itemIdToAdd);
        cartCount = await productsPage.getCartItemCount();
        expect(cartCount).toBe(1);
        // Verify that the cart badge shows 1 item

        //remove item from cart and verify cart badge is gone
        await productsPage.removeItemById(itemIdToAdd);
        cartCount = await productsPage.getCartItemCount();
        expect(cartCount).toBe(0);
    });

    test('Add multiple items to cart and verify cart badge', async ({page}) => {
      
        const itemIdsToAdd = ['sauce-labs-backpack', 'sauce-labs-bike-light', 'sauce-labs-bolt-t-shirt'];
        
        for (const itemId of itemIdsToAdd) {
            await productsPage.addItemById(itemId);
        }
        
        // Verify that the cart badge shows correct number of items
        cartCount = await productsPage.getCartItemCount();
        expect(cartCount).toBe(itemIdsToAdd.length);  

        // Remove one item from cart and verify cart badge updates
        await productsPage.removeItemById('sauce-labs-bike-light');
        cartCount = await productsPage.getCartItemCount();
        expect(cartCount).toBe(itemIdsToAdd.length - 1);

        //Verify remaining items still show Remove button 
        const remainingItemIds = ['sauce-labs-backpack', 'sauce-labs-bolt-t-shirt'];
        for (const itemID of remainingItemIds){
            const removeBtn = await productsPage.removeButton(itemID);
            await expect(removeBtn).toBeVisible();
        }       
    });

    test('Refresh page retains cart items and preseres Add/Remove button states', async ({page}) => {
        const itemIdsToAdd = ['sauce-labs-backpack', 'sauce-labs-bike-light'];
        
        for (const itemId of itemIdsToAdd) {
            await productsPage.addItemById(itemId);
        }
        
        // Refresh the page
        await page.reload();
        productsPage.isOnProductsPage();

        // Verify that the cart badge still shows correct number of items
        cartCount = await productsPage.getCartItemCount();
        expect(cartCount).toBe(itemIdsToAdd.length);    

        // Verify that the correct buttons are shown for each item
        for (const itemId of itemIdsToAdd) {
            const removeBtn = await productsPage.removeButton(itemId);
            await expect(removeBtn).toBeVisible();
        } 
    });

//afterEach to logout after each test
    test.afterEach(async ({page}) => {
        await productsPage.logout();
        const loginPage = new LoginPage(page);
        await loginPage.isOnLoginPage();
    });

    
});
  
