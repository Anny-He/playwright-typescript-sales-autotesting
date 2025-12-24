import { Page } from '@playwright/test';
import { BasePage } from "./BasePage";

// define a products page class extending the base page
export class ProductsPage extends BasePage {

    // define locators
    title = '.title';
    inventoryItems = '.inventory_item';
    addButton = (id: string) => `[data-test="add-to-cart-${id}"]`;
    cartLink = '.shopping_cart_link';

    // constructor to initialize the page
    constructor(page: Page) {
        super(page);
    }

    // methods to interact with the products page
    async getTitle() {
        return this.page.locator(this.title).textContent();
    }

    // get count of inventory items
    async getInventoryItemsCount() {
        return this.page.locator(this.inventoryItems).count();
    }

    /*
        * Add item to cart by its id
        * @param id - The id of the item to add to cart
     */
    async addItemById(id: string) {
        const selector = this.addButton(id);
        await this.page.locator(selector).waitFor({ state: 'visible', timeout: 5000 });
        await this.page.locator(selector).click();
    }

    // open the cart page
    async openCart() {
        await this.safeClick(this.cartLink);
    }

    //logout method
    async logout() {
        await this.page.click('#react-burger-menu-btn');
        await this.page.click('#logout_sidebar_link');
    }
}