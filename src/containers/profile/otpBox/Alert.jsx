import React, { useState, createRef } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@material-ui/core';
import { useDesktop } from 'contexts';
import _ from 'lodash';
import closeIcon from 'assets/images/orders/list/close.svg';
import { Button, Clickable } from 'phoenix-components';
import cx from 'classnames';
import styles from './Alert.module.css';

export function Alert({
  onDelete, onCancel
}) {
  const isDesktop = useDesktop();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const refs = _.range(0, 6)
    .map(() => createRef());

  const setOtpCh = (e, idx) => {
    const { value } = e.target;
    if (/^[0-9]{6}$/.test(value)) {
      e.stopPropagation();
      e.preventDefault();
      setOtp([...value]);
      return;
    }
    if (idx + 1 < 6 && e.target.value !== '') {
      if (refs[idx + 1]?.current) {
        refs[idx + 1].current.focus();
      }
    }
    [otp[idx]] = e.target.value;
    setOtp([...otp]);
  };

  const onDeleteClick = () => {
    onDelete(otp.join(''));
  };

  const onKeyDown = (idx) => (e) => {
    if (e.keyCode === 8 && idx > 0) {
      if (refs[idx - 1]?.current?.focus) {
        refs[idx - 1].current.focus();
        if (idx === 5 && otp[idx]) {
          otp[5] = '';
          setOtp([...otp]);
          return;
        }
        if (otp[idx] === '' || otp[idx] === null) {
          otp[idx - 1] = '';
          setOtp([...otp]);
        }
      }
    }
  };

  const onOtpPaste = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let value = (e.clipboardData || window.clipboardData).getData('text');
    value = value.trim();
    if (/^[0-9]{6}$/.test(value)) {
      setOtp([...value]);
    }
  };

  return (
    <Dialog
      // className={styles.dialog}
      PaperProps={{
        classes: {
          root: styles.dialog,
        }
      }}
      maxWidth={isDesktop ? 'xs' : 'md'}
      open={true}
      onClose={onCancel}
    >
      {isDesktop && (
        <div className={cx('flexEnd', styles.padding)}>
          <Clickable
            onClick={onCancel}>
            <img src={closeIcon} alt="" />
          </Clickable>
        </div>
      )}
      <div className={styles.title}>Verify OTP</div>
      <div className={styles.subTitle}>
        To delete the account please enter the OTP
        sent to your email associated with this
        account.
      </div>
      <div className={styles.otpScreen}>
        {_.range(0, 6)
          .map((i) => (
            <input
              ref={refs[i]}
              key={i}
              autoFocus={i === 0}
              onChange={(e) => setOtpCh(e, i)}
              type="number"
              minLength={1}
              maxLength={1}
              value={otp[i] || ''}
              onKeyDown={onKeyDown(i)}
              onPaste={onOtpPaste}
              autoComplete="one-time-code"
            />
          ))}
      </div>
      <div className={styles.buttons}>
        <Button size="medium" onClick={onDeleteClick} label="DELETE ACCOUNT" />
      </div>
    </Dialog>
  );
}

Alert.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

Alert.defaultProps = {
};
