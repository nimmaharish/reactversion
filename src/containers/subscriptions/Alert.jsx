import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogContent
} from '@material-ui/core';
import cx from 'classnames';
import { Button } from 'phoenix-components';
import styles from './Alert.module.css';

function Alert({
  onClose,
  title,
  subTitle,
  buttonTitle,
}) {
  return (
    <Dialog open={true} onClose={onClose} fullWidth>
      <DialogContent>
        <div className={cx(styles.title)}>
          {title}
        </div>
        <div className={cx(styles.subTitle)}>
          {subTitle}
        </div>
        <div className={cx('flexCenter', styles.btn)}>
          <Button
            onClick={onClose}
            label={buttonTitle}
            size="large"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

Alert.propTypes = {
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  buttonTitle: PropTypes.string.isRequired,
};

export default Alert;
