/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select/creatable';
import styles from './Select2.module.css';

const addOption = input => {
  const value = (input.startsWith('#') ? input : `#${input}`)
    .replace(',', '')
    .replace(' ', '')
    .toLowerCase();
  return {
    label: value,
    value
  };
};

export function HashTagSelect({
  options,
  className,
  setValue,
  value,
  ...props
}) {
  const [input, setInput] = useState('');
  const handleInputChange = (inputValue) => {
    const char = inputValue.charAt(inputValue.length - 1);
    if (!/([A-Za-z0-9,# ])/.test(char)) {
      return;
    }
    if (char === ' ' || char === ',') {
      setInput('');
      const str = inputValue.slice(0, inputValue.length - 1);
      if (inputValue.length > 0 && str.length > 0) {
        setValue([...value, addOption(str)]);
      }
      return;
    }
    setInput(inputValue);
  };

  const handleChange = (value) => {
    setValue(value);
  };

  return (
    <>
      <Select
        className={styles.textField}
        classNamePrefix="react-select"
        options={value}
        value={value}
        menuIsOpen={false}
        inputValue={input}
        onChange={handleChange}
        onInputChange={handleInputChange}
        onBlur={(e) => handleInputChange(`${e.target.value} `)}
        {...props}
      />
    </>
  );
}

HashTagSelect.propTypes = {
  className: PropTypes.string,
  options: PropTypes.array,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.string,
};

HashTagSelect.defaultProps = {
  className: '',
  options: [],
  value: ''
};
