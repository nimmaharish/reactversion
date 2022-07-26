/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import Select from 'react-select';
import styles from './Select2.module.css';
import { ErrorMessage } from './ErrorMessage';

export function Select2({
  name, options, className, ...props
}) {
  const [, meta, helpers] = useField(name);

  const { value } = meta;

  return (
    <>
      <Select
        className={styles.textField}
        classNamePrefix="react-select"
        options={options}
        value={value}
        onChange={val => helpers.setValue(val)}
        {...props}
      />
      <ErrorMessage name={name} />
    </>
  );
}

Select2.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  options: PropTypes.array,
};

Select2.defaultProps = {
  className: '',
  options: [],
};
