/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { InputAdornment } from '@material-ui/core';
import { TextField as Field } from 'components/formik';
import { useShop } from 'contexts';
import styles from './Delivery.module.css';

export function TextField({
  name,
  placeholder,
  label,
  ...props
}) {
  const shop = useShop();
  return (
    <div className={styles.container}>
      {label && <div className={styles.label}>{label}</div>}
      <Field
        name={name}
        fullWidth
        placeholder={placeholder}
        className={styles.textField}
        classEnabled={false}
        InputProps={{
          startAdornment: (
            <InputAdornment
              position="start">
              {shop.currency}
            </InputAdornment>),
        }}
        {...props}
      />
    </div>
  );
}

TextField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string
};

TextField.defaultProps = {
  label: undefined,
  placeholder: undefined,
};
