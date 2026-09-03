import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Loading } from '../../components/common';
import EmployeeSelect from '../../components/common/EmployeeSelect';
import {
  assignAsset,
  getAssetCategories,
  getAssets,
  getAssetsByEmpId,
} from '../../redux/actions/assetAction';
import { getLoggedInEmail, statusColor } from './assetHelpers';

/* Employee-first handover: pick the person once, send any number of assets out together.
   (View Assets covers the asset-first case — assigning one specific laptop.)

   There is no bulk endpoint, so this posts /asset/assign once per selected asset and reports
   per-asset outcomes: a partial failure must not look like a total one. */
const AssignAsset = () => {
  const dispatch = useDispatch();
  const { enums } = useSelector((state) => state.assets);

  const [empId, setEmpId] = useState('');
  const [holdings, setHoldings] = useState([]);
  const [pool, setPool] = useState([]);
  const [selected, setSelected] = useState([]);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const [form, setForm] = useState({
    conditionAtAssign: '',
    remarks: '',
    courierName: '',
    trackingNumber: '',
    shippedToAddress: '',
  });
  const [showShipping, setShowShipping] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [results, setResults] = useState(null);

  const loadPool = async () => {
    const res = await dispatch(getAssets({ status: 'Available' }));
    if (res?.code === 200) setPool(res.data || []);
  };

  useEffect(() => {
    dispatch(getAssetCategories());
    loadPool();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  /* What this person already holds — shown so nobody issues a second laptop by accident. */
  useEffect(() => {
    if (!empId) {
      setHoldings([]);
      return;
    }
    (async () => {
      const res = await dispatch(getAssetsByEmpId(empId));
      setHoldings(res?.code === 200 ? res.data || [] : []);
    })();
  }, [dispatch, empId]);

  const filteredPool = useMemo(() => {
    const term = search.trim().toLowerCase();
    return pool.filter((asset) => {
      if (category && asset.category !== category) return false;
      if (!term) return true;
      return [asset.assetId, asset.brand, asset.modelName, asset.serialNumber]
        .filter(Boolean)
        .some((field) => field.toString().toLowerCase().includes(term));
    });
  }, [pool, search, category]);

  const toggle = (assetId) => {
    setErrors((prev) => ({ ...prev, assets: '' }));
    setSelected((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]
    );
  };

  const selectedAssets = pool.filter((asset) => selected.includes(asset.assetId));

  const reset = () => {
    setEmpId('');
    setSelected([]);
    setSearch('');
    setCategory('');
    setForm({
      conditionAtAssign: '',
      remarks: '',
      courierName: '',
      trackingNumber: '',
      shippedToAddress: '',
    });
    setShowShipping(false);
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!empId) newErrors.empId = 'Select the employee receiving these assets';
    if (!selected.length) newErrors.assets = 'Select at least one asset';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setResults(null);

    const done = [];
    const failed = [];

    for (const asset of selectedAssets) {
      try {
        const res = await dispatch(
          assignAsset({
            assetId: asset.assetId,
            empId,
            /* Blank means "keep what the asset already records" — a batch handover should not
               silently rewrite a Damaged item to Good just because one dropdown was left alone. */
            conditionAtAssign: form.conditionAtAssign || asset.condition,
            remarks: form.remarks || undefined,
            courierName: form.courierName || undefined,
            trackingNumber: form.trackingNumber || undefined,
            shippedToAddress: form.shippedToAddress || undefined,
            assignedBy: getLoggedInEmail(),
          })
        );

        if (res?.code === 200) done.push(asset.assetId);
        else failed.push({ assetId: asset.assetId, reason: res?.message || 'Failed' });
      } catch (error) {
        console.log(error);
        failed.push({ assetId: asset.assetId, reason: 'Something went wrong' });
      }
    }

    setLoading(false);
    setResults({ done, failed });

    if (done.length) toast(`${done.length} asset(s) assigned successfully`);
    if (failed.length) toast(`${failed.length} asset(s) could not be assigned`);

    await loadPool();
    if (empId) {
      const res = await dispatch(getAssetsByEmpId(empId));
      setHoldings(res?.code === 200 ? res.data || [] : []);
    }
    setSelected([]);
  };

  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      <ToastContainer />
      {loading && <Loading />}

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Assign Assets</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Hand over one or more assets to an employee in a single step
            </p>
          </div>

          <Link
            to="/dashboard/asset/view"
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition"
          >
            <i className="fas fa-list mr-2"></i>
            All Assets
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ---------- Left: employee + what they already hold ---------- */}
        <div className="lg:col-span-1 space-y-4">

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="text-base font-bold text-gray-800 mb-1">1. Employee</h2>
            <p className="text-xs text-slate-500 mb-3">Who is receiving the assets</p>

            <EmployeeSelect
              label="Assign to"
              value={empId}
              onChange={(value) => {
                setErrors((prev) => ({ ...prev, empId: '' }));
                setEmpId(value);
              }}
              error={errors.empId}
              required
              isClearable
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="text-base font-bold text-gray-800 mb-1">
              Currently Held ({holdings.length})
            </h2>
            <p className="text-xs text-slate-500 mb-3">
              Assets this employee already has — check before issuing a duplicate
            </p>

            {!empId && <p className="text-sm text-slate-500">Select an employee first.</p>}

            {empId && !holdings.length && (
              <p className="text-sm text-slate-500">
                Nothing currently assigned to this employee.
              </p>
            )}

            {holdings.map((asset) => (
              <div
                key={asset.assetId}
                className="border border-slate-200 rounded-lg p-3 mb-2 last:mb-0"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{asset.assetId}</p>
                    <p className="text-xs text-slate-500">
                      {asset.category} — {asset.brand} {asset.modelName}
                    </p>
                  </div>

                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(asset.status)}`}>
                    {asset.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ---------- Right: asset picker + handover details ---------- */}
        <div className="lg:col-span-2 space-y-4">

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex justify-between items-start gap-3 mb-1">
              <h2 className="text-base font-bold text-gray-800">
                2. Assets to Assign ({selected.length} selected)
              </h2>

              {selected.length > 0 && (
                <button
                  onClick={() => setSelected([])}
                  className="text-xs text-slate-500 hover:text-slate-700 underline whitespace-nowrap"
                >
                  Clear selection
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Only assets with status <strong>Available</strong> can be handed over, so the list
              below is limited to those.
            </p>

            <div className="flex flex-col md:flex-row gap-2 mb-3">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search asset ID, serial, brand or model"
                className="shadow appearance-none border-gray-300 rounded-lg w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="shadow appearance-none border-gray-300 rounded-lg py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:w-52"
              >
                <option value="">All Categories</option>
                {enums.ASSET_CATEGORIES.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            {errors.assets && (
              <p className="text-red-500 text-xs italic mb-2">{errors.assets}</p>
            )}

            <div className="border border-slate-200 rounded-lg max-h-80 overflow-y-auto divide-y">
              {!filteredPool.length && (
                <p className="text-sm text-slate-500 p-4">
                  No available assets match this search.
                </p>
              )}

              {filteredPool.map((asset) => {
                const isSelected = selected.includes(asset.assetId);
                return (
                  <label
                    key={asset.assetId}
                    className={`flex items-center gap-3 p-3 cursor-pointer transition ${isSelected ? 'bg-emerald-50' : 'hover:bg-slate-50'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggle(asset.assetId)}
                      className="w-4 h-4 accent-emerald-600"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">
                        {asset.assetId}
                        <span className="font-normal text-slate-500 ml-2">
                          {asset.brand} {asset.modelName}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {asset.category}
                        {asset.serialNumber ? ` — S/N ${asset.serialNumber}` : ''}
                        {asset.condition ? ` — ${asset.condition}` : ''}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Showing {filteredPool.length} of {pool.length} available assets.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h2 className="text-base font-bold text-gray-800 mb-1">3. Handover Details</h2>
            <p className="text-xs text-slate-500 mb-3">Applied to every asset in this handover</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="conditionAtAssign">
                  Condition At Handover
                </label>

                <select
                  value={form.conditionAtAssign}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, conditionAtAssign: event.target.value }))
                  }
                  className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Keep each asset's current condition</option>
                  {enums.CONDITIONS.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>

                <p className="text-xs text-slate-500 mt-2">
                  Leave as-is unless every asset in this batch is going out in the same condition.
                </p>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="remarks">
                  Remarks
                </label>

                <textarea
                  rows={3}
                  value={form.remarks}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, remarks: event.target.value }))
                  }
                  placeholder="Handover notes"
                  className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>

            {/* Collapsed by default — in-office handovers never touch these */}
            <div className="border-t pt-4 mt-2">
              <button
                type="button"
                onClick={() => setShowShipping((prev) => !prev)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-gray-700 text-sm font-bold">
                  Shipping details
                  <span className="text-slate-400 font-normal ml-2">(only if couriered)</span>
                </span>
                <i className={`fas fa-chevron-${showShipping ? 'up' : 'down'} text-xs text-slate-500`}></i>
              </button>

              {showShipping && (
                <div className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="courierName">
                        Courier Name
                      </label>
                      <input
                        type="text"
                        value={form.courierName}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, courierName: event.target.value }))
                        }
                        placeholder="e.g. Blue Dart"
                        className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="trackingNumber">
                        Tracking Number
                      </label>
                      <input
                        type="text"
                        value={form.trackingNumber}
                        onChange={(event) =>
                          setForm((prev) => ({ ...prev, trackingNumber: event.target.value }))
                        }
                        placeholder="Consignment number"
                        className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>
                  </div>

                  <div className="mt-2">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shippedToAddress">
                      Shipped To Address
                    </label>
                    <textarea
                      rows={3}
                      value={form.shippedToAddress}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, shippedToAddress: event.target.value }))
                      }
                      placeholder="Delivery address"
                      className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary + submit */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <p className="text-sm text-slate-600">
                {selected.length
                  ? `Assigning ${selected.length} asset(s)${empId ? ` to ${empId}` : ''}.`
                  : 'Nothing selected yet.'}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={reset}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition"
                >
                  Reset
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={loading || !selected.length || !empId}
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-user-check mr-2"></i>
                  {loading ? 'Assigning...' : `Assign ${selected.length || ''}`.trim()}
                </button>
              </div>
            </div>

            {results && (
              <div className="mt-4 border-t pt-4">
                {results.done.length > 0 && (
                  <p className="text-sm text-green-700 mb-2">
                    <i className="fas fa-circle-check mr-2"></i>
                    Assigned: {results.done.join(', ')}
                  </p>
                )}

                {results.failed.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800 font-semibold mb-1">
                      Not assigned ({results.failed.length})
                    </p>
                    {results.failed.map((item) => (
                      <p key={item.assetId} className="text-sm text-amber-800">
                        {item.assetId} — {item.reason}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AssignAsset;
