import React from 'react';
import PropTypes from 'prop-types';
import { Switch } from 'phoenix-components/lib/formik';
import cx from 'classnames';

import { useField, useFormikContext } from 'formik';
import SnackBar from 'services/snackbar';
import styles from './StatusSwitch.module.css';

function StatusSwitch({
  title,
  name
}) {
  const [{ value: status }, , { setValue: setStatus }] = useField(name);
  const [{ value: enabled }] = useField('enabled');
  const { submitForm } = useFormikContext();

  const onChange = () => {
    if (!enabled && name !== 'enabled') {
      SnackBar.show('Enable chat first, to enable this option', 'warning');
      return;
    }
    setStatus(!status);
    submitForm();
  };

  return (
    <div
      className={cx(styles.container, status ? styles.active : styles.notActive, {
        [styles.disabled]: !enabled && name !== 'enabled'
      })}
    >
      <div className={styles.header}>
        <p>{title}</p>
        <Switch
          name={name}
          onChange={onChange}
        />
      </div>
      <p>
        <span className={styles.statusTitle}>Status :</span>
        {' '}
        <span className={status ? styles.activeText : styles.notActiveText}>
          {status ? 'Enabled' : 'Disabled'}
        </span>
      </p>
    </div>
  );
}

StatusSwitch.propTypes = {
  title: PropTypes.string,
  name: PropTypes.string.isRequired,
};

StatusSwitch.defaultProps = {
  title: 'Enabled',
};

export default StatusSwitch;
