import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent } from '@material-ui/core';
import { Clickable } from 'phoenix-components';
import closeIcon from 'assets/images/orders/list/close.svg';
import { useDesktop, useShop } from 'contexts';
import styles from './TaxPopOver.module.css';

export function TaxPopOver({
  value,
  onClose
}) {
  const isDesktop = useDesktop();
  const { currency } = useShop();
  return (
    <Dialog
      open={true}
      maxWidth={isDesktop ? 'xs' : 'md'}
      fullWidth
      onClose={onClose}
    >
      <DialogContent>
        <div className="flexBetween">
          <div className={styles.heading}>
          </div>
          <Clickable
            onClick={onClose}>
            <img src={closeIcon} alt="" />
          </Clickable>
        </div>
        <div>
          <div className={styles.subHeadingContainer}>
            <div>Tax name</div>
            <div>Value</div>
          </div>
          {Object.keys(value).map((x, i) => (
            <div className={styles.item} key={i}>
              <div className={styles.key}>{x}</div>
              <div className={styles.value}>
                {currency}
                {' '}
                {value[x]}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

TaxPopOver.propTypes = {
  value: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};
