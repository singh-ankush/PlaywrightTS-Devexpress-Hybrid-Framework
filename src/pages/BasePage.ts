import test, { expect } from "playwright/test";


export class BasePage {
    readonly browser: any;
    constructor(browser: any) {
        this.browser = browser;
    }

    async waitForVisible(text: string) {
        try {
            await test.step(`Waiting for element with text "${text}" to be visible`, async () => {
                await this.browser.getByText(text).waitFor({ state: 'visible' });
            });
        }
        catch (error) {
            throw new Error(`Element with text "${text}" was not visible after waiting. Original error: ${error}`);
        }
    }

    async waitforNetworkIdle() {
        await this.browser.waitForLoadState('networkidle');
    }

    // what it does is it waits for element to be attached to the dom, then scrolls it into view if needed, then waits for it to be visible and then clicks on it.
    async waitAndClickByType(path: string, type: 'text' | 'role' | 'testId') {
        let locator: any;

        switch (type) {
            case 'text':
                locator = this.browser.getByText(path);
                break;

            case 'role':
                locator = this.browser.getByRole(path as any);
                break;

            case 'testId':
                locator = this.browser.getByTestId(path);
                break;

            default:
                throw new Error(`Unsupported locator type: ${type}`);
        }

        try {
            await test.step(`Waiting for element with ${type} "${path}" to be visible and clicking on it`, async () => {
                await locator.waitFor({ state: 'attached' });
                await locator.scrollIntoViewIfNeeded();
                await locator.waitFor({ state: 'visible' });
                await locator.click();
            });
            return locator;
        }
        catch (error) {
            throw new Error(`Failed to click element with ${type} "${path}". Original error: ${error}`);
        }
    }


    // waits for element to be visible by Role attribute and then clicks on it.
    async waitandClickByRole(role: string, name: string) {
        const locator = this.browser.getByRole(role, { name });

        try {
            await test.step(`Waiting for element with role "${role}" and name "${name}"`, async () => {
                await locator.waitFor({ state: 'visible' });
                await locator.click();
            });
            return locator;
        } catch (error) {
            throw new Error(`Failed to click element with role "${role}" and name "${name}". Original error: ${error}`);
        }
    }

    // this is a helper function to find an element that is virtualized, meaning it is not in the DOM until it is scrolled into view. It will try to find the element by role and name, if it is not found it will scroll down and try again until it finds the element or reaches the end of the page. - Blazor has a lot of virtualized lists, so this is a common scenario.
    async findVirtualizedItembyRole(role: string, name: string) {

        let locator: any;
        try {

            await test.step(`Finding virtualized element with role "${role}" and name "${name}"`, async () => {

                locator = this.browser.getByRole(role, { name });
                if (!await locator.waitFor({ state: 'visible' })) {
                    for (let i = 0; i < 20; i++) {
                        if (await locator.count() > 0) {
                            await locator.scrollIntoViewIfNeeded();
                            await locator;
                            return locator;
                        }
                    }
                }

                throw new Error(`Could not find element with name: ${name}`);
            });

        } catch (error) {
            throw new Error(`Error while trying to find virtualized element with role "${role}" and name "${name}". Original error: ${error}`);
        }

    }

    // same as previous but clicks on the element once it is found.
    async clickVirtualizedItembyRole(role: string, name: string) {


        try {
            await test.step(`Finding virtualized element with role "${role}" and name "${name}"`, async () => {
                let locator: any;
                locator = await this.findVirtualizedItembyRole(role, name);
                await locator.click();
            });
        } catch (error) {
            throw new Error(`Error while trying to click virtualized element with role "${role}" and name "${name}". Original error: ${error}`);
        }

    }

    // same as previous but finds element by text instead of role and name.
    async findVirtualizedItembyText(text: string) {
        let locator: any;

        try {
            await test.step(`Finding virtualized element with text "${text}" `, async () => {

                locator = this.browser.getByText(text);
                if (!await locator.waitFor({ state: 'visible' })) {
                    for (let i = 0; i < 20; i++) {
                        if (await locator.count() > 0) {
                            await locator.scrollIntoViewIfNeeded();
                            await locator;
                            return locator;
                        }
                    }
                }

                throw new Error(`Could not find element with text: ${text}`);
            });
        } catch (error) {
            throw new Error(`Error while trying to click virtualized element with text "${text}" `);
        }

    }


    /**
     * Assertions
     * */

    // asserts that the locator has the expected text.
    async assertLocatorText(locator: any, expectedText: string) {
        await expect(locator).toHaveText(expectedText);
    }

    async assertLocatorContainsText(locator: any, expectedText: string) {
        await expect(locator).toContainText(expectedText);
    }

    async assertLocatorIsVisible(locator: any) {
        await expect(locator).toBeVisible();
    }

    async assertLocatorIsHidden(locator: any) {
        await expect(locator).toBeHidden();
    }

    async assertLocatorIsDisabled(locator: any) {
        await expect(locator).toBeDisabled();
    }

    async assertLocatorIsEnabled(locator: any) {
        await expect(locator).toBeEnabled();
    }

    async assertLocatorIsChecked(locator: any) {
        await expect(locator).toBeChecked();
    }

    async assertLocatorIsNotChecked(locator: any) {
        await expect(locator).not.toBeChecked();
    }

    async assertLocatorHasAttribute(locator: any, attribute: string, value: string) {
        await expect(locator).toHaveAttribute(attribute, value);
    }


}