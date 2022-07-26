import React from 'react';
import { Drawer } from 'components/shared/Drawer';
import { LoginCard } from 'containers/profile/checkout/LoginCard';
import { Formik } from 'formik';
import { getInitialValues, LOGIN_DATA } from 'containers/profile/checkout/loginUtils';
import { useDesktop, useRefreshShop, useShop } from 'contexts';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import { Becca } from 'api';
import { Button } from 'phoenix-components';
import PropTypes from 'prop-types';
import { SideDrawer } from 'components/shared/SideDrawer';
import styles from './LoginSettings.module.css';

function LoginSettings({ onClose }) {
  const shop = useShop();
  const refreshShop = useRefreshShop();
  const isDesktop = useDesktop();

  const onSave = async (login) => {
    try {
      Loader.show();
      const data = shop?.checkout || {};
      const types = Object.keys(LOGIN_DATA);
      const enabled = types.find((type) => !!login[type]?.enabled);
      if (!enabled) {
        SnackBar.show('You must enable atleast one mode of login', 'error');
        return;
      }
      data.login = login;
      await Becca.updateShop({ checkout: data });
      SnackBar.show('Login settings saved successfully', 'success');
      refreshShop();
      onClose();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const Component = isDesktop ? SideDrawer : Drawer;

  return (
    <Formik
      initialValues={getInitialValues(shop?.checkout?.login)}
      onSubmit={onSave}
    >
      {({ submitForm }) => (
        <Component
          title="Login Settings"
          backButton={true}
          onClose={onClose}
        >
          <div className={styles.container}>
            <LoginCard name="email" />
            <LoginCard name="google" featured={true} />
            <LoginCard name="whatsapp" featured={true} />
            <LoginCard name="phone" featured={true} />
            <LoginCard name="guest" featured={true} />
            <div className="flexCenter">
              <div className={styles.line}></div>
              <div className={styles.text}>OR</div>
              <div className={styles.line}></div>
            </div>
            <LoginCard name="direct" featured={true} />
          </div>
          {isDesktop ? (
            <div className={styles.buttonD}>
              <Button label="Save" size="large" bordered={true} onClick={submitForm} />
            </div>
          ) : (
            <div className={styles.button}>
              <Button fullWidth label="save" onClick={submitForm} size="large" bordered={false} />
            </div>
          )}
        </Component>
      )}
    </Formik>
  );
}

LoginSettings.propTypes = {
  onClose: PropTypes.func.isRequired,
};

LoginSettings.defaultProps = {};

export default LoginSettings;
