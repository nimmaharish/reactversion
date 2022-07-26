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
  icon, onClick, text, btnText, textClass
}) {
  const isDesktop = useDesktop();

  return (
    <Dialog
      open={true}
      onClose={onClick}
      fullWidth
      maxWidth={isDesktop ? 'xs' : 'sm'}
    >
      <DialogContent>
        {isDesktop && (
          <div className="flexEnd">
            <Clickable
              onClick={onClick}>
              <img src={closeIcon} alt="" />
            </Clickable>
          </div>
        )}
        {icon && (
          <div className="textCenter fullWidth marginSTopBottom">
            <img className={styles.deliveryTag} src={icon} alt="" />
          </div>
        )}
        <div className={cx(styles.deliveryTagTitle, textClass)}>
          {text}
        </div>
      </DialogContent>
      <div className={cx('flexCenter', styles.btn)}>
        <Button
          onClick={onClick}
          label={btnText}
          size="large"
        />
      </div>
    </Dialog>
  );
}

Alert.propTypes = {
  icon: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  btnText: PropTypes.string.isRequired,
  textClass: PropTypes.string
};

Alert.defaultProps = {
  textClass: '',
  icon: null,
};

export default Alert;
