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