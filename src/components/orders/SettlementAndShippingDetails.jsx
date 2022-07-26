import React from 'react';
import { LightBlueTile } from 'components/cards';
import PropTypes from 'prop-types';
import { useSettlement, isOrderCustomerPickUp } from 'contexts/orderContext';
import { useShop } from 'contexts/userContext';
import cx from 'classnames';
import { useDesktop } from 'contexts';
import styles from './SettlementAndShippingDetails.module.css';

export function SettlementAndShippingDetails({ showShipping = false, order = {} }) {
  const { settlement } = useSettlement();
  const isCustomerPickUp = isOrderCustomerPickUp();
  const adds = settlement.filter(x => x.split === 1);
  const subs = settlement.filter(x => x.split === 2);
  const adds11 = settlement.filter(x => x.split === 3);

  const { shippingCharges = {} } = order;
  const { amount = 0, pendingAmount = 0, wallet = {} } = shippingCharges;
  const { cash = 0, credits = 0 } = wallet;
  const isDesktop = useDesktop();

  const shipping = [
    { name: 'Actual Shipping Charges', value: amount.toFixed(2), split: 1 },
    { name: 'Windo Cash Debit', value: cash.toFixed(2), split: 2 },
    { name: 'Windo Credits Redeemed', value: credits.toFixed(2), split: 2 },
    { name: 'Pending Shipping Charges', value: pendingAmount.toFixed(2), split: 3 }
  ];

  const adds2 = shipping.filter(x => x.split === 1);
  const subs2 = shipping.filter(x => x.split === 2);
  const adds22 = shipping.filter(x => x.split === 3);

  const shop = useShop();

  if (isCustomerPickUp) {
    return null;
  }

  return (
    <div className={cx(styles.container, { [styles.noPad]: showShipping })}>
      <div className={isDesktop ? styles.desktopBox : null}>
        {!isCustomerPickUp && (
          <div className={styles.title}>
            {!showShipping ? 'Payment Settlement' : 'Shipping Charges'}
          </div>
        )}
        {showShipping && (
          <LightBlueTile className={styles.breakup}>
            {adds2.map(p => (
              <div key={p.name} className={styles.row}>
                <div className={styles.black50}>{p.name}</div>
                <div>
                  <span className={styles.rupee}>
                    {shop.currency}
              &nbsp;
                  </span>
                  {p.value}
                </div>
              </div>
            ))}
            <div className={cx(styles.borderTop1)}>
              {subs2.map(p => (
                <div key={p.name} className={styles.row}>
                  <div className={styles.black50}>{p.name}</div>
                  <div>
                    <span className={styles.rupee1}>
                      {`- ${shop.currency} ${p.value}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.borderBottom}>
              {adds22.map(p => (
                <div key={p.name} className={cx(styles.row, 'bold')}>
                  <div>{p.name}</div>
                  <div>
                    <span className={cx(styles.rupee, 'bold')}>
                      {`${shop.currency} ${p.value}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </LightBlueTile>
        )}
        {!showShipping && !isCustomerPickUp && (
          <LightBlueTile className={styles.breakup}>
            {adds.map(p => (
              <div key={p.name} className={styles.row}>
                <div className={cx(styles.name, styles.black50)}>{p.name}</div>
                <div className={styles.value}>
                  <span className={styles.rupee}>
                    {shop.currency}
              &nbsp;
                  </span>
                  {p.value}
                </div>
              </div>
            ))}
            <div className={cx(styles.borderTop1)}>
              {subs.map(p => (
                <div key={p.name} className={styles.row}>
                  <div className={cx(styles.name, styles.black50)}>{p.name}</div>
                  <div className={styles.value}>
                    <span className={styles.rupee1}>
                      {`- ${shop.currency} ${p.value}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.borderBottom}>
              {adds11.map(p => (
                <div key={p.name} className={cx(styles.row, 'bold')}>
                  <div className={styles.value}>{p.name}</div>
                  <div className={styles.value}>
                    <span className={cx(styles.rupee)}>
                      {`${shop.currency} ${p.value}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </LightBlueTile>
        )}
      </div>
    </div>
  );
}

SettlementAndShippingDetails.propTypes = {
  showShipping: PropTypes.bool,
  order: PropTypes.any,
};

SettlementAndShippingDetails.defaultProps = {
  showShipping: false,
  order: {}
};
