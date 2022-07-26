import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent } from '@material-ui/core';
import check from 'assets/v2/common/checkPrimary.svg';
import uncheck from 'assets/v2/common/unCheckPrimary.svg';
import { Button, Clickable, } from 'phoenix-components';
import { useDesktop } from 'contexts';
import closeIcon from 'assets/images/orders/list/close.svg';
import styles from './CodPopUp.module.css';

export function CodPopUp({
  onClose,
  onAccept,
  content,
}) {
  const [codTerms, setCodTerms] = useState(false);
  const [error, setError] = useState(false);
  const isDesktop = useDesktop();

  const onClick = () => {
    if (!codTerms) {
      setError(true);
      return;
    }
    setError(false);
    onAccept();
  };

  return (
    <Dialog
      open={true}
      maxWidth={isDesktop ? 'xs' : 'md'}
      fullWidth
      onClose={onClose}
    >
      <DialogContent>
        {isDesktop && (
          <div className="flexEnd">
            <Clickable
              onClick={onClose}>
              <img src={closeIcon} alt="" />
            </Clickable>
          </div>
        )}
        <p className={styles.para}>
          {content || `If you're accepting cash for your order, 
            remember to collect the payment directly from the customer and make your 
            order status Mark as Paid. `}
        </p>
        <Clickable
          className={styles.terms}
          onClick={() => {
            setCodTerms(!codTerms);
            setError(codTerms);
          }}>
          <img src={codTerms ? check : uncheck} alt="" />
          I accept the terms
        </Clickable>
        {error && (
          <div className={styles.error}>
            Please tick the checkbox to continue
          </div>
        )}
        <div className={styles.button}>
          <Button
            label="Ok"
            onClick={onClick}
          />
        </div>
      </DialogContent>
    </Dialog>

  );
}

CodPopUp.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  content: PropTypes.string,
};

CodPopUp.defaultProps = {
  content: null,
};
