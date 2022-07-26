import googleIcon from 'assets/v2/settings/checkout/login/google.svg';
import emailIcon from 'assets/v2/settings/checkout/login/email.svg';
import whatsappIcon from 'assets/v2/settings/checkout/login/whatsapp.svg';
import guestIcon from 'assets/v2/settings/checkout/login/guest.svg';
import phoneIcon from 'assets/v2/settings/checkout/login/phone.svg';

export const LOGIN_DATA = {
  email: {
    title: 'Email + OTP',
    subTitle: 'Users login with email and OTP verification',
    icon: emailIcon,
  },
  google: {
    title: 'Google Login',
    subTitle: 'Users login with Google account',
    icon: googleIcon,
  },
  whatsapp: {
    title: 'Whatsapp + OTP',
    subTitle: 'Users login with Whatsapp and OTP verification',
    icon: whatsappIcon,
  },
  phone: {
    title: 'Phone + OTP',
    subTitle: 'Users login with Phone and OTP verification',
    icon: phoneIcon,
  },
  guest: {
    title: 'Guest Login',
    subTitle: 'Users can login as Guest',
    icon: guestIcon,
  },
  direct: {
    title: 'Direct Login',
    subTitle: 'Users can Checkout without login',
    icon: guestIcon,
  }
};

export const getInitialValues = (data = {}) => ({
  google: {
    enabled: data?.google?.enabled || false,
  },
  email: {
    enabled: data?.email?.enabled || false,
  },
  whatsapp: {
    enabled: data?.whatsapp?.enabled || false,
  },
  phone: {
    enabled: data?.phone?.enabled || false,
  },
  guest: {
    enabled: data?.guest?.enabled || false,
  },
  direct: {
    enabled: data?.direct?.enabled || false,
  },
});
