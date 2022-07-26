/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import Select from 'react-select/creatable';
import styles from './Select2.module.css';
import { ErrorMessage } from './ErrorMessage';

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
  name,
  options,
  className,
  ...props
}) {
  const [input, setInput] = useState('');
  const [, meta, helpers] = useField(name);

  const { value } = meta;

  const handleInputChange = (inputValue) => {
    const char = inputValue.charAt(inputValue.length - 1);
    if (!/([A-Za-z0-9,# ])/.test(char)) {
      return;
    }
    if (char === ' ' || char === ',') {
      setInput('');
      const str = inputValue.slice(0, inputValue.length - 1);
      if (inputValue.length > 0 && str.length > 0) {
        helpers.setValue([...value, addOption(str)]);
      }
      return;
    }
    setInput(inputValue);
  };

  const handleChange = (value) => {
    helpers.setValue(value);
  };

  return (
    <>
      <Select
        className={styles.textField}
        classNamePrefix="react-select"
        options={options}
        value={value}
        menuIsOpen={false}
        inputValue={input}
        onChange={handleChange}
        onInputChange={handleInputChange}
        onBlur={(e) => handleInputChange(`${e.target.value} `)}
        {...props}
      />
      <ErrorMessage name={name} />
    </>
  );
}

HashTagSelect.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  options: PropTypes.array,
};

HashTagSelect.defaultProps = {
  className: '',
  options: [],
};
