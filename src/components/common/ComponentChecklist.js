import React from 'react';

/* HR's manual handover process checks these individually on every laptop.
   Any other category starts empty — a mouse has no RAM to check. */
export const LAPTOP_COMPONENTS = [
  'RAM',
  'HDD',
  'SSD',
  'Keyboard',
  'Mouse',
  'Battery',
  'Processor',
  'Generation',
];

export const defaultComponentChecks = (category) =>
  category === 'Laptop'
    ? LAPTOP_COMPONENTS.map((component) => ({ component, status: '' }))
    : [];

/* Every componentChecks field is optional, so half-filled rows are dropped rather
   than posted as blanks — a prefilled but untouched laptop list sends nothing. */
export const sanitizeComponentChecks = (checks = []) => {
  const cleaned = checks
    .map((check) => ({
      component: (check.component || '').trim(),
      status: (check.status || '').trim(),
    }))
    .filter((check) => check.component && check.status);

  return cleaned.length ? cleaned : undefined;
};

/* Pairs up an assignment's out/in checks by component name so the audit view can
   show what changed while the employee held the asset. */
export const mergeComponentChecks = (atAssign = [], atReturn = []) => {
  const names = [];

  [...(atAssign || []), ...(atReturn || [])].forEach((check) => {
    if (check?.component && !names.includes(check.component)) {
      names.push(check.component);
    }
  });

  return names.map((component) => {
    const assigned = (atAssign || []).find((check) => check.component === component);
    const returned = (atReturn || []).find((check) => check.component === component);

    return {
      component,
      statusAtAssign: assigned?.status || '',
      statusAtReturn: returned?.status || '',
      changed: Boolean(
        assigned?.status && returned?.status && assigned.status !== returned.status
      ),
    };
  });
};

function ComponentChecklist({
  label = 'Component Checks',
  description,
  value = [],
  onChange,
  category,
}) {
  const updateRow = (index, field, fieldValue) => {
    onChange(
      value.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: fieldValue } : row
      )
    );
  };

  const addRow = () => {
    onChange([...value, { component: '', status: '' }]);
  };

  const removeRow = (index) => {
    onChange(value.filter((row, rowIndex) => rowIndex !== index));
  };

  const addSuggestedRows = () => {
    onChange([...value, ...defaultComponentChecks('Laptop')]);
  };

  return (
    <div className="mb-4">

      <div className="flex justify-between items-center mb-2 gap-3">
        <label className="block text-gray-700 text-sm font-bold">
          {label}
          <span className="text-slate-400 font-normal ml-2">(optional)</span>
        </label>

        <div className="flex gap-2">
          {category === 'Laptop' && value.length === 0 && (
            <button
              type="button"
              onClick={addSuggestedRows}
              className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200 transition"
            >
              <i className="fas fa-list-check mr-2"></i>
              Laptop Components
            </button>
          )}

          <button
            type="button"
            onClick={addRow}
            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition"
          >
            <i className="fas fa-plus mr-2"></i>
            Add Row
          </button>
        </div>
      </div>

      {description && (
        <p className="text-xs text-slate-500 mb-3">{description}</p>
      )}

      {value.length === 0 ? (
        <p className="text-sm text-slate-500">
          No component checks recorded.
        </p>
      ) : (
        <>
          {value.map((row, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-3 mb-3">

              <input
                type="text"
                value={row.component}
                onChange={(event) => updateRow(index, 'component', event.target.value)}
                placeholder="Component (e.g. RAM)"
                className="shadow appearance-none border-gray-300 rounded w-full md:w-1/3 py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <input
                type="text"
                value={row.status}
                onChange={(event) => updateRow(index, 'status', event.target.value)}
                placeholder="Status (e.g. 16GB / Working / Replaced)"
                className="shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

              <button
                type="button"
                onClick={() => removeRow(index)}
                className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
              >
                <i className="fas fa-trash"></i>
              </button>

            </div>
          ))}

          <p className="text-xs text-slate-500">
            Rows without both a component and a status are not saved.
          </p>
        </>
      )}

    </div>
  );
}

export default ComponentChecklist;
