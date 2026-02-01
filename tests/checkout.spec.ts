import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { users } from '../test-data/Users';

test.describe('Checkout Process Tests--Enterprise Level Tests', () => {

    // login before each test to reach products page
    test.beforeEach(async ({page}) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(users.standardUser.username, users.standardUser.password);
    });

    test('Checkout form validation ', async ({page}) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        // Add item to cart and proceed to checkout
        await productsPage.addItemById('sauce-labs-backpack');
        await productsPage.openCart();
        await cartPage.proceedToCheckout();
        
        // Attempt to continue without filling the form
        await checkoutPage.continueToCheckoutOverview();
        await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');
        
        // Fill in only first name
        await checkoutPage.enterCheckoutInformation('Anny', '', '');
        await expect(page.locator('[data-test="error"]')).toHaveText('Error: Last Name is required');
        
        // Fill in first and last name only
        await checkoutPage.enterCheckoutInformation('Anny', 'He', '');
        await expect(page.locator('[data-test="error"]')).toHaveText('Error: Postal Code is required');
    });
    
    test('Complete checkout process successfully', async ({page}) => {
        const productsPage = new ProductsPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        // Add item to cart and proceed to checkout
        await productsPage.addItemById('sauce-labs-backpack');
        await productsPage.openCart();
        await cartPage.proceedToCheckout();

        // Fill in checkout form
        await checkoutPage.enterCheckoutInformation('Anny', 'He', '8024');

        // Verify order confirmation
        const itemTotal = await checkoutPage.getCartItemsPriceTotal();
        const tax = await checkoutPage.getTaxAmount();
        const total = await checkoutPage.getTotalAmount();
        
        expect(total).toBeCloseTo(itemTotal + tax, 2);

        await checkoutPage.finishCheckout();
        await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    });
});