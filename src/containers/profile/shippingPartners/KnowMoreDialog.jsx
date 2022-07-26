import React from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'components/shared/Drawer';
import { Button, Clickable } from 'phoenix-components';
import { useDesktop } from 'contexts';
import { SideDrawer } from 'components/shared/SideDrawer';
import WebView from 'services/webview';
import copyIcon from 'assets/images/invite/copyIcon.svg';
import SnackBar from 'services/snackbar';
import { Button as Btn } from '@material-ui/core';
import { LightBlueTile } from 'components/cards';
import styles from './KnowMoreDialog.module.css';

export function KnowMoreDialog({
  title, list, onAction, description, onBack, heading, url
}) {
  const isDesktop = useDesktop();

  const isShipRocket = title?.toLowerCase() === 'ship rocket';

  const openUrl = (e) => {
    e.stopPropagation();
    if (WebView.isWebView()) {
      e.preventDefault();
      WebView.openUrl(url);
      return;
    }
    window.open(url);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText('WINDO1000');
    SnackBar.show('Coupon Code Copied !!!');
  };

  const body = () => (
    <div className={styles.drawer}>
      <div className={styles.heading}>{heading}</div>
      <div>{description}</div>
      <ul className={styles.list}>
        {list.map((x) => <li className={styles.item}>{`${x}`}</li>)}
      </ul>
      {isShipRocket && (
        <div className={styles.referralBlock}>
          <div className={styles.referralHeading}>
            Get upto INR 1000 Cashback using windo coupon code
          </div>
          <LightBlueTile className={styles.referralCode}>
            <div className={styles.code}>
              WINDO1000
            </div>
            <Btn
              className={styles.copyButton}
              onClick={copyToClipboard}>
              <img src={copyIcon} alt="" />
            </Btn>
          </LightBlueTile>
        </div>
      )}
      <>
        <div className={styles.textB}>
          Don’t have an account?
          <Clickable
            onClick={openUrl}
            className={styles.greenLink}>
            Create
          </Clickable>
        </div>
        {isDesktop ? (
          <div className={styles.buttonD}>
            <Button
              onClick={onAction}
              className={styles.buttonH}
              type="large"
              label="Connect"
            />
          </div>
        ) : (
          <div className={styles.buttonF}>
            <Button
              fullWidth
              bordered={false}
              className={styles.buttonH}
              onClick={onAction}
              type="large"
              label="Connect"
            />
          </div>
        )}
      </>
    </div>
  );

  return !isDesktop ? (
    <Drawer title={title} onBack={onBack}>
      {body()}
    </Drawer>
  ) : (
    <SideDrawer
      backButton={true}
      onClose={onBack}
      title={title}
    >
      {body()}
    </SideDrawer>
  );
}

KnowMoreDialog.propTypes = {
  title: PropTypes.string.isRequired,
  heading: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  onAction: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

KnowMoreDialog.defaultProps = {};
