/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogContent
} from '@material-ui/core';
import cx from 'classnames';
import Info from 'components/info/Info';
import { Button } from 'phoenix-components';
import styles from './Alert.module.css';

function Alert({
  amount,
  onClick
}) {
  return (
    <Dialog
      open={true}
      onClose={onClick}
      PaperProps={{
        classes: {
          root: styles.paper,
        }
      }}
    >
      <DialogContent className={styles.noPad}>
        <div className={styles.amount}>
          <div>{amount}</div>
          <div className={styles.amountLabel}>Approximate Charges</div>
        </div>
        <Info
          title="Pro Tip"
          text={'Above charges are an approximation only, actual charges will vary '
                + ' based on the actual shipment box and weight.'
                + '\n Your delivery charges are calculated based on maximum of volumetric weight(length X '
                + 'width X height / 5) and the actual weight.So optimize your shipping box accordingly!'}
        />
      </DialogContent>
      <div className={cx('flexCenter', styles.btn)}>
        <Button
          onClick={onClick}
          label="Ok"
          size="large"
        />
      </div>
    </Dialog>
  );
}

Alert.propTypes = {
  onClick: PropTypes.func.isRequired,
  amount: PropTypes.number.isRequired,
};

export default Alert;
