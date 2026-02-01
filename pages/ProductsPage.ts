import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from "./BasePage";

// define a products page class extending the base page
export class ProductsPage extends BasePage {

    // define Locators
    private readonly title: Locator;
    private readonly inventoryItems: Locator;
    private readonly cartLink: Locator;
    private readonly cartBadge: Locator;
    private readonly logoutButton: Locator;
    private readonly menuButton: Locator;
    private readonly sortDropdown: Locator;

    constructor(page: Page) {
        super(page);
        // initialize locators
        this.title = page.locator('.title');
        this.inventoryItems = page.locator('.inventory_item');
        this.cartLink = page.locator('.shopping_cart_link');
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.logoutButton = page.locator('#logout_sidebar_link');
        this.menuButton = page.locator('#react-burger-menu-btn');
        this.sortDropdown = page.locator('.product_sort_container');
    }

    // method to check if on products page
    async isOnProductsPage(): Promise<boolean> {
        await expect(this.page).toHaveURL(/inventory.html/);
        await expect(this.title).toHaveText('Products');
        // return await this.title.isVisible();
        return true;
    }

    // get the title text
    async getTitleText(): Promise<string | null> {
        return await this.title.textContent();
    }

    /*   * Get count of inventory items   */
    async getInventoryItemsCount(): Promise<number> {
        return await this.inventoryItems.count();
    }

    /* * Get invertory items names */
    async getInventoryItemsNames(): Promise<string[]> {
        const itemCount = await this.getInventoryItemsCount();
        const names: string[] = [];
        for (let i = 0; i < itemCount; i++) {
            const itemName = await this.inventoryItems.nth(i).locator('.inventory_item_name').textContent();
            if (itemName) {
                names.push(itemName);
            }
        }
        return names;

        // return this.inventoryItems.locator('.inventory_item_name').allTextContents();
    }

    /* Get inventory items prices */
    async getInventoryItemsPrices(): Promise<number[]> {
        const itemCount = await this.getInventoryItemsCount();
        const prices: number[] = [];
        for (let i = 0; i < itemCount; i++) {
            const priceText = await this.inventoryItems.nth(i).locator('.inventory_item_price').textContent();
            if (priceText) {
                const price = parseFloat(priceText.replace('$', ''));
                prices.push(price);
            }
        }
        return prices;

        // const priceTexts = await this.inventoryItems.locator('.inventory_item_price').allTextContents();
        // return priceTexts.map(text => parseFloat(text.replace('$', '')));
    }

    /* * Get inventory item infomation by id 
          @param id - The id of the item to get the name for
    */
    async getInventoryItemsInfoById(id: string): Promise<string | null> {
        const selector = `[data-test="item-name-${id}"]`;
        const itemNameLocator = this.page.locator(selector);
        await expect(itemNameLocator).toBeVisible();
        return await itemNameLocator.textContent();
    }

    /*  Get item price by id 
         @param id - The id of the item to get the price for   
    */
    async getItemPriceById(id: string): Promise<number | null> {
        const selector = `[data-test="item-price-${id}"]`;
        const itemPriceLocator = this.page.locator(selector);
        await expect(itemPriceLocator).toBeVisible();
        const priceText = await itemPriceLocator.textContent();
        if (priceText) {
            return parseFloat(priceText.replace('$', ''));
        }
        return null;
    }

    /* Get item name by id 
         @param id - The id of the item to get the name for
    */
    async getItemNameById(id: string): Promise<string | null> {
        const selector = `[data-test="inventory-item-name"]`;
        const itemNameLocator = this.page.locator(selector).filter({ hasText: id });
        await expect(itemNameLocator).toBeVisible();
        return await itemNameLocator.textContent();
    }


    /*  AddButton
        @param id - The id of the item to define the add button for 
    */
    async addButton(id: string): Promise<Locator> {
        const selector = `[data-test="add-to-cart-${id}"]`;
        return this.page.locator(selector);
    }

    /* removeButton
        @param id - The id of the item to define the remove button for 
    */
    async removeButton(id: string): Promise<Locator> {
        const selector = `[data-test="remove-${id}"]`;
        return this.page.locator(selector);
    }


    /*  * Add item to cart by its id
        * @param id - The id of the item to add to cart
     */
    async addItemById(id: string): Promise<void> {
        const addBtn = await this.addButton(id);
        await expect(addBtn).toBeVisible();
        await addBtn.click();
        await expect(await this.removeButton(id)).toBeVisible();
    }

    /* *remove item from cart by its id
        * @param id - The id of the item to remove from cart
    */
    async removeItemById(id: string): Promise<void> {
        const removeBtn = await this.removeButton(id);
        await expect(removeBtn).toBeVisible();
        await removeBtn.click();
        await expect(await this.addButton(id)).toBeVisible();
    }

    /* *Get cart item count */
    async getCartItemCount(): Promise<number> {
        if (await this.cartBadge.isVisible()) {
            const countText = await this.cartBadge.textContent();
            return countText ? parseInt(countText) : 0;
        }
        return 0;
    }

    /*  * Open the cart page  */
    async openCart(): Promise<void> {
        await this.cartLink.click();
    }

    // Sort items by option
    async sortItemsBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
        await this.sortDropdown.selectOption(option);
    }

    /*  * Logout method  */
    async logout(): Promise<void> {
        await this.menuButton.click();
        await expect(this.logoutButton).toBeVisible();
        await this.logoutButton.click();
    }




    // // define locators
    // title = '.title';
    // inventoryItems = '.inventory_item';
    // addButton = (id: string) => `[data-test="add-to-cart-${id}"]`;
    // cartLink = '.shopping_cart_link';
    // logoutButton = '#logout_sidebar_link';
    // menuButton = '#react-burger-menu-btn';

    // // constructor to initialize the page
    // constructor(page: Page) {
    //     super(page);
    // }

    // // methods to interact with the products page
    // async getTitle() {
    //     return this.page.locator(this.title).textContent();
    // }

    // // get count of inventory items
    // async getInventoryItemsCount() {
    //     return this.page.locator(this.inventoryItems).count();
    // }

    // /*
    //     * Add item to cart by its id
    //     * @param id - The id of the item to add to cart
    //  */
    // async addItemById(id: string) {
    //     const selector = this.addButton(id);
    //     await this.page.locator(selector).waitFor({ state: 'visible', timeout: 5000 });
    //     await this.page.locator(selector).click();
    // }

    // // open the cart page
    // async openCart() {
    //     await this.safeClick(this.cartLink);
    // }

    // //logout method
    // async logout() {
    //     await this.page.click('#react-burger-menu-btn');
    //     await this.page.click('#logout_sidebar_link');
    // }
}