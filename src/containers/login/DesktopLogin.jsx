import React, { createRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Clickable, FormikInput } from 'phoenix-components';
import googleDeskIcon from 'assets/v2/login/buttons/googleIcon.svg';
import guestIcon from 'assets/v2/login/buttons/guestDesk.svg';
import facebookIcon from 'assets/v2/login/buttons/facebookIcon.svg';
import iosIcon from 'assets/v2/login/buttons/iosIcon.svg';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import windoLogo from 'assets/v2/common/logo.svg';
import langIcon from 'assets/v2/login/buttons/lang.svg';
import trustedLogo from 'assets/logos/trustedlogo-inv.svg';
import WebView from 'services/webview';
import Storage from 'services/storage';
import { useToggle } from 'hooks/common';
import { User as UserApi, User } from 'api';
import CONFIG from 'config';
import { Slider } from 'components/login/Slider';
// import { Grid } from '@material-ui/core';
import { GoogleLogin } from 'react-google-login';
import SnackBar from 'services/snackbar';
import * as Yup from 'yup';
import { Formik } from 'formik';
import cx from 'classnames';
import _ from 'lodash';
import Loader from 'services/loader';
import { Guest } from '../../components/login/Guest.jsx';
import { LanguageDrawer } from '../../components/common/LanguageDrawer.jsx';
import { useIos } from './ios';
import styles from './DesktopLogin.module.css';

const emailValidation = Yup.object()
  .shape({
    email: Yup.string()
      .required()
      .email('enter valid email id'),
  });

function DesktopLogin({ onLogin }) {
  const [isEmail, setIsEmail] = useState(false);
  const ios = useIos();
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const isWebView = WebView.isWebView();
  const [seconds, setSeconds] = useState(0);
  const [err, setErr] = useState('');
  const [openGuest, toggleGuest] = useToggle(false);
  const [openLanguage, toggleLanguage] = useToggle(false);

  const refs = _.range(0, 6)
    .map(() => createRef());

  useEffect(() => {
    if (seconds > 0) {
      const timeout = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }
  }, [seconds]);

  const onEmailContinue = async (values) => {
    setEmail(values.email);
    Loader.show();
    try {
      const { identifier: id } = await UserApi.sendOTC({ email: values.email });
      SnackBar.show(`OTP has been sent to ${values.email}`);
      setIdentifier(id);
      setShowOtp(true);
      setSeconds(59);
      setIsEmail(false);
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

  const otpGoBack = () => {
    setShowOtp(false);
    setIsEmail(false);
    setIdentifier('');
  };

  const verifyOtp = async () => {
    Loader.show();
    try {
      const { token } = await UserApi.validateEmail({
        email,
        code: otp.join('')
          .toUpperCase(),
        identifier
      });
      Storage.setItem('token', token);
      onLogin();
    } catch (e) {
      const error = e?.response?.data?.message;
      if (error) {
        SnackBar.show(error, 'error');
        return;
      }
      SnackBar.show('Something went wrong', 'error');
    } finally {
      Loader.hide();
    }
  };

  const responseGoogle = async (response) => {
    Storage.setItem('token', await User.register(response.tokenId, response.platform || 'web'));
    onLogin(true);
  };

  const responseFailGoogle = (err) => {
    SnackBar.showError(err ?? 'Unable to login, try again later!', 'error');
  };

  const onAppleButtonClick = async () => {
    try {
      const data = await WebView.appleLogin();
      await responseGoogle({
        ...data,
        platform: 'apple'
      });
    } catch (error) {
      responseFailGoogle(error);
    }
  };

  const onFacebookLogin = async () => {
    try {
      const data = await WebView.facebookLogin();
      await responseGoogle({
        ...data,
        platform: 'facebook'
      });
    } catch (error) {
      responseFailGoogle(error);
    }
  };

  const onButtonClick = (webCallback) => {
    if (isWebView) {
      return async () => {
        try {
          const data = await WebView.login();
          await responseGoogle(data);
        } catch (error) {
          responseFailGoogle(error);
        }
      };
    }
    return webCallback;
  };

  const setOtpCh = (e, idx) => {
    const { value } = e.target;
    if (/^[0-9]{6}$/.test(value)) {
      e.stopPropagation();
      e.preventDefault();
      setOtp([...value]);
      return;
    }
    if (idx + 1 < 6 && e.target.value !== '') {
      if (refs[idx + 1]?.current) {
        refs[idx + 1].current.focus();
      }
    }
    [otp[idx]] = e.target.value;
    setOtp([...otp]);
  };

  const onKeyDown = (idx) => (e) => {
    if (e.keyCode === 8 && idx > 0) {
      if (refs[idx - 1]?.current?.focus) {
        refs[idx - 1].current.focus();
        if (idx === 5 && otp[idx]) {
          otp[5] = '';
          setOtp([...otp]);
          return;
        }
        if (otp[idx] === '' || otp[idx] === null) {
          otp[idx - 1] = '';
          setOtp([...otp]);
        }
      }
    }
  };

  const onOtpPaste = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let value = (e.clipboardData || window.clipboardData).getData('text');
    value = value.trim();
    if (/^[0-9]{6}$/.test(value)) {
      setOtp([...value]);
    }
  };

  const openLink = (url) => {
    if (WebView.isWebView()) {
      WebView.openUrl(url);
      return;
    }
    window.open(url);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.slider}>
          <Clickable
            className={styles.selectLang}
            onClick={toggleLanguage}
          >
            <img src={langIcon} alt="" />
            <div className={styles.lang}>
              Change Language
            </div>
          </Clickable>
          <Slider />
          {openLanguage && <LanguageDrawer onBack={toggleLanguage} />}
        </div>
        <div className={styles.content}>
          {!showOtp && !isEmail && (
            <>
              <Formik
                initialValues={{ email }}
                validationSchema={emailValidation}
                onSubmit={onEmailContinue}
              >
                {({
                  isValid, submitForm
                }) => (
                  <>
                    <div className={styles.logo}>
                      <img src={windoLogo} alt="logo" />
                    </div>
                    <div className={styles.trustedLogo}>
                      <img src={trustedLogo} alt="" />
                      <div className={styles.trustedTxt}>
                        Trusted by 350,000+ Sellers, 140+ Countries, 1Million+ Orders Processed
                      </div>
                    </div>
                    <div className={styles.continueWithEmail}>Continue with Email</div>
                    <div className={styles.inputContainer}>
                      <div className={styles.input}>
                        <FormikInput
                          name="email"
                          label="Enter Email"
                          placeholder="e.g. abc@xyz.com"
                          errorTextClass={styles.errorTextDesk} />
                      </div>
                      <div className={styles.button}>
                        <Button
                          size="large"
                          label="Continue"
                          primary={true}
                          disabled={!isValid}
                          onClick={submitForm}
                          className={styles.buttonD}
                        />
                      </div>
                    </div>
                    <div className={styles.relative}>
                      <div className={styles.line}></div>
                      Or
                      <div className={styles.line}></div>
                    </div>
                    <div className={styles.singnInTypeText}>
                      Continue with
                    </div>
                    <div className={styles.loginType}>
                      {ios && (
                        <>
                          <Clickable
                            onClick={onAppleButtonClick}
                            name="Apple ID"
                          >
                            <img src={iosIcon} alt="" />
                          </Clickable>
                          <hr />
                        </>
                      )}
                      {isWebView && (
                        <>
                          <Clickable
                            onClick={onFacebookLogin}
                            name="Facebook"
                          >
                            <img src={facebookIcon} alt="" />
                          </Clickable>
                          <hr />
                        </>
                      )}
                      <div className={styles.loginType1}>
                        <GoogleLogin
                          clientId={CONFIG.GAUTH.CLIENT_ID}
                          render={renderProps => (
                            <>
                              <Clickable
                                onClick={onButtonClick(renderProps.onClick)}
                                name="Google"
                              >
                                <img src={googleDeskIcon} alt="" />
                                <div className={styles.helper}>Google</div>
                              </Clickable>
                            </>
                          )}
                          onSuccess={responseGoogle}
                          onFailure={responseFailGoogle}
                          fetchBasicProfile={true}
                          isSignedIn={false}
                          cookiePolicy="single_host_origin"
                        />
                        <div className={styles.lineV} />
                        <Clickable
                          onClick={toggleGuest}
                        >
                          <img src={guestIcon} alt="" className={styles.gImg} />
                          <div className={styles.helper}>Guest</div>
                        </Clickable>
                      </div>
                      <Clickable className={styles.agree}>
                        By Signing up, you agree to our
                        <Clickable
                          className={styles.textLink}
                          onClick={() => {
                            openLink('https://www.getwindo.shop/terms-and-conditions');
                          }}
                        >
                          {' '}
                          terms of use
                          {' '}
                        </Clickable>
                        and
                        <Clickable
                          className={styles.textLink}
                          onClick={() => {
                            openLink('https://www.getwindo.shop/privacy-policy');
                          }}
                        >
                          {' '}
                          privacy policy
                          {' '}
                        </Clickable>
                        .
                      </Clickable>
                    </div>
                  </>
                )}
              </Formik>
            </>
          )}
          {showOtp && (
            <div className={cx(styles.loginContainer, styles.otpScreen)}>
              <div className={styles.logo1}>
                <img src={windoLogo} alt="logo" />
              </div>
              <div className={styles.otpHeader}>
                <Clickable
                  className={styles.deskBackButton}
                  onClick={otpGoBack}>
                  <img src={chevronLeftDesk} alt="" />
                </Clickable>
                <div className={styles.continueWith}>Verify Email</div>
                <div>&nbsp;</div>
              </div>
              <div className={styles.helperText}>
                Please enter the OTP sent to
                {' '}
                {email}
                {' '}
              </div>
              <div className={styles.otpContainer}>
                {_.range(0, 6)
                  .map((i) => (
                    <input
                      ref={refs[i]}
                      key={i}
                      autoFocus={i === 0}
                      onChange={(e) => setOtpCh(e, i)}
                      type="number"
                      minLength={1}
                      maxLength={1}
                      value={otp[i] || ''}
                      onKeyDown={onKeyDown(i)}
                      onPaste={onOtpPaste}
                      autoComplete="one-time-code"
                    />
                  ))}
              </div>
              <div className={styles.timerContainer}>
                <div>
                  00:
                  {seconds.toString()
                    .padStart(2, '0')}
                </div>
              </div>
              <div className={styles.button}>
                <Button
                  className={styles.otpSubmitButton}
                  size="large"
                  label="Submit"
                  primary={true}
                  disabled={otp.length !== 6}
                  onClick={verifyOtp}
                />
              </div>
              <div className={styles.resendCode}>
                <div>Didn't receive the OTP?  </div>
                <Clickable
                  className={styles.resendCodeButton}
                  onClick={() => {
                    if (seconds > 0) {
                      SnackBar.show(`Wait for ${seconds} seconds before retrying`, 'warning');
                      return;
                    }
                    onEmailContinue({ email });
                    setOtp(['', '', '', '', '', '']);
                  }}
                >
                  Resend OTP
                </Clickable>
              </div>
              {err.length > 0 && (
                <div className={styles.error}>
                  {err}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {openGuest && <Guest onBack={toggleGuest} /> }
    </>
  );
}

DesktopLogin.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default DesktopLogin;
