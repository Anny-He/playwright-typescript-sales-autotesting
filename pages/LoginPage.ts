import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";

// define a login page class extending the base page
export class LoginPage extends BasePage {

    // define locators
    username = '#user-name';
    password = '#password';
    loginButton = '#login-button';
    errorMessage = '[data-test="error"]';
    loginContainer = '.login_container';

    // constructor to initialize the page
    constructor(page: Page) {
        super(page);
    }

    // navigate to the login page
    async navigate() {
        await this.page.goto('https://www.saucedemo.com/');
        await this.waitForVisible(this.username);
    }

    // methods to interact with the login page
    async enterUsername(username: string) {
        await this.page.fill(this.username, username);
    }

    async enterPassword(password: string) {
        await this.page.fill(this.password, password);
    }

    async clickLogin() {
        await this.safeClick(this.loginButton);
    }

    /*
        * Perform login action
        * @param username - The username to enter
        * @param password - The password to enter
     */
    async login(username: string, password: string) {
        await this.enterUsername(username);
        await this.enterPassword(password);

        //Use Promise.all to listen for response and click login simultaneously
        await Promise.all([
            this.page.waitForResponse(() => true).catch(() => { }),
            this.clickLogin()
        ]);

        // Wait for either navigation to products page or error message to appear
        await Promise.race([
            this.page.waitForURL(/.*inventory.html/, { timeout: 5000 }).catch(() => { }),
            this.page.locator(this.errorMessage).waitFor({ state: 'visible', timeout: 5000 }).catch(() => { })
        ]);
    }

    // get error message text
    async getErrorMessageText() {
        return this.page.locator(this.errorMessage).textContent();
    }

    // check if on login page
    async isOnLoginPage() {
        return this.page.locator(this.loginContainer).isVisible();
    }
}
