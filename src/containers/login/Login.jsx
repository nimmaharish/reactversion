import React, {
  createRef, useEffect, useState
} from 'react';
import PropTypes from 'prop-types';
import { Slider } from 'components/login/Slider';
import { LoginButton } from 'phoenix-components/lib/containers';
import { Button, Clickable, FormikInput } from 'phoenix-components';
import emailIcon from 'assets/v2/login/buttons/email.svg';
import googleIcon from 'assets/v2/login/buttons/google.svg';
import facebookIcon from 'assets/v2/login/buttons/facebook.svg';
import appleIcon from 'assets/v2/login/buttons/apple.svg';
import guestIcon from 'assets/v2/login/buttons/guest.svg';
import langIcon from 'assets/v2/login/buttons/lang.svg';
import chevronLeft from 'assets/v2/common/chevronWhiteLeft.svg';
import trustedLogo from 'assets/logos/trustedlogo.svg';
import WebView from 'services/webview';
import Storage from 'services/storage';
import { User as UserApi, User } from 'api';
import CONFIG from 'config';
import { GoogleLogin } from 'react-google-login';
import SnackBar from 'services/snackbar';
import * as Yup from 'yup';
import { useToggle } from 'hooks/common';
import { Formik } from 'formik';
import cx from 'classnames';
import { useDesktop } from 'contexts';
import _ from 'lodash';
import Loader from 'services/loader';
import { LanguageDrawer } from '../../components/common/LanguageDrawer.jsx';
import { Guest } from '../../components/login/Guest.jsx';
import DesktopLogin from './DesktopLogin.jsx';
import styles from './Login.module.css';
import { useIos } from './ios';

const emailValidation = Yup.object()
  .shape({
    email: Yup.string()
      .required()
      .email('Please enter a valid email id'),
  });

function Login({ onLogin }) {
  const ios = useIos();
  const [isEmail, setIsEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const isWebView = WebView.isWebView();
  const [err, setErr] = useState('');
  const [seconds, setSeconds] = useState(0);
  const isDesktop = useDesktop();
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
    setIsEmail(true);
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
      {isDesktop && <DesktopLogin onLogin={onLogin} />}
      {!isDesktop && (
        <div className={styles.container}>
          <div className={styles.slider}>
            <Slider />
          </div>
          <div className={styles.trustedLogo}>
            <img src={trustedLogo} alt="" />
            <div className={styles.trustedTxt}>
              Trusted by 350,000+ Sellers, 140+ Countries,
              <br />
              1Million+ Orders Processed
            </div>
          </div>
          {showOtp && (
            <div
              className={cx(styles.loginContainer, styles.otpScreen)}>
              <div className={styles.otpHeader}>
                <Clickable onClick={otpGoBack}>
                  <img src={chevronLeft} alt="" />
                </Clickable>
                <div className={styles.continueWith}>Verify Email</div>
                <div>&nbsp;</div>
              </div>
              <div>
                Please enter the OTP sent via
                {' '}
                {email}
                {' '}
              </div>
              <div>
                Please check your Spam if not received
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
                <div>Please enter valid 6 digit code</div>
                <div>
                  00:
                  {seconds.toString()
                    .padStart(2, '0')}
                </div>
              </div>
              <div className={styles.resendCode}>
                <div>Didn't received code?</div>
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
                  Resend Code
                </Clickable>
              </div>
              {err.length > 0 && (
                <div className={styles.error}>
                  {err}
                </div>
              )}
              <div className="spacer" />
              <Button
                size="large"
                label="Submit"
                fullWidth
                primary={false}
                disabled={otp.length !== 6}
                onClick={verifyOtp}
              />
            </div>
          )}
          {isEmail && (
            <Formik
              initialValues={{ email }}
              validationSchema={emailValidation}
              onSubmit={onEmailContinue}
            >
              {({
                isValid,
                submitForm
              }) => (
                <div className={styles.loginContainer}>
                  <div className={styles.back}>
                    <Clickable
                      onClick={() => {
                        setIsEmail(false);
                      }}>
                      <img src={chevronLeft} alt="" />
                    </Clickable>
                    <div className={styles.continue}>Continue with</div>
                  </div>
                  <FormikInput
                    name="email"
                    label="Enter Email ID"
                    placeholder="Enter your mail ID"
                    errorTextClass={styles.errorText}
                  />
                  <div className="spacer" />
                  <Button
                    size="large"
                    label="Continue"
                    primary={false}
                    disabled={!isValid}
                    onClick={submitForm}
                    fullWidth
                  />
                </div>
              )}
            </Formik>
          )}
          {!isEmail && !showOtp && (
            <div className={styles.loginContainer}>
              <div className={styles.head}>
                <div className={styles.continueWith1}>
                  Continue with
                </div>
                <Clickable
                  className={styles.selectLang}
                  onClick={toggleLanguage}
                >
                  <img src={langIcon} alt="" />
                  <div className={styles.lang}>
                    Change Language
                  </div>
                </Clickable>
              </div>
              {openLanguage && <LanguageDrawer onBack={toggleLanguage} />}
              <div className={styles.buttonContainer}>
                <LoginButton
                  onClick={() => setIsEmail(true)}
                  icon={emailIcon}
                  name="Email"
                />
                <GoogleLogin
                  clientId={CONFIG.GAUTH.CLIENT_ID}
                  render={renderProps => (
                    <LoginButton
                      icon={googleIcon}
                      name="Google"
                      onClick={onButtonClick(renderProps.onClick)}
                    />
                  )}
                  onSuccess={responseGoogle}
                  onFailure={responseFailGoogle}
                  fetchBasicProfile={true}
                  isSignedIn={false}
                  cookiePolicy="single_host_origin"
                />
                {isWebView && (
                  <LoginButton
                    onClick={onFacebookLogin}
                    icon={facebookIcon}
                    name="Facebook"
                    bgColor="#1B5AA5"
                    color="var(--white)"
                  />
                )}
                {ios && (
                  <LoginButton
                    onClick={onAppleButtonClick}
                    icon={appleIcon}
                    name="Sign in with Apple"
                    bgColor="var(--black)"
                    color="var(--white)"
                  />
                )}
                <LoginButton
                  onClick={toggleGuest}
                  icon={guestIcon}
                  name="Continue as Guest"
                />
              </div>
              {openGuest && <Guest onBack={toggleGuest} /> }
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
          )}
        </div>
      )}
    </>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
