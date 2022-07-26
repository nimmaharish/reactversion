import React, { useRef } from 'react';
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
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import { PaymentPartners } from 'containers/lazy';
import { isPayPalAllowed, isStripeAllowed } from 'utils/countries';
import Kbc from 'components/knowBaseCards/KnowBaseCards.jsx';
import Accordion from './Accordion';
import CustomPayments from './CustomPayments';
import styles from './paymentModeDesktop.module.css';
import { getInitialValues, schema } from './utils';

function PaymentModeDesktop() {
  const {
    paymentModes, country, accounts = []
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
        SnackBar.show('Please active atleast one partner', 'error');
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
          <div onClick={() => history.goBack()} className={styles.maintitle}>
            <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
            <div>&nbsp;</div>
            <div>&nbsp;</div>
            Payment Settings
          </div>
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
                  <PaymentPartners />
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
                      name="custompayment.enabled"
                      openDefault={values.custompayment.configured.length === 0}
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
          </div>
          <div className="flexCenter fullWidth">
            <Kbc
              type="enablePayments"
            />
          </div>
          <div ref={buttonRef} className={styles.button}>
            <Button
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
  );
}

PaymentModeDesktop.propTypes = {};

PaymentModeDesktop.defaultProps = {};

export default PaymentModeDesktop;
