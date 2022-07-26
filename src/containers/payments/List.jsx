import React from 'react';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import { StatusSelectionBar } from 'components/shared/StatusSelectionBar';
import Header from 'components/orders/header/Header';
import { Button } from 'phoenix-components';
// import { useShop } from 'contexts';
import { useDesktop, useIsPaymentsEnabled } from 'contexts';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import Payments from './Payments';
import Overview from './Overview';
import styles from './List.module.css';

function ProductsList() {
  const history = useHistory();
  const params = useQueryParams();
  const isActive = useIsPaymentsEnabled();
  const type = params.has('tab') ? params.get('tab') : isActive ? 'payments' : 'overview';
  const isPaymentsTab = type === 'payments';
  const isDesktop = useDesktop();

  const stateList = [
    {
      label: 'Overview',
      value: 'overview',
    },
    {
      label: 'Payments',
      value: 'payments',
    }
  ];

  const onStateChange = (val) => {
    params.set('tab', val);
    params.delete('ps');
    params.delete('pm');
    params.delete('dateFilter');
    history.push({ pathname: '/payments', search: params.toString() });
  };

  return (
    <div className={styles.container}>
      {isDesktop
        ? (
          <div className={styles.desktopContainer}>
            <div onClick={() => history.push('/')} className={styles.maintitle}>
              <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
              <div>&nbsp;</div>
              <div>&nbsp;</div>
              Overview
            </div>
            {type === 'payments' && <Payments />}
            {type === 'overview' && <Overview />}
            {isActive && !isPaymentsTab && (
              <div className={styles.bottom}>
                <Button
                  primary={false}
                  size={isDesktop ? 'large' : 'medium'}
                  label="Checkout Settings"
                  className={styles.checkoutBtn}
                  onClick={() => {
                    history.push('/manage/checkout?page=rules');
                  }}
                />
                <Button
                  size={isDesktop ? 'large' : 'medium'}
                  primary={true}
                  onClick={() => {
                    history.push('/manage/paymentModes');
                  }}
                  label="PAYMENT SETTINGS"
                  className={styles.paymentsBtn}
                />
              </div>
            )}
          </div>
        ) : (
          <>
            <Header
              showFaq={true}
              showLogo={false}
              onBack={() => {
                history.push('/');
              }}
              title="Payments"
            />
            <StatusSelectionBar
              className={styles.tab}
              tabClassName={styles.tabClassName}
              activeClass={styles.tabActive}
              items={stateList}
              onChange={onStateChange}
              active={type}
              seperator={true}
            />
            <div className={styles.mobileContainer}>
              {type === 'payments' && <Payments />}
              {type === 'overview' && <Overview />}
            </div>
            {isActive && !isPaymentsTab && (
              <div className={styles.bottom}>
                <Button
                  primary={false}
                  size="medium"
                  label="Checkout Settings"
                  className={styles.checkoutBtn}
                  onClick={() => {
                    history.push('/manage/checkout?page=rules');
                  }}
                />
                <Button
                  size="medium"
                  primary={true}
                  onClick={() => {
                    history.push('/manage/paymentModes');
                  }}
                  label="PAYMENT SETTINGS"
                  className={styles.paymentsBtn}
                />
              </div>
            )}
          </>
        )}

    </div>
  );
}

export default ProductsList;
