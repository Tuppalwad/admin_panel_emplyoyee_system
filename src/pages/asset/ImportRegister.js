import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Loading } from '../../components/common';
import { importLegacyRegister } from '../../redux/actions/assetAction';
import { formatDate, getLoggedInEmail } from './assetHelpers';

const StatTile = ({ label, value, color }) => (
  <div className={`rounded-2xl border p-5 ${color}`}>
    <p className="text-xs uppercase tracking-wide mb-1 opacity-80">{label}</p>
    <h3 className="text-3xl font-bold">{value ?? 0}</h3>
  </div>
);

const ImportRegister = () => {
  const dispatch = useDispatch();

  const [excelFile, setExcelFile] = useState(null);
  const [importedBy, setImportedBy] = useState(getLoggedInEmail());
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [showSkipped, setShowSkipped] = useState(false);
  const [showUnresolved, setShowUnresolved] = useState(true);

  const notify = (message) => toast(message);

  const handleFileChange = (event) => {
    setErrors((prev) => ({ ...prev, excelFile: '' }));
    setExcelFile(event.target.files?.[0] || null);
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!excelFile) newErrors.excelFile = 'Select the .xlsx register file';
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
        notify('Import complete');
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

  const skippedRows = result?.skippedRows || [];
  const unresolvedAssignments = result?.unresolvedAssignments || [];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <ToastContainer />
      {loading && <Loading />}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Import Laptop Register (.xlsx)
            </h1>

            <p className="text-slate-500 mt-1">
              One-time import of HR's legacy laptop tracking spreadsheet
            </p>
          </div>

          <Link
            to="/dashboard/asset/view"
            className="px-5 py-3 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 transition"
          >
            <i className="fas fa-list mr-2"></i>
            All Assets
          </Link>

        </div>

      </div>

      {/* Upload form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800">
            <i className="fas fa-circle-info mr-2"></i>
            This reads one specific spreadsheet layout — HR's laptop register, which must
            have a column header containing "code" and one containing "date". It is meant
            to be run once, not as a recurring workflow, and it only imports laptops.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="excelFile">
              Register File <span className="text-red-500">*</span>
            </label>

            <input
              type="file"
              name="excelFile"
              accept=".xlsx"
              onChange={handleFileChange}
              className={`shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.excelFile ? 'border-red-500' : ''
                }`}
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
              className={`shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.importedBy ? 'border-red-500' : ''
                }`}
            />

            {errors.importedBy && (
              <p className="text-red-500 text-xs italic my-2">{errors.importedBy}</p>
            )}
          </div>

        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          <i className="fas fa-file-import mr-2"></i>
          {loading ? 'Importing...' : 'Run Import'}
        </button>

      </div>

      {/* Results */}
      {result && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatTile
              label="Laptops Found"
              value={result.totalLaptopsFound}
              color="bg-blue-50 border-blue-100 text-blue-700"
            />

            <StatTile
              label="Created"
              value={result.created}
              color="bg-green-50 border-green-100 text-green-700"
            />

            <StatTile
              label="Skipped (already existed)"
              value={result.skippedExisting}
              color="bg-slate-50 border-slate-200 text-slate-700"
            />
          </div>

          {/* Unresolved assignments — the list HR has to reconcile by hand */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">

            <button
              onClick={() => setShowUnresolved((prev) => !prev)}
              className="flex items-center justify-between w-full text-left"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Unresolved Assignments ({unresolvedAssignments.length})
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Historical handovers whose spreadsheet name matched no employee
                </p>
              </div>

              <i className={`fas fa-chevron-${showUnresolved ? 'up' : 'down'} text-slate-500`}></i>
            </button>

            {showUnresolved && (
              <div className="mt-5">

                {unresolvedAssignments.length ? (
                  <>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                      <p className="text-sm text-amber-800">
                        <i className="fas fa-triangle-exclamation mr-2"></i>
                        These assets were imported, but the handover could not be linked to
                        an employee record. There is no endpoint to correct a historical
                        assignment's employee after import — treat this as a reference list
                        to reconcile manually, and keep a copy before leaving this screen.
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="text-left text-slate-500 border-b">
                            <th className="py-3 pr-4">Serial</th>
                            <th className="py-3 pr-4">Date</th>
                            <th className="py-3 pr-4">Name In Spreadsheet</th>
                          </tr>
                        </thead>

                        <tbody>
                          {unresolvedAssignments.map((row, index) => (
                            <tr key={`${row.serial}-${index}`} className="border-b last:border-0">
                              <td className="py-3 pr-4 font-medium text-slate-800">
                                {row.serial || '-'}
                              </td>

                              <td className="py-3 pr-4">{formatDate(row.date)}</td>
                              <td className="py-3 pr-4 text-slate-600">{row.rawName || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500">
                    Every handover in the file matched an employee — nothing to reconcile.
                  </p>
                )}

              </div>
            )}

          </div>

          {/* Skipped rows */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

            <button
              onClick={() => setShowSkipped((prev) => !prev)}
              className="flex items-center justify-between w-full text-left"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Skipped Rows ({skippedRows.length})
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Rows the import could not read — fix them in the source file for a second pass
                </p>
              </div>

              <i className={`fas fa-chevron-${showSkipped ? 'up' : 'down'} text-slate-500`}></i>
            </button>

            {showSkipped && (
              <div className="mt-5">

                {skippedRows.length ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-500 border-b">
                          <th className="py-3 pr-4">Row</th>
                          <th className="py-3 pr-4">Reason</th>
                        </tr>
                      </thead>

                      <tbody>
                        {skippedRows.map((row, index) => (
                          <tr key={`${row.row}-${index}`} className="border-b last:border-0">
                            <td className="py-3 pr-4 font-medium text-slate-800">
                              {row.row}
                            </td>

                            <td className="py-3 pr-4 text-slate-600">{row.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No rows were skipped.
                  </p>
                )}

              </div>
            )}

          </div>
        </>
      )}

    </div>
  );
};

export default ImportRegister;
