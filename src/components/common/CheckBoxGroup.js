import React from 'react';
import PropTypes from 'prop-types';

const CheckboxGroup = ({ name, options, selectedValues = [], onChange, error, label }) => {
  
  selectedValues = Array.isArray(selectedValues) ? selectedValues : [];

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    onChange({
      target: {
        name,
        value: checked
          ? [...selectedValues, value]
          : selectedValues.filter((item) => item !== value),
      },
    });
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <div className="flex flex-row flex-wrap">
        {options.map((option, index) => (
          <label key={`${option}-${index}`} className="flex items-center mb-2 mr-4">
            <input
              type="checkbox"
              name={name}
              value={option}
              checked={selectedValues.includes(option)}
              onChange={handleCheckboxChange}
              className={`mr-2 ${error ? 'border-red-500' : ''}`}
            />
            {option}
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs italic my-2">{error}</p>}
    </div>
  );
};

CheckboxGroup.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedValues: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  label: PropTypes.string.isRequired,
};

export default CheckboxGroup;
