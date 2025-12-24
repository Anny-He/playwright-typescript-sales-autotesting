import { Page, Route } from '@playwright/test';

/*
    * Mock the payment API response
    * @param page - The Playwright page object
    * @param options - Options to configure the mock response
    *                  success: boolean - whether to mock a successful payment or a failure
 */
export async function mockPayment(
    page: Page,
    options: { success: boolean }
) {
    await page.route('**/api/payment', async (route: Route) => {
        if (options.success) {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ status: 'success' })
            });
        } else {
            await route.fulfill({
                status: 400,
                contentType: 'application/json',
                body: JSON.stringify({ status: 'failure' })
            });
        }
    });
}   