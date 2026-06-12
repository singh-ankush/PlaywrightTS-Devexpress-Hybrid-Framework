import { AddWorksheetOptions } from 'exceljs';
import data from './config.json';

export class ExcelReusables {

    setDataLogin(testcase: string, dataField: string) {
        const file = data.excelFilePath;
        const opts = {
            sheetName: data.loginPageSheet,
            keyColumn: 'testcase-name',
            targetColumn: dataField,
            keyValue: testcase
        };
        return opts; 
    }

}