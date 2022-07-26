import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { LightBlueTile } from 'components/cards';
import walletIcon from 'assets/images/wallet/wallet.svg';
import { WalletLog } from 'containers/wallet/WalletLog';
import desktopWalletIcon from 'assets/images/wallet/desktopWallet.svg';
import { useShop } from 'contexts';
import { useDesktop } from 'contexts';
import styles from './WalletBalance.module.css';
import { AddMoney } from './AddMoney';

export function WalletBalance({ wallet }) {
  const ref = useRef();
  const shop = useShop();
  const isDesktop = useDesktop();

  return (
    <>
      <LightBlueTile className={styles.balanceBlock}>
        <div className={isDesktop ? styles.box : null}>
          <img src={isDesktop ? desktopWalletIcon : walletIcon} alt="" />
          <div className={styles.balance}>
            <div className={styles.balanceNumber}>
              {shop.currency}
              {' '}
              {wallet?.balance?.balance?.toFixed(2)}
            </div>
            <div className={styles.balanceHeading}>Available Balance</div>
          </div>
        </div>
      </LightBlueTile>
      <AddMoney />
      <div ref={ref} />
      <WalletLog top={ref} type="balance" />
    </>
  );
}

WalletBalance.propTypes = {
  wallet: PropTypes.object,
};

WalletBalance.defaultProps = {
  wallet: null,
};
