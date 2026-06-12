import { BasePage } from "../pages/BasePage";
import { Page, test, Browser } from '@playwright/test';

export class BaseTest {
    readonly page : any;
    constructor(page: Page) {
        this.page = page;
    }

    async testUrl(testurl: any) {
        await this.page.goto(testurl);
    }
}

test.beforeAll(async () => {
    // Global setup
});

test.afterAll(async () => {
    // Global teardown
});