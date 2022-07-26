import React from 'react';
import {
  usePaymentRules
} from 'contexts/userContext';
import {
  useShop
} from 'contexts/userContext';
import cx from 'classnames';
import { get } from 'lodash';
import checkIcon from 'assets/images/payments/check.svg';
import Accordion from './Accordion';
import styles from './ActiveModes.module.css';

export function ActiveModes() {
  const paymentRules = usePaymentRules(true);
  const onlineModes = paymentRules.filter(x => x.type === 'online');
  const customPaymentModes = paymentRules.filter(x => x.type === 'customPayment');
  const codModes = paymentRules.filter(x => x.type === 'cod');
  const shop = useShop();

  const getFeeTypeText = (data) => {
    const { feeType } = data;
    if (feeType === 'additional') {
      return 'Additional Fee';
    }
    return 'Discount';
  };

  const isPercentage = (data) => get(data, 'advanced.type', '') === 'percentage';

  const getText = (data) => {
    if (isPercentage(data)) {
      return `${data.advanced.value ? `${data.advanced.value} %` : 'Not Set'}`;
    }
    return `${data.advanced.value ? `${shop?.currency} ${data.advanced.value}` : 'Not Set'}`;
  };

  const getAccordionBody = (x) => (
    <>
      <div className={styles.codOptions}>
        <div className={styles.lWidth50}>
          <div className={styles.codHeading}>Min order value</div>
          <div className={styles.codPrice}>
            {`${x.cartValue.min ? `${shop?.currency} ${x.cartValue.min}` : 'Not Set'}`}
          </div>
        </div>
        <div className={styles.lineVertical}></div>
        <div className={styles.rWidth50}>
          <div className={styles.codHeading}>Max order value</div>
          <div className={styles.codPrice}>
            {`${x.cartValue.max ? `${shop?.currency} ${x.cartValue.max}` : 'Not Set'}`}
          </div>
        </div>
      </div>
      { x.enabled && (
        <div className={styles.configOptions}>
          <div className="flexStart">
            <div className={styles.feeType}>
              {getFeeTypeText(x.advanced)}
            </div>
            <img className={styles.check} src={checkIcon} alt="rules" />
          </div>
          <div className={styles.type}>{x.advanced.type}</div>
          <div className={cx(styles.codOptions, styles.noBorder)}>
            <div className={styles.lWidth50}>
              <div className={styles.codHeading}>
                {isPercentage(x) ? 'Percentage Value' : 'Amount'}
              </div>
              <div className={styles.codPrice}>
                {getText(x)}
              </div>
            </div>
            {isPercentage(x) && (
              <>
                <div className={styles.lineVertical}></div>
                <div className={styles.rWidth50}>
                  <div className={styles.codHeading}>Maximum amount </div>
                  <div className={styles.codPrice}>
                    {`${x.advanced.maxValue ? `${shop?.currency} ${x.advanced.maxValue}` : 'Not Set'}`}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className={styles.container}>
      {onlineModes.length > 0 && (
        <div className={styles.card}>
          <div className={styles.head}>
            Online Payments
          </div>
          {onlineModes.map(x => (
            <Accordion name={x.value} label={x.name} isActive={x.paymentEnabled}>
              {getAccordionBody(x)}
            </Accordion>
          ))}
        </div>
      )}
      {customPaymentModes.length > 0 && (
        <div className={styles.card}>
          <div className={styles.head}>
            Custom Payments
          </div>
          {customPaymentModes.map(x => (
            <Accordion name={x.value} label={x.name} isActive={x.paymentEnabled}>
              <div className={styles.smallHead}>
                Payment Details:
              </div>
              <div
                className={styles.details2}
                dangerouslySetInnerHTML={{ __html: x?.details }}
              >
              </div>
              {getAccordionBody(x)}
            </Accordion>
          ))}
        </div>
      )}
      {codModes.length > 0 && (
        <div className={styles.card}>
          <div className={styles.head}>
            Cash
          </div>
          {codModes.map(x => (
            <Accordion name={x.value} label={x.name} isActive={x.paymentEnabled}>
              {getAccordionBody(x)}
            </Accordion>
          ))}
        </div>
      )}
    </div>
  );
}

ActiveModes.propTypes = {
};

ActiveModes.defaultProps = {};
