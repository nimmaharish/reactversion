/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogContent
} from '@material-ui/core';
import cx from 'classnames';
import { useDesktop } from 'contexts';
import { Button, Clickable } from 'phoenix-components';
import closeIcon from 'assets/images/orders/list/close.svg';
import styles from './Alert.module.css';

function Alert({
  onClick, text, subText, clickText, cancelText, onCancel
}) {
  const isDesktop = useDesktop();

  return (
    <Dialog
      open={true}
      onClose={onCancel}
      fullWidth
      maxWidth={isDesktop ? 'xs' : 'sm'}
    >
      <DialogContent className={cx(styles.container)}>
        {isDesktop && (
          <div className="flexEnd">
            <Clickable
              onClick={onClick}>
              <img src={closeIcon} alt="" />
            </Clickable>
          </div>
        )}
        <div className={cx(styles.title)}>
          {text}
        </div>
        <div className={cx(styles.subTitle)}>
          {subText}
        </div>
      </DialogContent>
      <div className={cx('flexCenter', styles.btn)}>
        <Button
          onClick={onCancel}
          label={cancelText}
          primary={false}
          size="medium"
        />
        <Button
          onClick={onClick}
          label={clickText}
          className={styles.click}
          primary={true}
          size="medium"
        />
      </div>
    </Dialog>
  );
}

Alert.propTypes = {
  onClick: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  subText: PropTypes.string.isRequired,
  clickText: PropTypes.string.isRequired,
  cancelText: PropTypes.string.isRequired,
};

Alert.defaultProps = {
};

export default Alert;
