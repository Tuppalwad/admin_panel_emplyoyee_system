import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  IMPORT_COLUMNS,
  CONDITIONS,
  LOCATION_TYPES,
  sheetHeader,
} from './assetImportFormat';

/* Builds the blank import template in the browser from IMPORT_COLUMNS, so the sheet a user
   downloads always has exactly the columns the importer accepts. Nothing is served from disk,
   so there is no static file to keep in sync.

   Note: SheetJS (community build) cannot write data validation, so the Condition / Location Type
   choices cannot be real dropdowns — they are listed on the "Valid Values" sheet instead, and
   enforced by the importer, which rejects anything else with a row number and reason. */

const exampleRow = (values) =>
  IMPORT_COLUMNS.map((col) => (values[col.header] === undefined ? '' : values[col.header]));

/* Two illustrative rows. The importer skips any row whose Brand or Model Name begins "EXAMPLE",
   so leaving them in is harmless — the instructions still ask for them to be deleted. */
const EXAMPLES = [
  exampleRow({
    Brand: 'Dell',
    'Model Name': 'EXAMPLE - Latitude 3450',
    'Serial Number': 'ABCD123',
    'Purchase Date': '2026-01-15',
    'Purchase Cost': 62000,
    Vendor: 'Rashi Peripherals',
    'Warranty Expiry Date': '2029-01-14',
    Condition: 'New',
    'Location Type': 'Warehouse',
    'Current Location': 'Pune Office - Store Room',
    RAM: '16GB',
    SSD: '512GB',
    Keyboard: 'OK',
    Mouse: 'OK',
    Battery: 'OK',
    Processor: 'i5',
    Generation: '12th Gen',
  }),
  exampleRow({
    Brand: 'Lenovo',
    'Model Name': 'EXAMPLE - ThinkPad T430',
    'Serial Number': 'XYZ789',
    'Purchase Date': '2025-11-02',
    Condition: 'Good',
    'Assigned To Emp ID': 'EMP2155',
    RAM: '8GB',
    HDD: '500GB',
    Keyboard: 'OK',
    Mouse: 'Not Working',
    Battery: '2 hours backup',
  }),
];

const buildAssetsSheet = () => {
  const header = IMPORT_COLUMNS.map(sheetHeader);
  const ws = XLSX.utils.aoa_to_sheet([header, ...EXAMPLES]);

  ws['!cols'] = IMPORT_COLUMNS.map((col) => ({ wch: col.width || 12 }));
  ws['!freeze'] = { xSplit: 0, ySplit: 1 };
  ws['!autofilter'] = {
    ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: 0, c: IMPORT_COLUMNS.length - 1 } }),
  };

  return ws;
};

const buildInstructionsSheet = () => {
  const rows = [
    ['LAPTOP ASSET IMPORT — how to use'],
    [],
    ['1.', 'One laptop per row on the "Assets" sheet.'],
    ['2.', 'Columns marked * are required. A row missing one is reported and skipped — the rest still import.'],
    ['3.', 'Delete the two EXAMPLE rows before importing (rows starting "EXAMPLE" are skipped anyway).'],
    ['4.', 'Do not rename or delete columns. Reordering is fine, and extra columns are ignored.'],
    ['5.', 'Every row is imported as category Laptop. This template is laptops only.'],
    ['6.', 'Upload on the Add Asset page > Import from Excel.'],
    [],
    ['THIS IMPORT ONLY CREATES NEW LAPTOPS'],
    ['', 'A row whose Serial Number already exists is skipped and listed as a duplicate.'],
    ['', 'Nothing is ever overwritten, so re-running the same file is safe.'],
    [],
    ['DATES'],
    ['', 'Format the cell as a Date, or type YYYY-MM-DD (e.g. 2026-01-15).'],
    ['', 'DD/MM/YYYY is REJECTED on purpose — 03/04/2026 is ambiguous and would import the wrong month.'],
    [],
    ['FIELD GUIDE'],
    ['Column', 'Required', 'Notes'],
    ...IMPORT_COLUMNS.map((col) => [col.header, col.required ? 'YES' : '', col.guide || '']),
  ];

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 22 }, { wch: 10 }, { wch: 95 }];
  return ws;
};

const buildValidValuesSheet = () => {
  const rows = [['Condition', 'Location Type']];
  const max = Math.max(CONDITIONS.length, LOCATION_TYPES.length);
  for (let i = 0; i < max; i++) {
    rows.push([CONDITIONS[i] || '', LOCATION_TYPES[i] || '']);
  }
  rows.push([], ['These come from the backend enums. Any other value is rejected on import.']);

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 18 }, { wch: 18 }];
  return ws;
};

export const downloadImportTemplate = () => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, buildAssetsSheet(), 'Assets');
  XLSX.utils.book_append_sheet(wb, buildInstructionsSheet(), 'Instructions');
  XLSX.utils.book_append_sheet(wb, buildValidValuesSheet(), 'Valid Values');

  const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
  });

  saveAs(blob, 'Laptop_Import_Template.xlsx');
};
