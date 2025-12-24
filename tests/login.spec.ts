import {test, expect} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../test-data/Users';

test.describe('Login Tests', () => {

    //test case 1 for valid login
    test('Valid Login Test', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(users.standardUser.username, users.standardUser.password);
        await expect(page).toHaveURL(/.*inventory.html/)
    });

    //test case 2 for locked out user
    test('Locked Out User Test', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(users.lockedOutUser.username, users.lockedOutUser.password);
        await expect(page.locator(loginPage.errorMessage)).toContainText('Epic sadface: Sorry, this user has been locked out.');
        // const errorText = await page.locator(loginPage.errorMessage).textContent();
        // expect(errorText).toContain('Epic sadface: Sorry, this user has been locked out.');
    });

    //test case 3 for invalid login
    test('Invalid Login Test', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(users.invalidUser.username, users.invalidUser.password);
        await expect(page.locator(loginPage.errorMessage)).toContainText('Epic sadface: Username and password do not match any user in this service');
        
        // const errorText = await page.locator(loginPage.errorMessage).textContent();
        // expect(errorText).toContain('Epic sadface: Username and password do not match any user in this service');
    });

    //test case 4 for empty password
    test('Empty Password Test', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.enterUsername(users.standardUser.username);
        await loginPage.enterPassword('');
        await loginPage.clickLogin();
        await expect(page.locator(loginPage.errorMessage)).toContainText('Epic sadface: Password is required');
        // const errorText = await page.locator(loginPage.errorMessage).textContent();
        // expect(errorText).toContain('Epic sadface: Password is required');
    });

    //test case 5 for empty username
    test('Empty Username Test', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.enterUsername('');
        await loginPage.enterPassword(users.standardUser.password);
        await loginPage.clickLogin();
        await expect(page.locator(loginPage.errorMessage)).toContainText('Epic sadface: Username is required');
        // const errorText = await page.locator(loginPage.errorMessage).textContent();
        // expect(errorText).toContain('Epic sadface: Username is required');
    });

    //test case 6 for empty username and password
    test('Empty Username and Password Test', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.enterUsername('');
        await loginPage.enterPassword('');
        await loginPage.clickLogin();
        await expect(page.locator(loginPage.errorMessage)).toContainText('Epic sadface: Username is required');
        // const errorText = await page.locator(loginPage.errorMessage).textContent();
        // expect(errorText).toContain('Epic sadface: Username is required');
    });

    //test case 7 for login and logout
    test('Login and Logout Test', async ({ page }) => {

        //perform login
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login(users.standardUser.username, users.standardUser.password);
        await expect(page).toHaveURL(/.*inventory.html/);
        
        // Perform logout
        await page.click('#react-burger-menu-btn');
        await page.click('#logout_sidebar_link');
        await expect(page).toHaveURL('https://www.saucedemo.com/');
    }   );

});
