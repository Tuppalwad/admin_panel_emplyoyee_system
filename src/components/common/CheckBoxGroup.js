import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const CheckboxGroup = ({ name, options, selectedValues = [], onChange, error, label, className }) => {
  
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
      <div className={classNames("flex flex-row flex-wrap", className)}>
        {options.map((option, index) => (
          <label key={`${option}-${index}`} className="flex items-center mb-2 mr-4">
            <input
              type="checkbox"
              name={name}
              value={option}
              checked={selectedValues.includes(option)}
              onChange={handleCheckboxChange}
              className={classNames('mr-2', { 'border-red-500': error })}
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
  className: PropTypes.string,
};

export default CheckboxGroup;
