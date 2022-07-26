import React from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage as MuiErrorMessage } from 'formik';
import styles from './ErrorMessage.module.css';

export function ErrorMessage({ name }) {
  return (
    <div className={styles.container}>
      <MuiErrorMessage name={name} />
    </div>
  );
}

ErrorMessage.propTypes = {
  name: PropTypes.string.isRequired
};

ErrorMessage.defaultProps = {};
