import React from 'react';
import PropTypes from 'prop-types';
import { CheckBox } from 'phoenix-components/lib/formik';
import styles from './OnlineMode.module.css';

export function OnlineMode({
  name,
  label,
  onChange,
}) {
  return (
    <div className={styles.container}>
      <CheckBox
        label={label}
        name={name}
        onChange={(value) => {
          onChange(value);
        }}
      />
    </div>
  );
}

OnlineMode.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

OnlineMode.defaultProps = {
  onChange: null
};
