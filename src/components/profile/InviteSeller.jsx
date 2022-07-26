import React from 'react';
import { Drawer } from 'components/shared/Drawer';
import { LightBlueTile } from 'components/cards';
import { Button, Grid } from '@material-ui/core';
import inviteGetIcon from 'assets/images/invite/inviteGet.svg';
import {
  useCustomDomain, useIsOnCustomDomain, useShop, useUser
} from 'contexts/userContext';
import copyIcon from 'assets/images/invite/copyIcon.svg';
import SnackBar from 'services/snackbar';
import ButtonComponent from 'containers/profile/ButtonComponent';
import { share } from 'utils';
import { allowedCountries } from 'constants/shop';
import { shareSellerApp, shareShop } from 'utils/share';
import { useDesktop } from 'contexts';
import { SideDrawer } from 'components/shared/SideDrawer';
import { useHistory } from 'react-router-dom';
import styles from './InviteSeller.module.css';

export function InviteSeller() {
  const user = useUser();
  const shop = useShop();
  const isUS = shop?.country === 'usa';
  const isCountryEnabled = allowedCountries.includes(shop?.country?.toLowerCase());
  const isCustomDomain = useIsOnCustomDomain();
  const domain = useCustomDomain();
  const isDesktop = useDesktop();
  const history = useHistory();

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(user?.referralCode.toString());
    SnackBar.show('Invite Code Copied !!!');
  };
  const shareToSeller = e => {
    e.stopPropagation();
    e.preventDefault();
    const allowedText = isCountryEnabled
      ? `Use referral code :-  ${user.referralCode} to get ${isUS ? 5 : 250} extra credits.` : '';
    share(`Hello

We are now selling on WINDO, an instant online shop creation platform. Please visit our online shop at
${shareShop(shop.slug, isCustomDomain, domain)}

You can also start selling and grow by reaching out to more customers through WINDO in less than 30 seconds.

Download WINDO Seller app using this link ${shareSellerApp()}

${allowedText}

Thank you
${shop.name}`);
  };

  const title = isCountryEnabled ? 'Refer Friends & Earn' : 'Refer Friends';

  if (!isCountryEnabled) {
    return (
      <Drawer title={title}>
        <div className="flexCenter">
          <ButtonComponent
            style={styles.inviteButton}
            text="Send Invite"
            color="primary"
            onclick={shareToSeller}
            fullwidth={true}
            id="invite"
          />
        </div>
      </Drawer>
    );
  }

  if (isDesktop) {
    return (
      <SideDrawer
        backButton={true}
        title="Refer & Earn"
        onClose={() => history.goBack()}
      >
        <div className={styles.desktopContainer}>
          <div className={styles.head}>Know More</div>
          <div className={styles.topTip}>
            {`Invite your friends and earn ${isUS ? 5 : 250} Credits on each friend's first order delivery.
          Use upto ${isUS ? 1 : 50} credits per order against your shipping charges.`}
          </div>
          <LightBlueTile className={styles.className}>
            <Grid container spacing={2}>
              <Grid item xs={12} className={styles.block}>
                <img src={inviteGetIcon} alt="" className={styles.image} />
                <div className={styles.programDetails}>
                  <div className={styles.dot}>&nbsp;</div>
                  <div className={styles.text}>
                    {`You get ${isUS ? 10 : 300} Credits on your Sign-up &
              ${isUS ? 5 : 150} credits on your friend's first order`}
                  </div>
                </div>
                <div className={styles.programDetails}>
                  <div className={styles.dot}>&nbsp;</div>
                  <div className={styles.text}>
                    {`Friends get ${isUS ? 10 : 300} Credits on your Sign-up &
              ${isUS ? 5 : 150} credits on their first order`}
                  </div>
                </div>
              </Grid>
            </Grid>
          </LightBlueTile>
          <div className={styles.head1}>
            How it Works
          </div>
          <div className={styles.programDetails}>
            <div className={styles.dot1}>&nbsp;</div>
            <div className={styles.text1}>
              You can use this cash for logistics credits to ship your
              orders to customers.
            </div>
          </div>
          <div className={styles.programDetails}>
            <div className={styles.dot1}>&nbsp;</div>
            <div className={styles.text1}>
              {`You can redeem upto ${isUS ? 1 : 30} Credits for each order. (For eg: If your logistics amount is
              ${shop.currency} ${isUS ? 5 : 200} to ship your orders to customers,
            You can pay only ${shop.currency} ${isUS ? 4 : 170} from order value)`}
            </div>
          </div>
          <div className={styles.referralBlock}>
            <div className={styles.referralHeading}>
              Referral Code
            </div>
            <LightBlueTile className={styles.referralCode}>
              <div className={styles.code}>
                {user?.referralCode}
              </div>
              <Button
                className={styles.copyButton}
                onClick={copyToClipboard}>
                <img src={copyIcon} alt="" />
              </Button>
            </LightBlueTile>
            <ButtonComponent
              style={styles.inviteButton}
              text="Send Invite"
              color="primary"
              onclick={shareToSeller}
              fullwidth={true}
              id="invite"
            />
          </div>
        </div>
      </SideDrawer>
    );
  }

  return (
    <Drawer title={title}>
      <div className={styles.container}>
        <div className={styles.head}>Know More</div>
        <div className={styles.topTip}>
          {`Invite your friends and earn ${isUS ? 5 : 250} Credits on each friend's first order delivery.
          Use upto ${isUS ? 1 : 50} credits per order against your shipping charges.`}
        </div>
        <LightBlueTile className={styles.className}>
          <Grid container spacing={2}>
            <Grid item xs={12} className={styles.block}>
              <img src={inviteGetIcon} alt="" className={styles.image} />
              <div className={styles.programDetails}>
                <div className={styles.dot}>&nbsp;</div>
                <div className={styles.text}>
                  {`You get ${isUS ? 10 : 300} Credits on your Sign-up &
              ${isUS ? 5 : 150} credits on your friend's first order`}
                </div>
              </div>
              <div className={styles.programDetails}>
                <div className={styles.dot}>&nbsp;</div>
                <div className={styles.text}>
                  {`Friends get ${isUS ? 10 : 300} Credits on your Sign-up &
              ${isUS ? 5 : 150} credits on their first order`}
                </div>
              </div>
            </Grid>
          </Grid>
        </LightBlueTile>
        <div className={styles.head1}>
          How it Works
        </div>
        <div className={styles.programDetails}>
          <div className={styles.dot1}>&nbsp;</div>
          <div className={styles.text1}>
            You can use this cash for logistics credits to ship your
            orders to customers.
          </div>
        </div>
        <div className={styles.programDetails}>
          <div className={styles.dot1}>&nbsp;</div>
          <div className={styles.text1}>
            {`You can redeem upto ${isUS ? 1 : 30} Credits for each order. (For eg: If your logistics amount is
              ${shop.currency} ${isUS ? 5 : 200} to ship your orders to customers,
            You can pay only ${shop.currency} ${isUS ? 4 : 170} from order value)`}
          </div>
        </div>
        <div className={styles.referralBlock}>
          <div className={styles.referralHeading}>
            Referral Code
          </div>
          <LightBlueTile className={styles.referralCode}>
            <div className={styles.code}>
              {user?.referralCode}
            </div>
            <Button
              className={styles.copyButton}
              onClick={copyToClipboard}>
              <img src={copyIcon} alt="" />
            </Button>
          </LightBlueTile>
          <ButtonComponent
            style={styles.inviteButton}
            text="Send Invite"
            color="primary"
            onclick={shareToSeller}
            fullwidth={true}
            id="invite"
          />
        </div>
      </div>
    </Drawer>
  );
}

InviteSeller.propTypes = {};

InviteSeller.defaultProps = {};
