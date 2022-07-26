/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import { TextField as MuiTextField } from '@material-ui/core';
import cx from 'classnames';
import { ErrorMessage } from 'components/formik/ErrorMessage';
import styles from './TextField.module.css';

export function TextField({
  className,
  name,
  classEnabled,
  ...props
}) {
  const [field] = useField(name);
  return (
    <>
      <MuiTextField
        {...field}
        variant="outlined"
        type="text"
        className={cx({ [styles.textField]: classEnabled }, className)}
        {...props}
      />
      <ErrorMessage name={name} />
    </>
  );
}

TextField.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  classEnabled: PropTypes.bool,
};

TextField.defaultProps = {
  className: '',
  classEnabled: true,
};
