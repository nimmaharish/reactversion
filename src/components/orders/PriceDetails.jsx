import React, { useState } from 'react';
import {
  useConfirmedAmount,
  useNonConfirmedAmount,
  useOrder,
  usePendingPricing,
} from 'contexts/orderContext';
import { useShop } from 'contexts/userContext';
import cx from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import infoIcon from 'assets/images/orders/list/info.svg';
import { LightBlueTile } from 'components/cards';
import { useDesktop } from 'contexts';
import _ from 'lodash';
import InfoIcon from 'assets/v2/subscriptions/info.svg';
import { Clickable } from 'phoenix-components';
import { TaxPopOver } from 'components/orders/v2/TaxPopOver';
import styles from './PriceDetails.module.css';

export function PriceDetails() {
  const {
    pricing,
    total,
    taxes
  } = usePendingPricing();
  const adds = pricing.filter(x => x.split === 1);
  const subs = pricing.filter(x => x.split === 2);
  const [tooltipIsOpen, setTooltipIsOpen] = useState(false);
  const [openTax, toggleTax] = useState(false);
  const shop = useShop();
  const confirmedAmount = useConfirmedAmount();
  const due = useNonConfirmedAmount();
  const order = useOrder();
  const codAmount = _.sumBy((order.paymentList || []).filter(x => x.mode === 'cod'), 'amount');

  const isDesktop = useDesktop();
  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255)',
      color: 'rgba(33, 33, 33, 0.6)',
      boxShadow: theme.shadows[1],
      fontSize: 10,
      marginTop: 2
    },
  }))(Tooltip);

  return (
    <>
      <div className={styles.container}>
        {openTax && (
          <TaxPopOver value={taxes} onClose={() => toggleTax(false)} />
        )}
        <div className={isDesktop ? styles.desktopBox : null}>
          <div className={styles.title}>Payment Details</div>
          <LightBlueTile className={styles.breakup}>
            {adds.map(p => (
              <div key={p.name} className={styles.row}>
                <div className={styles.black50}>
                  <span>
                    {p.name}
                    {' '}
                  </span>
                  {p.name.toLowerCase() === 'tax' && Object.keys(taxes).length > 0 && (
                    <Clickable onClick={() => toggleTax(true)}>
                      <img src={InfoIcon} alt="" />
                    </Clickable>
                  )}
                </div>
                <div>
                  <span className={styles.rupee}>
                    {shop.currency}
                    &nbsp;
                  </span>
                  {p.value.toFixed(2)}
                </div>
              </div>
            ))}
            <div className={cx(styles.borderTop1)}>
              {subs.map(p => (
                <div key={p.name} className={styles.row}>
                  <div className={styles.black50}>{p.name}</div>
                  <div>
                    <span className={styles.rupee1}>
                      {`- ${shop.currency} ${p.value.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className={cx(styles.row, styles.borderTop)}>
              <div className={cx(styles.total, 'bold')}>
                Total Amount Payable
              </div>
              <div>
                <span className={cx(styles.rupee, 'bold')}>
                  {`${shop.currency} ${total.toFixed(2)}`}
                </span>
              </div>
            </div>
            <div className={cx(styles.row, styles.borderTop)}>
              <div className={cx(styles.total, 'bold')}>
                Total Amount Paid
                <LightTooltip
                  title="Does not include Direct Cash Payment"
                  placement="top"
                  open={tooltipIsOpen}
                  onClose={() => setTooltipIsOpen(null)}
                  leaveDelay={200}
                  arrow
                >
                  <span
                    className={styles.marginTop}
                    onClick={() => {
                      if (tooltipIsOpen) { setTooltipIsOpen(null); } else { setTooltipIsOpen(true); }
                    }}>
                    <img className={styles.infoIcon} src={infoIcon} alt="" />
                  </span>
                </LightTooltip>
              </div>
              <div>
                <span className={cx(styles.rupee, 'bold')}>
                  {`${shop.currency} ${(order.paid - codAmount + (order?.coupon?.amount || 0)).toFixed(2)}`}
                </span>
              </div>
            </div>
            <div className={cx(styles.row, styles.borderTop2)}>
              <div className={cx(styles.rupee, 'bold')}>
                Confirmed Amount
              </div>
              <div>
                <span className={cx(styles.rupee, 'bold')}>
                  {`${shop.currency} ${confirmedAmount.toFixed(2)}`}
                </span>
              </div>
            </div>
            <div className={cx(styles.row, styles.borderTop2)}>
              <div className={cx(styles.rupee1, 'bold')}>
                Payment Due
              </div>
              <div>
                <span className={cx(styles.rupee1, 'bold')}>
                  {`${shop.currency} ${due.toFixed(2)}`}
                </span>
              </div>
            </div>
            {order?.refunded > 0 && (
              <div className={cx(styles.row, styles.borderTop1, styles.padding)}>
                <div className={cx(styles.total, 'bold')}>
                  Refunded Amount
                </div>
                <div>
                  <span className={cx(styles.rupee, 'bold')}>
                    {`${shop.currency} ${order?.refunded.toFixed(2)}`}
                  </span>
                </div>
              </div>
            )}
          </LightBlueTile>
        </div>
      </div>
    </>
  );
}
