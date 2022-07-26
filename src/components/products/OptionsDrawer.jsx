import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button as Btn
} from 'phoenix-components';
import { useDesktop } from 'contexts';
import { BlackRadio } from 'components/coupons/BlackRadio';
import { BottomDrawer } from 'components/shared/BottomDrawer';
import { SideDrawer } from 'components/shared/SideDrawer';

import styles from './OptionsDrawer.module.css';

export function OptionsDrawer({
  onClose,
  onApply
}) {
  const isDesktop = useDesktop();
  const [state, setState] = useState('unlive');

  const onClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onApply(state);
  };

  const body = () => (
    <div className={styles.main}>
      <div className={styles.container} onClick={() => setState('unlive')}>
        <div className={styles.text}>
          <div className={styles.title}>
            Hide
          </div>
          <div className={styles.subTitle}>
            Hide the product from shop
          </div>
        </div>
        <BlackRadio checked={state === 'unlive'} />
      </div>
      <div className={styles.container} onClick={() => setState('out of stock')}>
        <div className={styles.text}>
          <div className={styles.title}>
            Out of stock
          </div>
          <div className={styles.subTitle}>
            product will be shown in shop as out of stock
          </div>
        </div>
        <BlackRadio checked={state === 'out of stock'} />
      </div>
      <div className={styles.container} onClick={() => setState('deleted')}>
        <div className={styles.text}>
          <div className={styles.title}>
            Delete
          </div>
          <div className={styles.subTitle}>
            This will delete the product
          </div>
        </div>
        <BlackRadio checked={state === 'deleted'} />
      </div>
      {!isDesktop && (
        <div className={styles.submitButton}>
          <Btn
            size="large"
            label="Save"
            onClick={onClick}
            fullWidth
            bordered={false}
          />
        </div>
      )}
    </div>
  );

  return (
    <>
      {!isDesktop && (
        <BottomDrawer
          title="Select"
          onClose={onClose}
          classes={{
            heading: styles.heading,
          }}
          closeButton
        >
          {body()}
        </BottomDrawer>
      )}
      {isDesktop && (
        <SideDrawer
          backButton={true}
          title="Select"
          onClose={onClose}
          button={true}
          btnLabel="Save"
          buttonSize="large"
          onClick={onClick}
        >
          {body()}
        </SideDrawer>
      )}
    </>
  );
}

OptionsDrawer.propTypes = {
  onClose: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired
};

OptionsDrawer.defaultProps = {};
