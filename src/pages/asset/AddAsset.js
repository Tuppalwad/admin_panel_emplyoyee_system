import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { DropdownBox, TextInput, Loading } from '../../components/common';
import { LAPTOP_COMPONENTS } from '../../components/common/ComponentChecklist';
import { createAsset, editAsset, getAssetCategories } from '../../redux/actions/assetAction';
import { formatInputDate } from './assetHelpers';
import { composeSpecifications, parseSpecifications, specFieldsFor } from './specFields';
import { validateAsset } from './validate';

/* Add/Edit posts the Excel-shaped named fields (ram, hdd, ...) rather than a raw
   componentChecks array — the backend builds the array from them using these same
   labels. Sending both is not allowed: a raw array would win and the named fields
   would be ignored. Assign/Return/Transfer/Maintenance still use the generic
   ComponentChecklist and are untouched. */
const LAPTOP_COMPONENT_FIELDS = LAPTOP_COMPONENTS.map((label) => ({
  label,
  name: label.toLowerCase(),
}));

/* Edit prefill: read each named field out of the asset's existing componentChecks */
const componentFieldValues = (componentChecks = []) =>
  LAPTOP_COMPONENT_FIELDS.reduce((acc, field) => {
    const match = (componentChecks || []).find(
      (check) => check.component === field.label
    );
    acc[field.name] = match?.status || '';
    return acc;
  }, {});

/* Whatever the eight fields are not currently editing — entries from the bulk Excel
   import or a handover check, and everything on a non-Laptop asset. Shown read-only
   rather than edited or silently dropped. */
const unmanagedComponentChecks = (componentChecks = [], category) => {
  const managed = category === 'Laptop' ? LAPTOP_COMPONENTS : [];
  return (componentChecks || []).filter((check) => !managed.includes(check.component));
};

const AddAsset = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const assetData = location.state?.info || null;
  const isEdit = Boolean(assetData?.assetId);

  const { enums } = useSelector((state) => state.assets);

  const [formData, setFormData] = useState({
    category: assetData?.category || '',
    brand: assetData?.brand || '',
    modelName: assetData?.modelName || '',
    serialNumber: assetData?.serialNumber || '',
    purchaseDate: formatInputDate(assetData?.purchaseDate),
    purchaseCost: assetData?.purchaseCost ?? '',
    vendor: assetData?.vendor || '',
    warrantyExpiryDate: formatInputDate(assetData?.warrantyExpiryDate),
    condition: assetData?.condition || 'New',
    currentLocation: assetData?.currentLocation || '',
    notes: assetData?.notes || '',
    legacyTag: '',
    ...componentFieldValues(assetData?.componentChecks),
  });

  /* The asset API takes documents as {name, url} pairs — there is no upload
     endpoint for asset files, so links are entered manually. */
  const [documents, setDocuments] = useState(
    assetData?.documents?.map((doc) => ({ name: doc.name, url: doc.url })) || []
  );

  const otherComponentChecks = unmanagedComponentChecks(
    assetData?.componentChecks,
    formData.category
  );

  /* Specifications are one free-text string on the backend. They are edited here as
     per-category fields and recombined on submit; see ./specFields.js. */
  const parsedSpecs = parseSpecifications(assetData?.specifications, assetData?.category);
  const [specValues, setSpecValues] = useState(parsedSpecs.values);
  const [specExtra, setSpecExtra] = useState(parsedSpecs.extra);

  const specFields = specFieldsFor(formData.category);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const notify = (message) => toast(message);

  useEffect(() => {
    dispatch(getAssetCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSpecChange = (event) => {
    const { name, value } = event.target;
    setSpecValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentChange = (index, field, value) => {
    setDocuments((prev) =>
      prev.map((doc, docIndex) => (docIndex === index ? { ...doc, [field]: value } : doc))
    );
  };

  const addDocumentRow = () => {
    setDocuments((prev) => [...prev, { name: '', url: '' }]);
  };

  const removeDocumentRow = (index) => {
    setDocuments((prev) => prev.filter((doc, docIndex) => docIndex !== index));
  };

  const resetForm = () => {
    setFormData({
      category: '',
      brand: '',
      modelName: '',
      serialNumber: '',
      purchaseDate: '',
      purchaseCost: '',
      vendor: '',
      warrantyExpiryDate: '',
      condition: 'New',
      currentLocation: '',
      notes: '',
      legacyTag: '',
      ...componentFieldValues([]),
    });
    setDocuments([]);
    setSpecValues({});
    setSpecExtra('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateAsset(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      const data = {
        category: formData.category,
        brand: formData.brand,
        modelName: formData.modelName,
        serialNumber: formData.serialNumber || undefined,
        specifications:
          composeSpecifications(formData.category, specValues, specExtra) || undefined,
        purchaseDate: formData.purchaseDate,
        purchaseCost: formData.purchaseCost ? Number(formData.purchaseCost) : undefined,
        vendor: formData.vendor || undefined,
        warrantyExpiryDate: formData.warrantyExpiryDate || undefined,
        condition: formData.condition,
        currentLocation: formData.currentLocation || undefined,
        documents: documents.filter((doc) => doc.name && doc.url),
        notes: formData.notes || undefined,
        legacyTag: formData.legacyTag.trim() || undefined,
      };

      /* Named component fields, laptops only, empties omitted. Deliberately no
         componentChecks key — sending one would make the backend ignore these. */
      if (formData.category === 'Laptop') {
        LAPTOP_COMPONENT_FIELDS.forEach((field) => {
          const value = (formData[field.name] || '').trim();
          if (value) {
            data[field.name] = value;
          }
        });
      }

      const res = isEdit
        ? await dispatch(editAsset({ ...data, assetId: assetData.assetId }))
        : await dispatch(createAsset(data));

      if (res?.code === 200 || res?.code === 201) {
        setErrors({});

        if (isEdit) {
          notify('Asset Updated Successfully');
          navigate(-1);
        } else {
          notify(`Asset Added Successfully${res?.data?.assetId ? ` — ${res.data.assetId}` : ''}`);
          resetForm();
        }
      } else {
        notify(res?.message || 'Unable to save asset');
      }
    } catch (error) {
      console.log(error);
      notify('Error saving asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-5">
      <ToastContainer />
      {loading && <Loading />}

      <h1 className="text-2xl font-bold mb-6 mt-3 text-gray-800">
        {isEdit ? `Edit Asset — ${assetData.assetId}` : 'Add Asset'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 shadow-md rounded-lg">

        <DropdownBox
          name="category"
          label="Category"
          placeholder="Category*"
          options={enums.ASSET_CATEGORIES}
          value={formData.category}
          onChange={handleChange}
          error={errors.category}
          required
        />

        <TextInput
          name="brand"
          label="Brand"
          type="text"
          placeholder="Brand*"
          value={formData.brand}
          onChange={handleChange}
          error={errors.brand}
          required
        />

        <TextInput
          name="modelName"
          label="Model Name"
          type="text"
          placeholder="Model Name*"
          value={formData.modelName}
          onChange={handleChange}
          error={errors.modelName}
          required
        />

        <TextInput
          name="serialNumber"
          label="Serial Number"
          type="text"
          placeholder="Serial Number"
          value={formData.serialNumber}
          onChange={handleChange}
          error={errors.serialNumber}
        />

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="legacyTag">
            Legacy Tag Number
          </label>

          <input
            type="text"
            name="legacyTag"
            value={formData.legacyTag}
            onChange={handleChange}
            placeholder="e.g. MNT OLD-06-24-047"
            className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          <p className="text-xs text-slate-500 mt-2">
            If this asset was previously tracked with an old tag/reference number, enter it here.
            {isEdit && ' It is added to the notes below — leave it blank unless you are recording a new tag.'}
          </p>
        </div>

        <TextInput
          name="purchaseDate"
          label="Purchase Date"
          type="date"
          placeholder="Purchase Date"
          value={formData.purchaseDate}
          onChange={handleChange}
          error={errors.purchaseDate}
          required
        />

        <TextInput
          name="purchaseCost"
          label="Purchase Cost"
          type="text"
          placeholder="Purchase Cost"
          value={formData.purchaseCost}
          onChange={handleChange}
          error={errors.purchaseCost}
        />

        <TextInput
          name="vendor"
          label="Vendor"
          type="text"
          placeholder="Vendor"
          value={formData.vendor}
          onChange={handleChange}
          error={errors.vendor}
        />

        <TextInput
          name="warrantyExpiryDate"
          label="Warranty Expiry Date"
          type="date"
          placeholder="Warranty Expiry Date"
          value={formData.warrantyExpiryDate}
          onChange={handleChange}
          error={errors.warrantyExpiryDate}
        />

        <DropdownBox
          name="condition"
          label="Condition"
          placeholder="Condition"
          options={enums.CONDITIONS}
          value={formData.condition}
          onChange={handleChange}
          error={errors.condition}
        />

        <TextInput
          name="currentLocation"
          label="Current Location"
          type="text"
          placeholder="e.g. Pune Office — Store Room"
          value={formData.currentLocation}
          onChange={handleChange}
          error={errors.currentLocation}
        />

        {/* Specifications — per-category fields, recombined into the single
            free-text field the backend stores. */}
        <div className="col-span-1 md:col-span-2">

          <h2 className="text-gray-700 text-sm font-bold mb-1">
            Specifications
            <span className="text-slate-400 font-normal ml-2">(all optional)</span>
          </h2>

          {!formData.category && (
            <p className="text-xs text-slate-500 mb-3">
              Pick a category above to get the fields that suit it.
            </p>
          )}

          {formData.category === 'Laptop' && (
            <p className="text-xs text-slate-500 mb-3">
              Laptop specs live in the Components section below — RAM, SSD, Processor and
              Generation are captured there. Use the box below for anything else.
            </p>
          )}

          {specFields.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6">
              {specFields.map((field) => (
                <TextInput
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  type="text"
                  placeholder={field.placeholder}
                  value={specValues[field.name] || ''}
                  onChange={handleSpecChange}
                />
              ))}
            </div>
          )}

          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="specExtra">
            Additional Details
          </label>

          <textarea
            name="specExtra"
            rows={2}
            value={specExtra}
            onChange={(event) => setSpecExtra(event.target.value)}
            placeholder="Anything the fields above do not cover"
            className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

        </div>

        {/* Laptop component fields — the columns HR's register already uses */}
        {formData.category === 'Laptop' && (
          <div className="col-span-1 md:col-span-2">

            <h2 className="text-gray-700 text-sm font-bold mb-1">
              Components
              <span className="text-slate-400 font-normal ml-2">(all optional)</span>
            </h2>

            <p className="text-xs text-slate-500 mb-3">
              Free text, exactly as recorded in the register — e.g. "8GB", "512GB", "OK",
              "Not working".
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-6">
              {LAPTOP_COMPONENT_FIELDS.map((field) => (
                <TextInput
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  type="text"
                  placeholder={field.label}
                  value={formData[field.name]}
                  onChange={handleChange}
                  error={errors[field.name]}
                />
              ))}
            </div>

          </div>
        )}

        {/* Checks this form does not own — bulk import, handover records, etc. */}
        {isEdit && otherComponentChecks.length > 0 && (
          <div className="col-span-1 md:col-span-2">

            <h2 className="text-gray-700 text-sm font-bold mb-1">
              Other Recorded Components
            </h2>

            <p className="text-xs text-slate-500 mb-3">
              Recorded elsewhere — a bulk import, or a handover or maintenance check.
              Shown for reference; this form does not edit them.
            </p>

            <div className="flex flex-wrap gap-2">
              {otherComponentChecks.map((check, index) => (
                <span
                  key={check._id || `${check.component}-${index}`}
                  className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm"
                >
                  <strong>{check.component}</strong>
                  {check.status ? `: ${check.status}` : ''}
                </span>
              ))}
            </div>

          </div>
        )}

        <div className="col-span-1 md:col-span-2">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
            Notes
          </label>

          <textarea
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Anything worth recording about this asset"
            className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Documents */}
        <div className="col-span-1 md:col-span-2">

          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700 text-sm font-bold">
              Documents (invoice, warranty card)
            </label>

            <button
              type="button"
              onClick={addDocumentRow}
              className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Document
            </button>
          </div>

          {documents.length === 0 && (
            <p className="text-sm text-slate-500">
              No documents added.
            </p>
          )}

          {documents.map((doc, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-3 mb-3">

              <input
                type="text"
                value={doc.name}
                onChange={(event) => handleDocumentChange(index, 'name', event.target.value)}
                placeholder="Document name"
                className="shadow appearance-none border-gray-300 rounded w-full md:w-1/3 py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <input
                type="text"
                value={doc.url}
                onChange={(event) => handleDocumentChange(index, 'url', event.target.value)}
                placeholder="https://..."
                className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <button
                type="button"
                onClick={() => removeDocumentRow(index)}
                className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
              >
                <i className="fas fa-trash"></i>
              </button>

            </div>
          ))}

        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="col-span-1 md:col-span-2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          {loading ? 'loading..' : isEdit ? 'Update Asset' : 'Add Asset'}
        </button>

      </div>
    </div>
  );
};

export default AddAsset;
