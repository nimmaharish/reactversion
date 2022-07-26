import React, { useEffect, useState, createRef } from 'react';
import cx from 'classnames';
import { useHistory } from 'react-router-dom';
import { getCountries } from 'utils/countries';
import { FormikInput } from 'phoenix-components';
import notVerifiedImage from 'assets/images/sellerProfile/notVerified.svg';
import verifiedImage from 'assets/images/sellerProfile/verified.svg';
import { Button, ReactInput, Clickable, } from 'phoenix-components';
import { useShop } from 'contexts/userContext';
import * as Yup from 'yup';
import { User as UserApi } from 'api';
import Header from 'containers/products/Header';
import { Dialog, DialogContent } from '@material-ui/core';
import closeIcon from 'assets/images/shippingModes/close.svg';
import whatsappIcon from 'assets/images/sellerProfile/whatsapp.svg';
import messageIcon from 'assets/images/sellerProfile/sms.svg';
import { BottomDrawer } from 'components/shared/BottomDrawer';
import { FooterButton } from 'components/common/FooterButton';
// import { Drawer } from 'components/shared/Drawer';
import _ from 'lodash';
import { Formik } from 'formik';
import firebase from 'firebase/app';
import 'firebase/auth';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { useUser } from 'hooks/user';
import { useDesktop, useUserRefresh } from 'contexts';

import { SideDrawer } from 'components/shared/SideDrawer';
import { Drawer } from '@material-ui/core';
import { getInitialValues, schema } from './utils';
import styles from './SellerProfile.module.css';

function SellerProfile() {
  const isDesktop = useDesktop();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [verified, setVerified] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [popUp, setPopUp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpType, setOtpType] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [originalPhone, setOriginalPhone] = useState('');
  const { country } = useShop();
  const history = useHistory();
  const [result, setResult] = useState(null);
  const [identifier, setIdentifier] = useState('');
  const refs = _.range(0, 6)
    .map(() => createRef());
  const [seconds, setSeconds] = useState(0);
  const [err, setErr] = useState('');

  const [user, refreshUser] = useUser();
  const userContextRefresh = useUserRefresh();

  const getLabel = (onlyCode = false) => {
    const countries = getCountries();
    const countre = countries.find(x => x.countryName === country?.toLowerCase());
    if (country.length === 0) {
      return '';
    }
    if (onlyCode) {
      return countre.dial;
    }
    return `${countre.label} (${countre.dial})`;
  };

  const emailValidation = Yup.object()
    .shape({
      email: Yup.string()
        .required()
        .email('Please enter a valid email id'),
    });

  const getOnlyNumber = () => {
    const search = getLabel(true);
    const replaceWith = '';
    const pieces = phone.split(search);
    const resultingString = pieces.join(replaceWith);
    return resultingString;
  };

  const submit = async (values) => {
    Loader.show();
    try {
      try {
        const payload = { firstName, lastName, ...values };
        await UserApi.updateSeller(payload);
        refreshUser();
        userContextRefresh();
        if (!isDesktop) {
          history.push('/manage');
        } else {
          history.goBack();
        }
        Loader.hide();
      } catch (e) {
        Loader.hide();
        const error = e?.response?.data?.message;
        if (error) {
          if (error.toLowerCase() === 'validation error') {
            setErr('Number already exists');
            return;
          }
        }
        return;
      }
    } catch (e) {
      Loader.hide();
    }
  };

  const genOTP = (type, hideOTPBox = false) => {
    Loader.show();
    if (type === 'message') {
      firebase.auth().signInWithPhoneNumber(`${getLabel(true)}${getOnlyNumber()}`, window.recaptchaVerifier)
        .then((confirmationResult) => {
          SnackBar.show('OTP Sent');
          setResult(confirmationResult);
          if (!hideOTPBox) {
            setShowOtp(true);
            setPopUp(false);
          }
          setSeconds(59);
          Loader.hide();
          // ...
        }).catch((error) => {
          if (error?.response?.data?.message) {
            setErr(error?.response?.data?.message);
          }
          SnackBar.showError(error);
          Loader.hide();
          // Error; SMS not sent
          // ...
        });
      return;
      // [END auth_phone_signin]
    }
    UserApi.sendPhoneOTC({ type: 'whatsapp', phone: `${getLabel(true)}${getOnlyNumber()}` })
      .then((x) => {
        setIdentifier(x?.identifier || '');
        setShowOtp(true);
        setPopUp(false);
        setSeconds(59);
        Loader.hide();
      })
      .catch((error) => {
        if (error?.response?.data?.message) {
          setErr(error?.response?.data?.message);
        }
        Loader.hide();
        SnackBar.showError(error);
        // Error; SMS not sent
        // ...
      });
  };

  useEffect(() => {
    const firebaseConfig = {
      apiKey: 'AIzaSyCl3t5cIetw8ypSXfaH6DZ9ds5n1-_8Bk4',
      authDomain: 'windo-beta.firebaseapp.com',
      projectId: 'windo-beta',
      storageBucket: 'windo-beta.appspot.com',
      messagingSenderId: '40104794528',
      appId: '1:40104794528:web:f70156e6011cab5104ecc5',
      measurementId: 'G-T82PVXB1QF'
    };
    if (firebase.apps.length > 0) {
      firebase.app();
    } else {
      firebase.initializeApp(firebaseConfig);
    }
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
      size: 'invisible',
    });
  }, []);

  useEffect(() => {
    if (user) {
      const x = user;
      setPhone(x?.phone || '');
      setOriginalPhone(x?.phone || '');
      setEmail(x?.email);
      setFirstName(x?.firstName);
      setLastName(x?.lastName);
      if (x?.phone && x?.email && x?.firstName && x?.lastName) {
        setVerified(true);
      } else {
        setVerified(false);
      }
    }
  }, [JSON.stringify(user)]);

  useEffect(() => {
    if (seconds > 0 && showOtp) {
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

  const verifyOtp = async () => {
    Loader.show();
    const txPhone = `${getLabel(true)}${getOnlyNumber()}`;
    try {
      if (otpType === 'message') {
        const res = await result.confirm(otp.join(''));
        const idToken = await res.user.getIdToken();
        const payload = {
          phone: txPhone,
          identifier,
          type: 'phone',
          token: idToken,
        };
        const data = await UserApi.validatePhone(payload);
        setVerified(true);
        refreshUser();
        submit();
        if (data) {
          SnackBar.show('Verified Successfully');
          setShowOtp(false);
          setOriginalPhone(txPhone);
          refreshUser();
        }
        return;
      }
      const payload = {
        phone: txPhone,
        identifier,
        type: 'whatsapp',
        code: otp.join(''),
      };
      const data = await UserApi.validatePhone(payload);
      setVerified(true);
      refreshUser();
      submit();
      if (data) {
        SnackBar.show('Verified Successfully');
        setShowOtp(false);
      }
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

  const isSameEntered = originalPhone !== (getLabel(true) + getOnlyNumber());
  const showOtpButton = phone?.length > 0 && isSameEntered;
  const buttonLabel = showOtpButton ? 'Send OTP' : 'Update';

  if (isDesktop) {
    return (
      <>
        <Formik
          enableReinitialize={true}
          initialValues={getInitialValues({ firstName, lastName } || {})}
          onSubmit={submit}
          validationSchema={schema}
        >
          {({ submitForm }) => (
            <SideDrawer
              backButton={true}
              title="Seller Profile"
              onClose={() => history.goBack()}
              onClick={showOtpButton ? () => setPopUp(true) : submitForm}
            >
              <div className={styles.mainContainer}>
                <div className={styles.desktopContainer}>
                  <div className={styles.image}>
                    <img src={verified ? verifiedImage : notVerifiedImage} alt="" />
                  </div>
                  <div className={styles.text}>
                    Verification status:
                    <span className={verified ? styles.verified : styles.notVerified}>
                      {' '}
                      {verified ? 'Verified' : 'Not Verified'}
                    </span>
                  </div>
                  <div className={cx(styles.top)}>
                    <FormikInput
                      variant="outlined"
                      name="firstName"
                      type="text"
                      label="First Name"
                      inputProps={{
                        onChange: (e) => setFirstName(e.target.value)
                      }}
                      placeholder="Your name" />
                  </div>
                  <div className={cx(styles.top)}>
                    <FormikInput
                      variant="outlined"
                      name="lastName"
                      type="text"
                      label="Last Name"
                      inputProps={{
                        onChange: (e) => setLastName(e.target.value)
                      }}
                      placeholder="Your name" />
                  </div>
                  <div className={cx(styles.top)}>
                    <ReactInput
                      label="E-Mail ID"
                      placeholder="Enter Email"
                      pattern={emailValidation}
                      setValue={e => setEmail(e)}
                      readonly={true}
                      value={email}
                    />
                  </div>
                  <div className={cx(styles.top)}>
                    <ReactInput
                      startLabelMain="Phone"
                      startLabel={getLabel()}
                      placeholder="Phone number"
                      value={getOnlyNumber()}
                      setValue={(e) => {
                        setPhone(e);
                      }}
                    />
                  </div>
                </div>
                <div className={styles.buttonD}>
                  <Button
                    size="large"
                    primary={true}
                    label={buttonLabel}
                    onClick={showOtpButton ? () => setPopUp(true) : submitForm}
                    disabled={otp.length !== 6}
                  />
                </div>
                {
                  popUp && (
                    <Drawer
                      anchor="bottom"
                      open={!!popUp}
                      onClose={() => {
                        setPopUp(false);
                      }}
                      PaperProps={{
                        classes: {
                          root: styles.paper,
                        }
                      }}
                    >
                      <div className={styles.drawer}>
                        <img src={closeIcon} alt="" className={styles.img2} onClick={() => setPopUp(false)} />
                        <div className={styles.title2}>
                          Would you like to receive OTP through Message or Whatsapp
                        </div>
                        <div className={styles.icons}>
                          <div className={styles.half}>
                            <div className={styles.imgSec}>
                              <img
                                src={messageIcon}
                                alt=""
                                onClick={() => {
                                  setOtpType('message');
                                  genOTP('message', false);
                                  setOtp(['', '', '', '', '', '']);
                                }}
                              />
                            </div>
                            <div className={styles.label}>SMS</div>
                          </div>
                          <div className={styles.half}>
                            <div className={styles.imgSec}>
                              <img
                                src={whatsappIcon}
                                alt=""
                                onClick={() => {
                                  setOtpType('whatsapp');
                                  genOTP('whatsapp', false);
                                  setOtp(['', '', '', '', '', '']);
                                }}
                              />
                            </div>
                            <div className={styles.label}>Whatsapp</div>
                          </div>
                        </div>
                      </div>
                    </Drawer>
                  )
                }
                {showOtp && (
                  <>
                    <Drawer
                      anchor="bottom"
                      open={!!showOtp}
                      onClose={() => setShowOtp(false)}
                      PaperProps={{
                        classes: {
                          root: styles.paper2,
                        }
                      }}
                    >
                      <div>
                        <img src={closeIcon} alt="" className={styles.img2} onClick={() => setShowOtp(false)} />
                        <div className={cx(styles.loginContainer, styles.otpScreen)}>
                          <div className={styles.drawerTitle}>
                            {otpType === 'whatsapp' ? 'Whatsapp OTP' : 'Message OTP'}
                          </div>
                          <div className={styles.otpText}>
                            Please enter the OTP sent to
                            &nbsp;
                            <span className={styles.number}>{`${getLabel(true)}-${phone.trim()}`}</span>
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
                          <div className={styles.resendCode}>
                            <div>Didn't receive the OTP?</div>
                            <Clickable
                              className={styles.resendCodeButton}
                              onClick={() => {
                                if (seconds > 0) {
                                  SnackBar.show(`Wait for ${seconds} seconds before retrying`, 'warning');
                                  return;
                                }
                                genOTP(otpType === 'whatsapp' ? 'whatsapp' : 'message', true);
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
                          <Button
                            size="large"
                            label="Submit"
                            fullWidth
                            primary={true}
                            disabled={otp.length !== 6}
                            onClick={verifyOtp}
                          />
                        </div>
                      </div>
                    </Drawer>
                  </>
                )}
              </div>
            </SideDrawer>
          )}
        </Formik>
        <div id="sign-in-button" />
      </>
    );
  }

  return (
    <div className={styles.shopSection}>
      <Header onBack={() => history.goBack()} title="Seller Profile" />
      <div id="sign-in-button" />
      <Formik
        enableReinitialize={true}
        initialValues={getInitialValues({ firstName, lastName } || {})}
        onSubmit={submit}
        validationSchema={schema}
      >
        {({ submitForm }) => (
          <>
            <div className={styles.mainContainer}>
              <div className={styles.image}>
                <img src={verified ? verifiedImage : notVerifiedImage} alt="" />
              </div>
              <div className={styles.text}>
                Verification status:
                <span className={verified ? styles.verified : styles.notVerified}>
                  {' '}
                  {verified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              <div className={cx(styles.top)}>
                <FormikInput
                  variant="outlined"
                  name="firstName"
                  type="text"
                  inputProps={{
                    onChange: (e) => setFirstName(e.target.value)
                  }}
                  label="First Name"
                  placeholder="Your name" />
              </div>
              <div className={cx(styles.top)}>
                <FormikInput
                  variant="outlined"
                  name="lastName"
                  type="text"
                  inputProps={{
                    onChange: (e) => setLastName(e.target.value)
                  }}
                  label="Last Name"
                  placeholder="Your name" />
              </div>
              <div className={cx(styles.top)}>
                <ReactInput
                  label="E-Mail ID"
                  placeholder="Enter Email"
                  pattern={emailValidation}
                  setValue={e => setEmail(e)}
                  readonly={true}
                  value={email} />
              </div>
              <div className={cx(styles.top)}>
                <ReactInput
                  startLabelMain="Phone"
                  startLabel={getLabel()}
                  placeholder="Phone number"
                  value={getOnlyNumber()}
                  setValue={(e) => {
                    setPhone(e);
                  }} />
              </div>
            </div>
            <div className={styles.button}>
              <Button
                fullWidth
                bordered={false}
                onClick={showOtpButton ? () => setPopUp(true) : submitForm}
                size="large"
                label={buttonLabel} />
            </div>
          </>
        )}
      </Formik>
      {
        popUp && (
          <Dialog open={true} onClose={() => setPopUp(false)} fullWidth>
            <DialogContent>
              <div className={styles.drawer}>
                <img src={closeIcon} alt="" className={styles.img} onClick={() => setPopUp(false)} />
                <div className={styles.title}>
                  Would you like to receive OTP through Message or Whatsapp
                </div>
                <div className={styles.icons}>
                  <div className={styles.half}>
                    <div className={styles.imgSec}>
                      <img
                        src={messageIcon}
                        alt=""
                        onClick={() => {
                          setOtpType('message');
                          genOTP('message', false);
                          setOtp(['', '', '', '', '', '']);
                        }}
                      />
                    </div>
                    <div className={styles.label}>SMS</div>
                  </div>
                  <div className={styles.half}>
                    <div className={styles.imgSec}>
                      <img
                        src={whatsappIcon}
                        alt=""
                        onClick={() => {
                          setOtpType('whatsapp');
                          genOTP('whatsapp', false);
                          setOtp(['', '', '', '', '', '']);
                        }}
                      />
                    </div>
                    <div className={styles.label}>Whatsapp</div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )
      }
      {showOtp && (
        <>
          <BottomDrawer
            onClose={() => setShowOtp(false)}
            closeButton
            title={otpType === 'whatsapp' ? 'Whatsapp OTP' : 'Message OTP'}
          >
            <div className={cx(styles.loginContainer, styles.otpScreen)}>
              <div className={styles.otpText}>
                Please enter the OTP sent to
                &nbsp;
                <span className={styles.number}>{`${getLabel(true)}-${phone.trim()}`}</span>
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
              <div className={styles.resendCode}>
                <div>Didn't receive the OTP?</div>
                <Clickable
                  className={styles.resendCodeButton}
                  onClick={() => {
                    if (seconds > 0) {
                      SnackBar.show(`Wait for ${seconds} seconds before retrying`, 'warning');
                      return;
                    }
                    genOTP(otpType === 'whatsapp' ? 'whatsapp' : 'message', true);
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
              <FooterButton>
                <Button
                  size="large"
                  label="Submit"
                  fullWidth
                  primary={true}
                  disabled={otp.length !== 6}
                  onClick={verifyOtp}
                  boardered={false}
                />
              </FooterButton>
            </div>
          </BottomDrawer>
        </>
      )}
    </div>
  );
}

export default SellerProfile;
