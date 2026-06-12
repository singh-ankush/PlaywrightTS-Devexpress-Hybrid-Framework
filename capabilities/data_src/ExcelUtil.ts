import ExcelJS from 'exceljs';
import { join } from 'path';

type WorksheetLookup = {
  sheetName?: string;
  keyColumn: string;      // header name used to find the row key (e.g. "testcase-name")
  targetColumn: string;   // header name of the column you want to read/write (e.g. "username")
  keyValue: string;       // the row identifier value to match (e.g. "TC-001" or "my-testcase")
};

export class ExcelUtil {
  private static async loadWorkbook(filePath: string) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(join(process.cwd(), filePath));
    return workbook;
  }

  private static findColumnIndex(worksheet: ExcelJS.Worksheet, headerName: string): number {
    const headerRow = worksheet.getRow(1);
    for (let col = 1; col <= headerRow.cellCount; col++) {
      const val = headerRow.getCell(col).value;
      if (val !== null && String(val).trim() === headerName) return col;
    }
    throw new Error(`Header "${headerName}" not found in sheet "${worksheet.name}"`);
  }

  private static findRowByKey(worksheet: ExcelJS.Worksheet, keyColIndex: number, keyValue: string): number {
    for (let r = 2; r <= worksheet.rowCount; r++) {
      const cell = worksheet.getRow(r).getCell(keyColIndex).value;
      if (cell !== null && String(cell).trim() === keyValue) return r;
    }
    throw new Error(`Row with key "${keyValue}" not found in sheet "${worksheet.name}"`);
  }

  public static async readCell(filePath: string, opts: WorksheetLookup): Promise<any> {
    const workbook = await this.loadWorkbook(filePath);
    const worksheet = opts.sheetName ? workbook.getWorksheet(opts.sheetName) ?? workbook.worksheets[0] : workbook.worksheets[0];
    if (!worksheet) throw new Error('No worksheet found in workbook');

    const keyCol = this.findColumnIndex(worksheet, opts.keyColumn);
    const targetCol = this.findColumnIndex(worksheet, opts.targetColumn);
    const rowIndex = this.findRowByKey(worksheet, keyCol, opts.keyValue);

    return worksheet.getRow(rowIndex).getCell(targetCol).value;
  }

  public static async writeCell(filePath: string, opts: WorksheetLookup, value: any): Promise<void> {
    const workbook = await this.loadWorkbook(filePath);
    const worksheet = opts.sheetName ? workbook.getWorksheet(opts.sheetName) ?? workbook.worksheets[0] : workbook.worksheets[0];
    if (!worksheet) throw new Error('No worksheet found in workbook');

    const keyCol = this.findColumnIndex(worksheet, opts.keyColumn);
    const targetCol = this.findColumnIndex(worksheet, opts.targetColumn);
    const rowIndex = this.findRowByKey(worksheet, keyCol, opts.keyValue);

    worksheet.getRow(rowIndex).getCell(targetCol).value = value;
    await workbook.xlsx.writeFile(join(process.cwd(), filePath));
  }

}
