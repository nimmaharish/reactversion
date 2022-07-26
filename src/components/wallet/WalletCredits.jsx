import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { LightBlueTile } from 'components/cards';
import referIcon from 'assets/images/invite/youGet.svg';
import { Button } from 'phoenix-components';
import totalIcon from 'assets/images/wallet/total.svg';
import availIcon from 'assets/images/wallet/available.svg';
import { WalletLog } from 'containers/wallet/WalletLog';
import { share } from 'utils';
import { Stats } from 'components/payments/Stats';
import { shareSellerApp, shareShop } from 'utils/share';
import totalDesktopIcon from 'assets/images/wallet/totalDesktop.svg';
import availDesktopIcon from 'assets/images/wallet/availDesktop.svg';

import { useQueryParams } from 'hooks';
import cx from 'classnames';
import { useHistory } from 'react-router-dom';
import {
  useCustomDomain, useIsOnCustomDomain, useShop, useUser
} from 'contexts';
import { useDesktop } from 'contexts';
import styles from './WalletCredits.module.css';

export function WalletCredits({ wallet }) {
  const params = useQueryParams();
  const ref = useRef();
  const history = useHistory();
  const shop = useShop();
  const user = useUser();
  const isCustomDomain = useIsOnCustomDomain();
  const domain = useCustomDomain();
  const isUS = shop?.country === 'usa';
  const isDesktop = useDesktop();

  const shareToSeller = e => {
    e.stopPropagation();
    e.preventDefault();
    share(`Hello

We are now selling on WINDO, an instant online shop creation platform. Please visit our online shop at
${shareShop(shop.slug, isCustomDomain, domain)}

You can also start selling and grow by reaching out to more customers through WINDO in less than 30 seconds.

Download WINDO Seller app using this link ${shareSellerApp()}

Use referral code :-  ${user.referralCode} to get ${isUS ? 5 : 150} extra credits.

Thank you
${shop.name}`);
  };

  return (
    <>
      <div className={isDesktop ? styles.desktop : null}>
        <Stats
          icon1={isDesktop ? totalDesktopIcon : totalIcon}
          icon2={isDesktop ? availDesktopIcon : availIcon}
          text1={wallet?.credits?.total?.toFixed(0)}
          text2={wallet?.credits?.balance?.toFixed(0)}
          subText1="Total Credits"
          subText2="Total Available"
        />
      </div>
      <LightBlueTile className={styles.container1}>
        <div className={styles.left}>
          <img width="50px" height="50px" src={referIcon} alt="" />
          <div className={styles.info}>
            {`Invite your friends and earn ${isUS ? 5 : 150} Credits on each friend's first order delivery.
          Use upto ${isUS ? 1 : 30} credits per order against your shipping charges.`}
          </div>
        </div>
        <div className={cx(styles.variantActions, 'fullWidth flexCenter')}>
          <Button
            // className={cx(styles.border1, styles.btnL50)}
            primary={false}
            type="large"
            onClick={() => {
              params.set('showModal', 'true');
              history.push({ search: params.toString() });
            }}
            label={`1 Credit = 1 ${shop?.currency?.toUpperCase()}`}
          >
          </Button>
          <Button
            type="large"
            className={cx(styles.customBtn)}
            onClick={shareToSeller}
            label="Invite Now"
          />
        </div>
      </LightBlueTile>
      <div ref={ref} />
      <WalletLog top={ref} type="credits" />
    </>
  );
}

WalletCredits.propTypes = {
  wallet: PropTypes.object,
};

WalletCredits.defaultProps = {
  wallet: null,
};
