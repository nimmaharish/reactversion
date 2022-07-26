/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'components/shared/Drawer';
import { Button, FormikInput } from 'phoenix-components';
import { useField, useFormikContext } from 'formik';
import { useToggle } from 'hooks/common';
import { useDesktop } from 'contexts';
import styles from './IDBottomDrawer.module.css';

const Props = {
  fb: {
    title: 'Facebook Pixel',
    label: 'Facebook Pixel ID',
    placeholder: 'Enter Facebook Pixel ID'
  },
  ga: {
    title: 'Google Analytics',
    label: 'Google Analytics Property ID',
    placeholder: 'Enter Analytics Property ID'
  },
};

export function IDBottomDrawer({ name, onClose }) {
  const { title, label, placeholder } = Props[name];
  const [error, toggleError] = useToggle();
  const [{ value },, { setValue }] = useField(`${name}.id`);
  const { submitForm } = useFormikContext();
  const isDesktop = useDesktop();

  const onSave = () => {
    const val = value.trim();
    if (val.length < 2) {
      toggleError();
      return;
    }
    if (val !== value) {
      setValue(val);
    }
    submitForm();
  };

  if (isDesktop) {
    return (
      <div className={styles.container}>
        <FormikInput name={`${name}.id`} label={label} placeholder={placeholder} />
        {error && <div className={styles.error}>This field is required</div>}
        <div className={styles.button}>
          <Button size="large" label="Save" onClick={onSave} />
        </div>
      </div>
    );
  }
  return (
    <Drawer title={title} onClose={onClose} closeButton={true}>
      <div className={styles.container}>
        <FormikInput name={`${name}.id`} label={label} placeholder={placeholder} />
        {error && <div className={styles.error}>This field is required</div>}
        <div className={styles.button}>
          <Button
            bordered={false}
            size="large"
            fullWidth
            label="Save"
            onClick={onSave} />
        </div>
      </div>
    </Drawer>
  );
}

IDBottomDrawer.propTypes = {
  name: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

IDBottomDrawer.defaultProps = {};
