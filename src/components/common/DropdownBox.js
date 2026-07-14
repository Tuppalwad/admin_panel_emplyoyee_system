import React from 'react';

const DropdownBox = ({ label, name, options, value, onChange, error, placeholder, required = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          error ? 'border-red-500' : ''
        }`}
      >
        <option value="" disabled hidden>
          {placeholder ? placeholder : `Select ${label}`}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs italic my-2">{error}</p>}
    </div>
  );
};

export default DropdownBox;
