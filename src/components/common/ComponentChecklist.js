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

/* Two kinds of value get recorded here and they behave differently. Spec components hold a
   measurement ("16GB", "512GB") and are typed; the rest hold a verdict, which is almost always
   one of a handful of words — so those get one-tap buttons instead of free typing. Free text
   still works everywhere; the buttons only fill the field in. */
const SPEC_COMPONENTS = ['RAM', 'HDD', 'SSD', 'Processor', 'Generation'];

const VERDICTS = ['OK', 'Not Working', 'Missing'];

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

  /* Only blanks are touched, so anything already recorded (a spec value, a fault) survives. */
  const markRemainingOk = () => {
    onChange(
      value.map((row) =>
        row.component && !(row.status || '').trim() ? { ...row, status: 'OK' } : row
      )
    );
  };

  const filledCount = value.filter(
    (row) => (row.component || '').trim() && (row.status || '').trim()
  ).length;

  const isStandard = (component) => LAPTOP_COMPONENTS.includes(component);

  return (
    <div>

      <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
        <label className="block text-gray-700 text-sm font-bold">
          {label}
          {value.length > 0 && (
            <span className="text-slate-400 font-normal ml-2">
              {filledCount} of {value.length} filled
            </span>
          )}
        </label>

        <div className="flex flex-wrap gap-2">
          {value.some((row) => row.component && !(row.status || '').trim()) && (
            <button
              type="button"
              onClick={markRemainingOk}
              className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition"
            >
              <i className="fas fa-check-double mr-1"></i>
              Mark rest OK
            </button>
          )}

          {category === 'Laptop' && value.length === 0 && (
            <button
              type="button"
              onClick={addSuggestedRows}
              className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200 transition"
            >
              <i className="fas fa-list-check mr-1"></i>
              Laptop Components
            </button>
          )}

          <button
            type="button"
            onClick={addRow}
            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition"
          >
            <i className="fas fa-plus mr-1"></i>
            Add
          </button>
        </div>
      </div>

      {description && <p className="text-xs text-slate-500 mb-3">{description}</p>}

      {value.length === 0 ? (
        <p className="text-sm text-slate-500 border border-dashed border-slate-300 rounded-lg p-3 text-center">
          No component checks recorded.
        </p>
      ) : (
        <>
          {/* Two columns on desktop — eight components read as four rows instead of eight */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {value.map((row, index) => {
              const standard = isStandard(row.component);
              const spec = SPEC_COMPONENTS.includes(row.component);
              const done = Boolean((row.status || '').trim());

              return (
                <div
                  key={index}
                  className={`border rounded-lg px-3 py-2 transition ${done ? 'border-green-200 bg-green-50/50' : 'border-slate-200'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {/* A standard component's name is fixed — retyping "RAM" invites typos
                        that split the same component into two labels in reporting. */}
                    {standard ? (
                      <span className="text-xs font-bold text-slate-700 w-24 shrink-0 truncate">
                        {row.component}
                      </span>
                    ) : (
                      <input
                        type="text"
                        value={row.component}
                        onChange={(event) => updateRow(index, 'component', event.target.value)}
                        placeholder="Component"
                        className="w-24 shrink-0 border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-400"
                      />
                    )}

                    <input
                      type="text"
                      value={row.status}
                      onChange={(event) => updateRow(index, 'status', event.target.value)}
                      placeholder={spec ? 'e.g. 16GB' : 'e.g. OK'}
                      list={spec ? undefined : 'component-verdicts'}
                      className="flex-1 min-w-0 border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-400"
                    />

                    {done && (
                      <button
                        type="button"
                        onClick={() => updateRow(index, 'status', '')}
                        title="Clear status"
                        className="text-slate-400 hover:text-slate-600 px-1 shrink-0"
                      >
                        <i className="fas fa-rotate-left text-xs"></i>
                      </button>
                    )}

                    {!standard && (
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        title="Remove row"
                        className="text-red-400 hover:text-red-600 px-1 shrink-0"
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    )}
                  </div>

                  {/* One-tap verdicts for the pass/fail components; spec fields get typed */}
                  {!spec && !done && (
                    <div className="flex gap-1 mt-1.5 ml-24 pl-2">
                      {VERDICTS.map((verdict) => (
                        <button
                          key={verdict}
                          type="button"
                          onClick={() => updateRow(index, 'status', verdict)}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-700 transition"
                        >
                          {verdict}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <datalist id="component-verdicts">
            {[...VERDICTS, 'Working', 'Replaced', 'Damaged'].map((verdict) => (
              <option key={verdict} value={verdict} />
            ))}
          </datalist>

          <p className="text-xs text-slate-500 mt-2">
            Rows left blank are not saved.
          </p>
        </>
      )}

    </div>
  );
}

export default ComponentChecklist;
