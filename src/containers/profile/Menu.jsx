import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Drawer
} from '@material-ui/core';
import { useHistory, } from 'react-router-dom';
import closeIcon from 'assets/images/orders/list/close.svg';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import { Button as Btn, Clickable } from 'phoenix-components';
import Loader from 'services/loader';
// Todo remove if not used anyware
// import logo from 'assets/images/windo.png';
import { useUser } from 'contexts/userContext';
import contactIcon from 'assets/images/menu/contact.svg';
import logoutIcon from 'assets/images/menu/out.svg';
import deleteIcon from 'assets/images/address/delete.svg';
import rateIcon from 'assets/images/menu/rate.png';
import privacyIcon from 'assets/images/menu/privacy.svg';
import termsIcon from 'assets/images/menu/terms.svg';
import aboutIcon from 'assets/images/menu/about.svg';
import windo from 'assets/images/menu/windo.svg';
import { GoogleLogout } from 'react-google-login';
import Storage from 'services/storage';
import WebView from 'services/webview';
import WebViewUtils from 'services/webviewUtils';
import CONFIG from 'config';
import { useDesktop } from 'contexts';
import { useToggle } from 'hooks/common';
import Info from 'components/info/Info';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import { Alert } from 'containers/profile/otpBox/Alert';
import { updateWebApp } from 'utils/app';
import { User as UserApi } from 'api';
import SnackBar from 'services/snackbar';
import { RatingService } from 'services/ratings';
import styles from './Menu.module.css';

function Menu({ onClose }) {
  const history = useHistory();
  const isDesktop = useDesktop();
  const [openBuild, toggleBuild] = useToggle(false);
  const [openAlert, toggleOpenAlert] = useToggle(false);
  const { email } = useUser();
  const [identifier, setIdentifier] = useState('');
  const [showOtp, setShowOtp] = useToggle(false);
  const [err, setErr] = useState('');

  console.log(identifier, showOtp, err);

  const forceReload = async () => {
    await updateWebApp();
  };

  const logout = () => {
    Storage.logout(history);
  };

  const onButtonClick = (webCallback) => {
    if (WebView.isWebView()) {
      return async () => {
        try {
          await WebView.logout();
        } catch (error) {
          console.error(error);
        }
        logout();
      };
    }
    return webCallback;
  };

  const onEmailContinue = async () => {
    Loader.show();
    try {
      const { identifier: id } = await UserApi.sendOTC({
        email,
        deleteAccount: true
      });
      SnackBar.show(`OTP has been sent to ${email}`);
      setIdentifier(id);
      setShowOtp(true);
      toggleOpenAlert(true);
      setErr('');
    } catch (e) {
      if (e?.response?.data?.message) {
        setErr(e?.response?.data?.message);
      }
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const verifyOtp = async (otp) => {
    Loader.show();
    try {
      await UserApi.deleteAccount({
        email,
        identifier,
        code: otp
      });
      SnackBar.show('Your account has been deleted successfully.');
      logout();
    } catch (e) {
      SnackBar.showError(e);
      setShowOtp(false);
    } finally {
      Loader.hide();
    }
  };

  return (
    <>
      {openAlert && !showOtp && (
        <DeleteAlert
          title="Are you sure you want to delete your account?"
          subTitle="You will lose all your data and access. This action is irreversible."
          primary="Yes"
          secondary="No"
          onDelete={onEmailContinue}
          onCancel={toggleOpenAlert}
        />
      )}
      {!openAlert && showOtp && (
        <Alert
          onDelete={(e) => verifyOtp(e)}
          onCancel={setShowOtp}
        />
      )}
      {!isDesktop && (
        <Drawer
          PaperProps={{
            classes: {
              root: styles.paper,
            }
          }}
          anchor="right"
          open={true}
          onClose={() => {
            onClose();
          }}
        >
          <Dialog open={openBuild} onClose={toggleBuild} maxWidth="sm" fullWidth>
            <DialogTitle className="textCenter">
              Build Info
            </DialogTitle>
            <DialogContent>
              <div className={styles.buildId}>{`ID : ${CONFIG.BUILD.version}`}</div>
              <div className={styles.buildDate}>{`DATE : ${CONFIG.BUILD.date}`}</div>
              <Info
                text="Use force reload to delete app cache. Use only when app is not getting updated properly."
                title="Caution"
              />
              <div className="flexCenter">
                <Btn
                  primary={false}
                  variant="outlined"
                  label="Force reload!"
                  onClick={forceReload}
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                color="primary"
                variant="contained"
                onClick={toggleBuild}
              >
                CLOSE
              </Button>
            </DialogActions>
          </Dialog>
          <div className={styles.section}>
            <div className={styles.top}>
              <div className={styles.logoSection}>
                <a href="https://www.getwindo.shop" target="_blank" rel="noreferrer">
                  <img src={windo} alt="" />
                </a>
              </div>
              <div className={styles.topSection}>
                <Button
                  className={styles.underline}
                  target="_blank"
                  href="mailto:team@windo.live"
                  onClick={WebViewUtils.openUrl('mailto:team@windo.live')}
                  startIcon={<img className={styles.icon} src={contactIcon} alt="" />}
                >
                  Contact Us
                </Button>
                {!isDesktop && (
                  <Button
                    className={styles.underline}
                    onClick={RatingService.open}
                    startIcon={<img className={styles.icon} src={rateIcon} alt="" />}
                  >
                    Rate Us
                  </Button>
                )}
                <Button
                  className={styles.underline}
                  target="_blank"
                  href="https://www.getwindo.shop"
                  onClick={WebViewUtils.openUrl('https://www.getwindo.shop')}
                  startIcon={<img className={styles.icon} src={aboutIcon} alt="" />}
                >
                  About Us
                </Button>
              </div>
            </div>
            <div className={styles.lower}>
              <div className={styles.lowerSec1}>
                <Button
                  className={styles.underline}
                  target="_blank"
                  href="https://www.getwindo.shop/privacy-policy"
                  onClick={WebViewUtils.openUrl('https://www.getwindo.shop/privacy-policy')}
                  startIcon={<img className={styles.icon} src={privacyIcon} alt="" />}
                >
                  Privacy Policy
                </Button>
                <Button
                  className={styles.underline}
                  target="_blank"
                  href="https://www.getwindo.shop/terms-and-conditions"
                  onClick={WebViewUtils.openUrl('https://www.getwindo.shop/terms-and-conditions')}
                  startIcon={<img className={styles.icon} src={termsIcon} alt="" />}
                >
                  Terms and Conditions
                </Button>
                <Button
                  className={styles.underline}
                  onClick={toggleOpenAlert}
                  startIcon={<img className={styles.icon} src={deleteIcon} alt="" />}
                >
                  Delete Account
                </Button>
              </div>
              <div className={styles.build}>
                <Btn
                  size="medium"
                  label="App Info"
                  onClick={toggleBuild}
                />
              </div>
              <div className={styles.logout}>
                <GoogleLogout
                  clientId={CONFIG.GAUTH.CLIENT_ID}
                  theme="dark"
                  render={renderProps => (
                    <Button
                      onClick={onButtonClick(renderProps.onClick)}
                      className={cx(styles.marginB)}
                      disabled={WebView.isWebView() ? false : renderProps.disabled}
                      variant="outlined"
                      color="primary"
                      startIcon={<img src={logoutIcon} alt="" />}
                    >
                      Logout
                    </Button>
                  )}
                  icon={false}
                  className={styles.left10}
                  onLogoutSuccess={logout}
                >
                </GoogleLogout>
              </div>
            </div>
          </div>
        </Drawer>
      )}
      {isDesktop && (
        <Drawer
          PaperProps={{
            classes: {
              root: styles.paper1,
            }
          }}
          anchor="right"
          open={true}
          onClose={() => {
            onClose();
          }}
        >
          <Dialog open={openBuild} onClose={toggleBuild} maxWidth="xs" fullWidth>
            <div className={cx(styles.icon1, 'flexEnd')}>
              <Clickable
                onClick={toggleBuild}>
                <img src={closeIcon} alt="" />
              </Clickable>
            </div>
            <DialogTitle className="textCenter">
              App Info
            </DialogTitle>
            <DialogContent>
              <div className={styles.buildId}>{`ID : ${CONFIG.BUILD.version}`}</div>
              <div className={styles.buildDate}>{`DATE : ${CONFIG.BUILD.date}`}</div>
              <Info
                text="Use force reload to delete app cache. Use only when app is not getting updated properly."
                title="Caution"
              />
              <div className={cx(styles.icon1, 'flexCenter')}>
                <Btn
                  primary={false}
                  variant="outlined"
                  label="Force reload"
                  onClick={forceReload}
                />
              </div>
            </DialogContent>
          </Dialog>
          <div className={styles.section}>
            <div className={styles.top}>
              <div className={styles.logoSection}>
                <a href="https://www.getwindo.shop" target="_blank" rel="noreferrer">
                  <img src={windo} alt="" />
                </a>
              </div>
              <div className={styles.topSection}>
                <Button
                  className={styles.underline}
                  target="_blank"
                  href="mailto:team@windo.live"
                  onClick={WebViewUtils.openUrl('mailto:team@windo.live')}
                  startIcon={<img className={styles.icon} src={contactIcon} alt="" />}
                >
                  Contact Us
                </Button>
                {!isDesktop && (
                  <Button
                    className={styles.underline}
                    onClick={RatingService.open}
                    startIcon={<img className={styles.icon} src={rateIcon} alt="" />}
                  >
                    Rate Us
                  </Button>
                )}
                <Button
                  className={styles.underline}
                  target="_blank"
                  href="https://www.getwindo.shop"
                  onClick={WebViewUtils.openUrl('https://www.getwindo.shop')}
                  startIcon={<img className={styles.icon} src={aboutIcon} alt="" />}
                >
                  About Us
                </Button>
              </div>
            </div>
            <div className={styles.lower}>
              <div className={styles.lowerSec1}>
                <Button
                  className={styles.underline}
                  target="_blank"
                  href="https://www.getwindo.shop/privacy-policy"
                  onClick={WebViewUtils.openUrl('https://www.getwindo.shop/privacy-policy')}
                  startIcon={<img className={styles.icon} src={privacyIcon} alt="" />}
                >
                  Privacy Policy
                </Button>
                <Button
                  className={styles.underline}
                  target="_blank"
                  href="https://www.getwindo.shop/terms-and-conditions"
                  onClick={WebViewUtils.openUrl('https://www.getwindo.shop/terms-and-conditions')}
                  startIcon={<img className={styles.icon} src={termsIcon} alt="" />}
                >
                  Terms and Conditions
                </Button>
                <Button
                  className={styles.underline}
                  onClick={toggleOpenAlert}
                  startIcon={<img className={styles.icon} src={deleteIcon} alt="" />}
                >
                  Delete Account
                </Button>
              </div>
              <div className={styles.build}>
                <Btn
                  size="medium"
                  label="App Info"
                  onClick={toggleBuild}
                />
              </div>
              <div className={styles.logout}>
                <GoogleLogout
                  clientId={CONFIG.GAUTH.CLIENT_ID}
                  theme="dark"
                  render={renderProps => (
                    <Button
                      onClick={onButtonClick(renderProps.onClick)}
                      className={cx(styles.marginB)}
                      disabled={WebView.isWebView() ? false : renderProps.disabled}
                      variant="outlined"
                      color="primary"
                      startIcon={<img src={logoutIcon} alt="" />}
                    >
                      Logout
                    </Button>
                  )}
                  icon={false}
                  className={styles.left10}
                  onLogoutSuccess={logout}
                >
                </GoogleLogout>
              </div>
            </div>
          </div>
        </Drawer>
      )}
    </>

  );
}

Menu.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Menu;
