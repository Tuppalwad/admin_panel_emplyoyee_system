import React from 'react';

const TextInput = ({ label, name, type, value, onChange, error,style,disabled ,maxlength,placeholder,required = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
        {label} { required && <span className="text-red-500 text-sm">*</span>}
      </label>
      <input
        disabled={disabled}
        style = {style}
        type={type}
        name={name}
        maxLength={maxlength}
        value={value}
        accept="image/*"
        placeholder={placeholder}
        onChange={onChange}
        className={`shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          error ? 'border-red-500' : ''
        }`}
      />
      {error && <p className="text-red-500 text-xs italic my-2">{error}</p>}
    </div>
  );
};

export default TextInput;
