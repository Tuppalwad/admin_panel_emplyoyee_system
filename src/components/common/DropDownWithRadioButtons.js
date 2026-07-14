import React, { useState } from 'react';

const DropdownWithRadioButtons = ({ name, options, value, onChange, error, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionChange = (event) => {
    onChange(event);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="relative mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
        {placeholder}
      </label>
      <div
        onClick={handleToggle}
        className={`cursor-pointer shadow appearance-none border-gray-300 rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          error ? 'border-red-500' : ''
        }`}
      >
        {value || placeholder}
      </div>
      {isOpen && (
        <div className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full shadow-lg">
          {options.map((option) => (
            <label key={option} className="block py-2 px-3 cursor-pointer hover:bg-gray-200">
              <input
                type="radio"
                name={name}
                value={option}
                checked={value === option}
                onChange={handleOptionChange}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      )}
      {error && <p className="text-red-500 text-xs italic my-2">{error}</p>}
    </div>
  );
};

export default DropdownWithRadioButtons;
