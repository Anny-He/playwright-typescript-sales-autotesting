import {test, expect} from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { CartPage } from '../pages/CartPage';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { users } from '../test-data/Users';

test.describe('Cart Page Tests - Enterprise Level', () => {

    // login and add items to cart before each test to reach cart page
    test.beforeEach(async ({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(users.standardUser.username, users.standardUser.password);
    });


    test('Add items to cart and verify cart count', async ({page}) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);

        // Add first two products to cart
        await productsPage.addItemById('sauce-labs-backpack');
        await productsPage.addItemById('sauce-labs-bike-light');
        
        // Verify cart count
        await productsPage.openCart();
        await cartPage.isOnCartPage();
        const cartItems = await cartPage.getCartItemCount();
        expect (cartItems).toBe(2);
    });

    test('Verify item name and price consistency', async ({page}) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);
        const itemId = 'sauce-labs-backpack';
        
        // Add item to cart and get its details including name and price
        await productsPage.addItemById(itemId);
        const inventoryName = await productsPage.getInventoryItemsNames().then(names => names.find(name => name?.includes('Backpack')));
        const inventoryPrice = await productsPage.getInventoryItemsPrices().then(prices => prices[0]);
        // const inventoryItem = await productsPage.getInventoryItemsInfoById(itemId);
        // const productName = await productsPage.getInventoryItemsNames().then(names => names.find(name => name?.includes('Backpack')));
        // const productPrice = await productsPage.getInventoryItemsPrices().then(prices => prices[0]); // assuming first price corresponds to backpack
        
        // Open cart and verify item details including name and price
        await productsPage.openCart();
        await cartPage.isOnCartPage();
        const cartItemName = await cartPage.getCartItemNames();
        const cartItemPrice = await cartPage.getCartItemPrices();

        // Verify name and price consistency
        expect(cartItemName[0]).toBe(inventoryName);
        expect(cartItemPrice[0]).toBe(inventoryPrice);
    });


test('Remove item from cart and verify cart count', async ({page}) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);
        const itemId = 'sauce-labs-backpack';

        // Add item to cart
        await productsPage.addItemById(itemId);
        
        // Open cart and remove the item
        await productsPage.openCart();
        await cartPage.isOnCartPage();
        await cartPage.removeItemById(itemId);
        
        // Verify cart is empty
        const cartItemsCount = await cartPage.getCartItemsCount();
        expect(cartItemsCount).toBe(0);
    });

    test('Continue shopping from cart page and keep cart items', async ({page}) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);
        const itemId = 'sauce-labs-backpack';

        // Add item to cart
        await productsPage.addItemById(itemId);
        
        // Open cart and continue shopping
        await productsPage.openCart();
        await cartPage.isOnCartPage();
        await cartPage.continueShopping();
        
        // Verify returned to products page
        await productsPage.isOnProductsPage();
        // Verify cart still has the item
        const cartItemCount = await productsPage.getCartItemCount();
        expect(cartItemCount).toBe(1);
    });
});