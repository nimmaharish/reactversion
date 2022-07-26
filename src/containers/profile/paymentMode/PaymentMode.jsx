import React, { useRef } from 'react';
import { Drawer } from 'components/shared/Drawer';
import {
  Button, Card
} from 'phoenix-components';
import { Switch as DefaultSwitch } from 'phoenix-components';
import { Formik } from 'formik';
import {
  useRefreshShop,
  useShop
} from 'contexts/userContext';
import { useToggle } from 'hooks/common';
import SnackBar from 'services/snackbar';
import cx from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import { Becca } from 'api';
import Loader from 'services/loader';
import { PaymentPartners } from 'containers/lazy';
import { isPayPalAllowed, isStripeAllowed } from 'utils/countries';
import Kbc from 'components/knowBaseCards/KnowBaseCards.jsx';
import EventManager from 'utils/events';
import Accordion from './Accordion';
import CustomPayments from './CustomPayments';
import styles from './PaymentMode.module.css';
import { getInitialValues, schema } from './utils';

function PaymentMode() {
  const {
    paymentModes, country,
    accounts = []
  } = useShop();
  const isIndia = country?.toLowerCase() === 'india';
  const paymentsEnabled = accounts.filter(x => x.enabled).length > 0;
  const refreshShop = useRefreshShop();
  const history = useHistory();
  const location = useLocation();
  const stripeAllowed = isStripeAllowed(country);
  const payPalAllowed = isPayPalAllowed(country);
  const [openOnline, toggleOnline] = useToggle(false);
  const [openManual, toggleManual] = useToggle(false);
  const buttonRef = useRef();

  const defaultSwitchManual = (values) => {
    if (openManual) {
      return true;
    }
    if (isIndia) {
      return values.cod.enabled || values.custompayment.enabled;
    }
    if (stripeAllowed || payPalAllowed) {
      return values.cod.enabled || values.custompayment.enabled;
    }
    return values.cod.enabled;
  };

  const toggleSave = () => {
    if (buttonRef.current) {
      buttonRef.current.firstElementChild.click();
    }
  };

  const defaultSwitchManualChange = (setValue, val, isEmptyConfigured) => {
    if (isIndia || stripeAllowed || payPalAllowed) {
      setValue('cod.enabled', val);
      setValue('custompayment.enabled', val);
      if (isEmptyConfigured) {
        setValue('custompayment.enabled', false);
      }
      toggleSave();
      return;
    }

    setValue('cod.enabled', val);
    toggleSave();
  };

  const defaultSwitchOnline = (values) => {
    if (openOnline) {
      return true;
    }
    if (isIndia || stripeAllowed || payPalAllowed) {
      return values.online.enabled;
    }
    return values.custompayment.enabled;
  };

  const defaultSwitchOnlineChange = (setValue, val) => {
    if (isIndia) {
      setValue('online.enabled', val);
      toggleSave();
      return;
    }
    if (stripeAllowed || payPalAllowed) {
      if (!paymentsEnabled && val) {
        SnackBar.show('Please activate atleast one partner', 'error');
        return;
      }
      setValue('online.enabled', val);
      toggleSave();
      return;
    }
    setValue('custompayment.enabled', val);
    toggleSave();
  };

  const onSubmit = async (values) => {
    try {
      Loader.show();
      await Becca.updateShop({
        paymentModes: values,
      });
      EventManager.emitEvent('payments_enabled');
      SnackBar.show('Payment settings updated successfully', 'success');
      refreshShop();
      if (location?.state?.redirectTo) {
        history.push(location.state.redirectTo);
        return;
      }
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const onCodSelect = (setField) => (value) => {
    setField('cod.enabled', value);
    toggleSave();
  };

  return (
    <Drawer
      title="Payment Settings"
      containerClass={styles.drawer}
    >
      <Formik
        validationSchema={schema}
        initialValues={getInitialValues(paymentModes)}
        onSubmit={onSubmit}
      >
        {({
          values,
          setFieldValue,
          submitForm
        }) => (
          <div className={styles.container}>
            <div className={styles.main}>
              <div className={styles.heading}>Choose Payment Modes</div>
              <Card className={cx(styles.mode)}>
                <div className={cx(styles.cod, { [styles.active]: defaultSwitchOnline(values) })}>
                  <div className={styles.modeName}>Online</div>
                  <div>
                    <DefaultSwitch
                      active={defaultSwitchOnline(values)}
                      onChange={(e, val) => {
                        defaultSwitchOnlineChange(setFieldValue, val);
                        toggleOnline();
                      }}
                    />
                  </div>
                </div>
                {!stripeAllowed && !payPalAllowed && !isIndia && (
                  <Accordion
                    label="Direct Payments"
                    name="custompayment.enabled"
                    openDefault={values.custompayment.configured.length === 0}
                    onChange={(e) => {
                      if (values.custompayment.configured.length === 0 && !values.cod.enabled && e) {
                        SnackBar.show('Please add atleast one custom payment', 'error');
                        return;
                      }
                      setFieldValue('custompayment.enabled', e);
                      toggleSave();
                    }}
                  >
                    <CustomPayments toggleSave={toggleSave} />
                  </Accordion>
                )}
                {(defaultSwitchOnline(values)) && (stripeAllowed || payPalAllowed || isIndia) && (
                  <>
                    <div className={styles.charges}>
                      <PaymentPartners />
                    </div>
                  </>
                )}
              </Card>
              <Card className={cx(styles.mode)}>
                <div className={cx(styles.cod, { [styles.active]: defaultSwitchManual(values) })}>
                  <div className={styles.modeName}>Manual</div>
                  <div>
                    <DefaultSwitch
                      active={defaultSwitchManual(values)}
                      onChange={(e, val) => {
                        const isEmptyConfigured = values.custompayment.configured.length === 0;
                        defaultSwitchManualChange(setFieldValue, val, isEmptyConfigured);
                        toggleManual();
                      }}
                    />
                  </div>
                </div>
                {defaultSwitchManual(values) && (
                  <>
                    {(stripeAllowed || payPalAllowed || isIndia) && (
                      <Accordion
                        label="Custom Payments"
                        openDefault={values.custompayment.configured.length === 0}
                        name="custompayment.enabled"
                        onChange={(e) => {
                          if (values.custompayment.configured.length === 0 && e) {
                            SnackBar.show('Please add atleast one custom payment', 'error');
                            return;
                          }
                          if (values.custompayment.configured.filter(x => x.status === 'live').length === 0 && e) {
                            SnackBar.show('Please add atleast one custom payment', 'error');
                            return;
                          }
                          setFieldValue('custompayment.enabled', e);
                          toggleSave();
                        }}
                      >
                        <CustomPayments toggleSave={toggleSave} />
                      </Accordion>

                    )}
                    <Accordion
                      label="Cash"
                      name="cod.enabled"
                      onChange={onCodSelect(setFieldValue)}
                    >
                    </Accordion>
                  </>
                )}
              </Card>
              <div className={styles.kbc}>
                <Kbc
                  type="enablePayments"
                />
              </div>
            </div>
            <div ref={buttonRef} className={styles.button}>
              <Button
                fullWidth
                bordered={false}
                size="large"
                label="Save"
                onClick={async () => {
                  try {
                    await schema.validate(values, {
                      abortEarly: true
                    });
                    // submit form to show field errors
                    submitForm();
                  } catch (e) {
                    if (e.value.custompayment.enabled && e.value.custompayment.configured.length === 0) {
                      SnackBar.show('Please add atleast one custom payment', 'error');
                      return;
                    }
                    SnackBar.show('Please add all required fields', 'error');
                  }
                }}
              />
            </div>
          </div>
        )}
      </Formik>
    </Drawer>
  );
}

PaymentMode.propTypes = {};

PaymentMode.defaultProps = {};

export default PaymentMode;
