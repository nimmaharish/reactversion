/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { TextField } from '@material-ui/core';
import styles from './Input.module.css';

function Input({
  value, setValue, errMsg, validate, placeholder, type, disabled, label, className, labelClassName, ...props
}) {
  return (
    <>
      {label && (<div className={cx(styles.label, labelClassName)}>{label}</div>)}
      <TextField
        value={value}
        type={type}
        className={cx(styles.slugSec, className)}
        placeholder={placeholder}
        disabled={disabled}
        onBlur={(e) => {
          if (validate) {
            validate(e.target.value);
          }
        }}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        InputProps={{
          classes: {
            input: cx(styles.slug, styles.single),
          },
        }}
        variant="standard"
        {...props}
      />
      {errMsg && (
        <div className={styles.err}>
          {errMsg}
        </div>
      )}
    </>
  );
}

Input.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  errMsg: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  validate: PropTypes.func.isRequired,
  type: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
  disabled: false,
  label: '',
  className: '',
  labelClassName: '',
  errMsg: '',
};

export default Input;
