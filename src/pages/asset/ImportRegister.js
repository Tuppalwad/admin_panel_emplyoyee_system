import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Loading } from '../../components/common';
import { importLegacyRegister } from '../../redux/actions/assetAction';
import { getLoggedInEmail } from './assetHelpers';
import { downloadImportTemplate } from './assetTemplate';

const StatTile = ({ label, value, color }) => (
  <div className={`rounded-xl border p-3 ${color}`}>
    <p className="text-xs uppercase tracking-wide mb-1 opacity-80">{label}</p>
    <h3 className="text-2xl font-bold">{value ?? 0}</h3>
  </div>
);

/* Collapsible result table. Every rejected row carries its Excel row number so the user can go
   straight to the cell, fix it, and re-run the same file — re-running is safe because the import
   only ever creates, never overwrites. */
const ResultTable = ({ title, description, rows, columns, tone, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  if (!rows.length) return null;

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-4 mb-4 ${tone}`}>
      <button onClick={() => setOpen((v) => !v)} className="flex items-center justify-between w-full text-left">
        <div>
          <h2 className="text-base font-bold text-gray-800">
            {title} ({rows.length})
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        </div>
        <i className={`fas fa-chevron-${open ? 'up' : 'down'} text-slate-500`}></i>
      </button>

      {open && (
        <div className="overflow-x-auto mt-3">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                {columns.map((c) => (
                  <th key={c.label} className="py-2 pr-4">{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border-b last:border-0">
                  {columns.map((c) => (
                    <td key={c.label} className="py-2 pr-4 text-slate-700">{c.get(row) ?? '-'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const ImportRegister = () => {
  const dispatch = useDispatch();

  const [excelFile, setExcelFile] = useState(null);
  const [importedBy, setImportedBy] = useState(getLoggedInEmail());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const notify = (message) => toast(message);

  const handleFileChange = (event) => {
    setErrors((prev) => ({ ...prev, excelFile: '' }));
    setExcelFile(event.target.files?.[0] || null);
    setResult(null);
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!excelFile) newErrors.excelFile = 'Select the filled-in .xlsx template';
    if (!importedBy) newErrors.importedBy = 'Imported By is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await dispatch(importLegacyRegister({ excelFile, importedBy }));

      if (res?.code === 200 || res?.code === 201) {
        setResult(res.data);
        const { createdCount = 0, skippedCount = 0 } = res.data || {};
        notify(
          skippedCount
            ? `${createdCount} imported, ${skippedCount} skipped — see the breakdown below`
            : `${createdCount} laptop(s) imported`
        );
      } else {
        setResult(null);
        notify(res?.message || 'Import failed');
      }
    } catch (error) {
      console.log(error);
      notify('Import failed');
    } finally {
      setLoading(false);
    }
  };

  const created = result?.created || [];
  const skipped = result?.skipped || [];
  const failed = result?.failed || [];
  const unassigned = result?.unassigned || [];
  const unknownHeaders = result?.unknownHeaders || [];

  return (
    <div>
      {loading && <Loading />}

      {/* Step 1 — get the template */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-blue-900">1. Start from the template</h3>
            <p className="text-sm text-blue-800 mt-0.5">
              Everyone imports the same format, so there is nothing to reformat by hand. The sheet
              includes instructions and the list of accepted values.
            </p>
          </div>

          <button
            onClick={downloadImportTemplate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition whitespace-nowrap shrink-0"
          >
            <i className="fas fa-download mr-2"></i>
            Download Template
          </button>
        </div>
      </div>

      {/* Step 2 — upload it back */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">
        <h3 className="text-sm font-bold text-slate-800 mb-1">2. Upload the filled-in file</h3>
        <p className="text-xs text-slate-500 mb-4">
          Laptops only. Each row creates a new laptop — a serial number that already exists is
          skipped, never overwritten, so re-running a corrected file is safe.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="excelFile">
              Filled Template <span className="text-red-500">*</span>
            </label>

            <input
              type="file"
              name="excelFile"
              accept=".xlsx"
              onChange={handleFileChange}
              className={`shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.excelFile ? 'border-red-500' : ''}`}
            />

            {excelFile && (
              <p className="text-xs text-slate-500 mt-2">
                {excelFile.name} ({Math.round(excelFile.size / 1024)} KB)
              </p>
            )}

            {errors.excelFile && (
              <p className="text-red-500 text-xs italic my-2">{errors.excelFile}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="importedBy">
              Imported By <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="importedBy"
              value={importedBy}
              onChange={(event) => {
                setErrors((prev) => ({ ...prev, importedBy: '' }));
                setImportedBy(event.target.value);
              }}
              placeholder="admin@example.com"
              className={`shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.importedBy ? 'border-red-500' : ''}`}
            />

            {errors.importedBy && (
              <p className="text-red-500 text-xs italic my-2">{errors.importedBy}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
        >
          <i className="fas fa-file-import mr-2"></i>
          {loading ? 'Importing...' : 'Run Import'}
        </button>
      </div>

      {result && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <StatTile label="Rows read" value={result.totalRows} color="bg-slate-50 border-slate-200 text-slate-700" />
            <StatTile label="Imported" value={result.createdCount} color="bg-green-50 border-green-100 text-green-700" />
            <StatTile label="Skipped" value={result.skippedCount} color="bg-amber-50 border-amber-200 text-amber-800" />
            <StatTile label="Failed" value={result.failedCount} color="bg-red-50 border-red-200 text-red-700" />
          </div>

          {unknownHeaders.length > 0 && (
            <p className="text-xs text-slate-500 mb-4">
              <i className="fas fa-circle-info mr-2"></i>
              Ignored unrecognised column(s): {unknownHeaders.join(', ')}
            </p>
          )}

          <ResultTable
            title="Skipped rows"
            description="Read successfully but not imported — fix the cell and re-run the same file"
            rows={skipped}
            tone="border-amber-200"
            defaultOpen
            columns={[
              { label: 'Excel row', get: (r) => r.row },
              { label: 'Serial', get: (r) => r.serial },
              { label: 'Reason', get: (r) => r.reason },
            ]}
          />

          <ResultTable
            title="Failed to save"
            description="Passed validation but the database write did not succeed"
            rows={failed}
            tone="border-red-200"
            defaultOpen
            columns={[
              { label: 'Excel row', get: (r) => r.row },
              { label: 'Serial', get: (r) => r.serial },
              { label: 'Reason', get: (r) => r.reason },
            ]}
          />

          <ResultTable
            title="Imported but not assigned"
            description="The employee ID in the sheet did not match anyone — the laptop was still imported, and is unassigned"
            rows={unassigned}
            tone="border-amber-200"
            columns={[
              { label: 'Excel row', get: (r) => r.row },
              { label: 'Serial', get: (r) => r.serial },
              { label: 'Emp ID in sheet', get: (r) => r.empId },
            ]}
          />

          <ResultTable
            title="Imported"
            description="Newly created laptops"
            rows={created}
            tone="border-slate-200"
            columns={[
              { label: 'Excel row', get: (r) => r.row },
              { label: 'Asset ID', get: (r) => r.assetId },
              { label: 'Serial', get: (r) => r.serial },
              { label: 'Assigned to', get: (r) => r.assignedTo || '-' },
            ]}
          />
        </>
      )}
    </div>
  );
};

export default ImportRegister;
