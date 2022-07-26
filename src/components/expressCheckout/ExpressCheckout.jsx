import React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import { SideDrawer } from 'components/shared/SideDrawer';
import { Drawer } from 'components/shared/Drawer';
import { Loading } from 'components/shared/Loading';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { useExpressCheckoutSettings } from 'hooks/common';
import { useDesktop } from 'contexts';
import { Becca } from 'api';
import ecIcon from 'assets/images/chat/expresscheckouticon.svg';
import cx from 'classnames';
import { Switch } from 'phoenix-components/lib/formik';
import activecheckout from 'assets/v2/common/activecheckoutflow.svg';
import styles from './ExpressCheckout.module.css';

export default function ExpressCheckout() {
  const [checkout, loading, refresh] = useExpressCheckoutSettings();
  const history = useHistory();
  const isDesktop = useDesktop();
  const Component = isDesktop ? SideDrawer : Drawer;

  const submitForm = async (values) => {
    try {
      Loader.show();
      await Becca.updateUiConfig('expressCheckout', values);
      refresh();
      SnackBar.show('chat settings updated successfully', 'success');
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Component
      title="Checkout Flow"
      backButton
      onClose={() => history.goBack()}
    >
      <Formik
        initialValues={{
          enabled: checkout.enabled,
        }}
        onSubmit={submitForm}
      >
        {({ values, submitForm }) => (
          <div
            className={cx(styles.mainContainer, {
              [styles.enabled]: values.enabled,
            })}
          >
            <div className={styles.container}>
              <div className={styles.row}>
                <img
                  src={values.enabled ? activecheckout : ecIcon}
                  alt=""
                  className={styles.image}
                />
                <div className={styles.heading}>
                  Enable Express Checkout
                </div>
                <Switch
                  name="enabled"
                  onChange={() => {
                    values.enabled = !values.enabled;
                    submitForm();
                  }}
                />
              </div>
              <div className={styles.subText}>
                Enable express checkout for customers for faster checkout.
              </div>
            </div>
          </div>
        )}
      </Formik>
    </Component>
  );
}
