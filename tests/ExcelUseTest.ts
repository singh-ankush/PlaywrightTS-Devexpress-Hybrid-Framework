import { ExcelUtil } from '../capabilities/data_src/ExcelUtil';

let name: any;


const file = 'src/Utils/test-data.xlsx';
const opts = {
    sheetName: 'Sheet1',
    keyColumn: 'testcase-name',
    targetColumn: 'username',
    keyValue: 'my-testcase'
};


async function main() {

    try {
        const data = await ExcelUtil.readCell(file, opts);
        name = data;
    } catch (err) {
        console.error('Failed to read Excel:', err);
    }
}

main().then(() => {
    console.log(name);
});


//visual use test
import { expect, test } from '@playwright/test';
import { expectVisualMatch } from '../src/Utils/VisualValidation';

test('login visual', async ({ page }) => {
    await page.goto('https://your-app.local/login');
    const res = await expectVisualMatch(page, 'login-page', { baselineDir: 'visual-baseline', actualDir: 'visual-actual', diffDir: 'visual-diff', threshold: 0.08 });
    if (res.status !== 'matched') throw new Error(`Visual test failed: ${JSON.stringify(res)}`);
});


// api use test
import { createApiClient } from '../src/Utils/apiUtils';

test('example API test', async ({ request }) => {
    const api = createApiClient(request, { baseURL: 'https://api.example.com', headers: { Accept: 'application/json' }, retry: 1 });
    const res = await api.get('/users', { params: { page: 1 } });
    api.expectStatus(res, 200);
    const body = await api.json(res);
    expect(body).toBeDefined();

    //post
    const payload = { username: 'bob', password: 'secret' };
    const res1 = await api.post('/login', {
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        timeoutMs: 10_000
    });
    api.expectStatus(res1, 201);
    const data = await api.json(res1);

    //delete
    await api.put('/users/123', { body: { displayName: 'Bob' } });
    await api.patch('/users/123', { body: { active: false } });
    await api.del('/users/123');

    //per req retry and timeout
    await api.get('/unstable', { retry: 3, timeoutMs: 20_000 });
});