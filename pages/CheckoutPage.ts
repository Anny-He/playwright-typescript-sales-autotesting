import { Page,Locator,expect } from "@playwright/test";
import { BasePage } from "./BasePage";

// define a checkout page class extending the base page
export class CheckoutPage extends BasePage {

    // define Locators
    private readonly firstName: Locator;
    private readonly lastName: Locator;
    private readonly postalCode: Locator;
    private readonly continueButton: Locator;
    private readonly finishButton: Locator;
    private readonly cartBadge: Locator;
    private readonly errorMessage: string ;
    private readonly confirmationMessage: string ;

    constructor(page: Page) {
        super(page);
        // initialize locators
        this.firstName = page.locator('[data-test="firstName"]');
        this.lastName = page.locator('[data-test="lastName"]');
        this.postalCode = page.locator('[data-test="postalCode"]');
        this.continueButton = page.locator('[data-test="continue"]');
        this.finishButton = page.locator('[data-test="finish"]');
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.errorMessage = '[data-test="error"]';
        this.confirmationMessage = '[data-test="complete-header"]';
    }

    /*  *Enter checkout user information
    @param firstName - The first name of the user
    @param lastName - The last name of the user
    @param postalCode - The postal code of the user
    */
    async enterCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.postalCode.fill(postalCode);
        await this.continueButton.click();
    }


    /* * Continue to checkout overview page */
    async continueToCheckoutOverview(): Promise<void> {
        await this.continueButton.click();
    }

    // Get cart items count from cart badge
    async getCartItemsCount(): Promise<number> {
        const badgeText = await this.cartBadge.textContent();
        return badgeText ? Number(badgeText) : 0;
    }

    // Get cart items price total 
    async getCartItemsPriceTotal(): Promise<number> {
        const itemTotalLocator = this.page.locator('.summary_subtotal_label');
        const itemTotalText = await itemTotalLocator.textContent();
        return itemTotalText ? Number(itemTotalText.replace('Item total: $', '')) : 0;
    }

    // Get tax amount
    async getTaxAmount(): Promise<number> {
        const taxLocator = this.page.locator('.summary_tax_label');
        const taxText = await taxLocator.textContent();
        return taxText ? Number(taxText.replace('Tax: $', '')) : 0;
    }
    
    // Get total amount
    async getTotalAmount(): Promise<number> {
        const totalLocator = this.page.locator('.summary_total_label');
        const totalText = await totalLocator.textContent();
        return totalText ? Number(totalText.replace('Total: $', '')) : 0;
    }

    // Finish checkout process
    async finishCheckout(): Promise<void> {
        await this.finishButton.click();
    }

    // Verify checkout complete
    async verifyCheckoutComplete(): Promise<void> {
        await expect(this.page.locator('[data-test="complete-header"]')).toHaveText('THANK YOU FOR YOUR ORDER!');
    }
}