import React, { useEffect, useMemo } from 'react';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEmployees } from '../../redux/actions/employeeActions';

export const employeeLabel = (employee) => {
  const name =
    employee?.fullName ||
    `${employee?.firstName || ''} ${employee?.lastName || ''}`.trim();

  return name ? `${name} (${employee.empId})` : employee?.empId || '';
};

/* A plain <select> is unusable once the company has a few hundred employees, so this
   wraps react-select (already used on the employee info screen) to get type-ahead
   filtering over both name and empId. */
function EmployeeSelect({
  label = 'Employee',
  value,
  onChange,
  error,
  required = false,
  placeholder = 'Search by name or employee ID',
  excludeEmpId,
  isClearable = false,
  autoFocus = false,
  hideLabel = false,
  hideHint = false,
}) {
  const dispatch = useDispatch();
  const { allEmployees = [] } = useSelector((state) => state.employee) || {};

  useEffect(() => {
    if (!allEmployees.length) {
      dispatch(getAllEmployees());
    }
  }, [dispatch, allEmployees.length]);

  const options = useMemo(
    () =>
      allEmployees
        .filter((employee) => employee.empId && employee.empId !== excludeEmpId)
        .map((employee) => ({
          value: employee.empId,
          label: employeeLabel(employee),
        })),
    [allEmployees, excludeEmpId]
  );

  const selected = options.find((option) => option.value === value) || null;

  const styles = {
    control: (base) => ({
      ...base,
      minHeight: '50px',
      borderColor: error ? '#ef4444' : '#d1d5db',
      boxShadow: 'none',
      '&:hover': { borderColor: error ? '#ef4444' : '#9ca3af' },
    }),
    menu: (base) => ({ ...base, zIndex: 20 }),
  };

  return (
    <div className={hideLabel ? '' : 'mb-4'}>
      {!hideLabel && (
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="employeeSelect">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Select
        inputId="employeeSelect"
        options={options}
        value={selected}
        onChange={(option) => onChange(option?.value || '')}
        placeholder={placeholder}
        styles={styles}
        isClearable={isClearable}
        autoFocus={autoFocus}
        noOptionsMessage={() => 'No matching employee'}
      />

      {!hideHint && (
        <p className="text-xs text-slate-500 mt-2">
          {options.length} employees available — start typing to filter.
        </p>
      )}

      {error && <p className="text-red-500 text-xs italic my-2">{error}</p>}
    </div>
  );
}

export default EmployeeSelect;
