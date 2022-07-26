import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@material-ui/core';
import { useDesktop } from 'contexts';
import closeIcon from 'assets/images/orders/list/close.svg';
import { Button, Clickable, ReactInput } from 'phoenix-components';
import cx from 'classnames';
import styles from './InputAlert.module.css';

export function InputAlert({
  title, onCancel, primary, inputTitle, onSave, type, label, placeholder, defaultValue
}) {
  const [value, setValue] = useState(defaultValue ?? '');
  const isDesktop = useDesktop();

  const onChange = (val) => {
    setValue(val);
  };

  return (
    <Dialog
      PaperProps={{
        classes: {
          root: styles.dialog,
        }
      }}
      maxWidth={isDesktop ? 'xs' : 'md'}
      open={true}
    >
      {isDesktop && (
        <div className={cx('flexEnd', styles.padding)}>
          <Clickable
            onClick={onCancel}>
            <img src={closeIcon} alt="" />
          </Clickable>
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.title}>{title}</div>
        <ReactInput
          inputClass={styles.inputClass}
          type={type}
          title={inputTitle}
          label={label}
          placeholder={placeholder}
          value={value}
          setValue={onChange}
        />
        <div className={styles.buttons}>
          <Button
            className={styles.saveButton}
            size="large"
            onClick={() => {
              onSave(value);
              setValue('');
            }}
            label={primary} />
        </div>
      </div>
    </Dialog>
  );
}

InputAlert.propTypes = {
  title: PropTypes.string,
  inputTitle: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  primary: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
};

InputAlert.defaultProps = {
  title: 'Add Title',
  inputTitle: '',
  primary: 'CONTINUE',
  type: 'text',
  placeholder: 'Enter input',
  label: 'Enter input',
  defaultValue: ''
};
