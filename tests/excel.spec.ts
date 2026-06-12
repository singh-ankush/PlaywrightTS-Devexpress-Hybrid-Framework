import { test, expect } from '@playwright/test';
import { ExcelReusables } from '../src/Utils/ExcelReusables';
import { ExcelUtil } from '../capabilities/data_src/ExcelUtil';
import data from '../src/Utils/config.json';
import { BaseTest } from '../src/tests/BaseTest';
import { BasePage } from '../src/pages/BasePage';


test('check excel data', async ({ browser, page }) => {

    //for excel
    const excel = new ExcelReusables();

    const name = await ExcelUtil.readCell(data.excelFilePath, excel.setDataLogin('my-testcase', 'username'));

    console.log(name);

    //for browser

    const basetest = new BaseTest(page);
    const basepage = new BasePage(page);

    await basetest.testUrl(data.testURL);
    await basepage.waitforNetworkIdle();


    let locator;

    await basepage.waitandClickByRole('button','Accept');
});