import { Page,Locator,expect } from "@playwright/test";
import { BasePage } from "./BasePage";

// define a cart page class extending the base page
export class CartPage extends BasePage {

    // define Locators
    private readonly cartItems: Locator;
    private readonly checkoutButton: Locator;
    private readonly continueShoppingButton: Locator;
    private readonly cartBadge: Locator;

    constructor(page: Page) {
        super(page);
        // initialize locators
        this.cartItems = page.locator('.cart_item');
        this.checkoutButton = page.locator('#checkout');
        this.continueShoppingButton = page.locator('#continue-shopping');
        this.cartBadge = page.locator('.shopping_cart_badge');
    }

    /* * Check if on cart page */
    async isOnCartPage(): Promise<void>{
        await expect(this.page).toHaveURL(/cart.html/);
    }

    /* *Get cart items count */
    async getCartItemsCount(): Promise<number> {
        return await this.cartItems.count();
    }

    /* *Get cart item names */
    async getCartItemNames(): Promise<string[]>{
        return this.cartItems.locator('.inventory_item_name').allTextContents();
    }

    // Get cart items prices
    async getCartItemPrices(): Promise<number[]>{
        const priceStrings = await this.cartItems.locator('.inventory_item_price').allTextContents();
        return priceStrings.map(price => Number(price.replace('$', '')));
    }

    /* * Remove item from cart by its id */
    async removeItemById(itemId: string): Promise<void> {
        const removeButton = this.page.locator(`#remove-${itemId}`);
        await expect(removeButton).toBeVisible();
        await removeButton.click();
    }

    //Contineue shopping
    async continueShopping (): Promise<void> {
        await this.continueShoppingButton.click();
    }

    //Proceed to checkout
    async proceedToCheckout(): Promise<void> {
        await this.checkoutButton.click();
    }

    /* * Get cart item count from cart badge */
    async getCartItemCount(): Promise<number> {
        if (await this.cartBadge.isVisible()) {
            const badgeText = await this.cartBadge.textContent();
            return badgeText ? parseInt(badgeText) : 0;
        }
        return 0;
    }
}   