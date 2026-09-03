/*
 * Mirror of the backend's canonical import format.
 *
 * Source of truth: Backend_HRMS_Asset_Test/mysql/utils/assetImportFormat.js
 * The two repos deploy separately so the list cannot literally be shared — if a column changes
 * there, change it here too. Everything the user sees (the downloadable template and the Export
 * sheet) is generated from this list, so the file a user fills in always matches what the
 * importer accepts.
 *
 * Laptops only for now: there is no Category column, every imported row becomes a Laptop.
 */

export const CONDITIONS = ['New', 'Good', 'Fair', 'Damaged', 'Beyond Repair'];
export const LOCATION_TYPES = ['Office', 'WFH', 'Warehouse'];

/* header   – exact column title written into the sheet
   key      – asset field it maps to (component columns use `component: true` instead)
   required – marked with * in the sheet; the importer rejects rows missing it
   guide    – shown on the Instructions sheet */
export const IMPORT_COLUMNS = [
  { header: 'Brand', key: 'brand', required: true, width: 14, guide: 'Manufacturer ONLY — Dell, Lenovo, Apple, HP. Not the model name.' },
  { header: 'Model Name', key: 'modelName', required: true, width: 22, guide: 'Full model — e.g. Latitude 3450, ThinkPad T430.' },
  { header: 'Serial Number', key: 'serialNumber', required: true, width: 20, guide: 'Manufacturer serial. Must be unique — a row whose serial already exists is skipped.' },
  { header: 'Purchase Date', key: 'purchaseDate', required: true, width: 14, guide: 'Format the cell as a Date, or type YYYY-MM-DD. Anything else is rejected.' },
  { header: 'Purchase Cost', key: 'purchaseCost', width: 13, guide: 'Plain number — no currency symbol or commas. e.g. 62000' },
  { header: 'Vendor', key: 'vendor', width: 18, guide: 'Who it was bought from.' },
  { header: 'Warranty Expiry Date', key: 'warrantyExpiryDate', width: 19, guide: 'Must be AFTER Purchase Date. Feeds the warranty dashboard.' },
  { header: 'Condition', key: 'condition', width: 13, guide: 'One of the Valid Values. Defaults to New if blank.' },
  { header: 'Location Type', key: 'locationType', width: 14, guide: 'One of the Valid Values. Defaults to Warehouse. Ignored if Assigned To is set.' },
  { header: 'Current Location', key: 'currentLocation', width: 22, guide: 'Free text — e.g. Pune Office, Store Room B.' },
  { header: 'Assigned To Emp ID', key: 'assignedToEmpId', width: 18, guide: 'OPTIONAL. e.g. EMP2155. If the ID is unknown the laptop still imports, unassigned.' },
  { header: 'Specifications', key: 'specifications', width: 26, guide: 'Anything the component columns do not cover.' },
  { header: 'Notes', key: 'notes', width: 26, guide: 'Free text.' },

  { header: 'RAM', component: true, width: 10, guide: 'e.g. 16GB' },
  { header: 'HDD', component: true, width: 10, guide: 'e.g. 500GB' },
  { header: 'SSD', component: true, width: 10, guide: 'e.g. 512GB' },
  { header: 'Keyboard', component: true, width: 12, guide: 'e.g. OK / Not Working / Missing' },
  { header: 'Mouse', component: true, width: 12, guide: 'e.g. OK / Not Working / Missing' },
  { header: 'Battery', component: true, width: 12, guide: 'e.g. OK / 2 hours backup' },
  { header: 'Processor', component: true, width: 14, guide: 'e.g. i5' },
  { header: 'Generation', component: true, width: 12, guide: 'e.g. 8th Gen' },
];

/* Extra columns the Export adds for readability. The importer knows these names and skips them,
   which is what lets an exported sheet be edited and imported straight back. */
export const EXPORT_ONLY_COLUMNS = [
  { header: 'Asset ID', width: 16 },
  { header: 'Category', width: 12 },
  { header: 'Status', width: 15 },
  { header: 'Assigned To Name', width: 20 },
  { header: 'Assigned Since', width: 15 },
];

export const sheetHeader = (col) => (col.required ? `${col.header} *` : col.header);

/* Dates go out as YYYY-MM-DD, never a locale format. `toLocaleDateString('en-GB')` produces
   15/01/2026, which JavaScript reads back as an invalid date — so a locale-formatted export
   could not be re-imported at all. */
export const isoDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/* Empty means empty. The old export wrote '-' for missing values, which on re-import stored the
   literal string "-" as the vendor/notes — and, because serial numbers are unique, made the
   second such row collide. */
export const blankIfMissing = (value) => (value === null || value === undefined ? '' : value);
