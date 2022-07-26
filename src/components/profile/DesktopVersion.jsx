import React from 'react';
import { Drawer } from 'components/shared/Drawer';
import { LightBlueTile } from 'components/cards';
import { Grid } from '@material-ui/core';
import inviteGetIcon from 'assets/images/invite/getDesktop.svg';
import ButtonComponent from 'containers/profile/ButtonComponent';
import { useShopBaseUrl } from 'contexts/userContext';
import { Clickable } from 'phoenix-components';
import { share } from 'utils';
import Snackbar from 'services/snackbar';
import { useShop } from 'contexts/userContext';
import DeviceUtils from '../../utils/deviceUtils';
import styles from './DesktopVersion.module.css';

export function DesktopVersion() {
  const shop = useShop();

  const url = useShopBaseUrl();
  const url1 = 'https://web.mywindo.shop';

  const copyToClipboard = () => {
    DeviceUtils.copy(url1);
    Snackbar.show('Copied !!!');
  };

  const shareToUser = e => {
    e.stopPropagation();
    e.preventDefault();
    share(`Hello
We are now selling online. Please visit my WINDO Shop at
${url} to buy my products.

Thank you
${shop?.name}`);
  };

  return (
    <Drawer title="Desktop Version">
      <div className={styles.container}>
        <div className={styles.topTip}>
        </div>
        <LightBlueTile className={styles.className}>
          <Grid container spacing={2}>
            <Grid item xs={12} className={styles.block}>
              <img src={inviteGetIcon} alt="" className={styles.image} />
            </Grid>
          </Grid>
        </LightBlueTile>
        <div className={styles.head1}>
          Bring WINDO to Your Desktop
        </div>
        <div className={styles.programDetails}>
          <div className={styles.text1}>
            Bigger screen, better experience! With our Desktop feature,
            set up and manage your shop from the comfort of your desktop.
            From adding images and updating inventory to scheduling shipping
            and accepting online payments, get the whole package reimagined,
            this time with an even more immersive experience.
          </div>
        </div>
        <div className={styles.referralBlock}>
          <div className={styles.url}>
            Shop URL
          </div>
          <ButtonComponent
            fullWidth
            style={styles.inviteButton}
            text={url1}
            color="primary"
            onClick={copyToClipboard}
          />
          <div className={styles.footerContainer}>
            <Clickable
              onClick={copyToClipboard}
            >
              <div className={styles.footerText}>Copy URL</div>
            </Clickable>
            <div className={styles.helper}>or</div>
            <Clickable
              onClick={shareToUser}
            >
              <div className={styles.footerText}>Share</div>
            </Clickable>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

DesktopVersion.propTypes = {};

DesktopVersion.defaultProps = {};
