import { Page } from "@playwright/test";

// define a base page class to be extended by other page classes
export class BasePage {
    constructor(protected page: Page) { }

    /*
    * Safe click method to ensure the element is visible before clicking
    * @param locator - The selector of the element to click
    */
    async safeClick(locator: string) {
        await this.page.locator(locator).waitFor({ state: 'visible', timeout: 5000 });
        await this.page.locator(locator).click();
    }

    /*
    * Wait for an element to be visible
    * @param locator - The selector of the element to wait for
    * @param timeout - Optional timeout in milliseconds (default is 5000ms)
    */
    async waitForVisible(locator: string, timeout: number = 5000) {
        await this.page.locator(locator).waitFor({ state: 'visible', timeout });
    }
}