/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import cx from 'classnames';
import styles from './TextArea.module.css';
import { ErrorMessage } from './ErrorMessage';

export function TextArea({
  name,
  className,
  ...props
}) {
  const [, meta, helpers] = useField(name);
  return (
    <>
      <textarea
        onChange={e => helpers.setValue(e.target.value)}
        className={cx(styles.textArea, className)}
        value={meta.value}
        {...props}
      />
      <ErrorMessage name={name} />
    </>
  );
}

TextArea.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
};

TextArea.defaultProps = {
  className: '',
};
