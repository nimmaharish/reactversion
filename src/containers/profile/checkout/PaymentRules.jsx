import React from 'react';
import { Drawer } from 'components/shared/Drawer';
import { Formik } from 'formik';
import {
  useDesktop, usePaymentRules, useRefreshShop, useShop
} from 'contexts';
import Loader from 'services/loader';
import { Becca } from 'api';
import SnackBar from 'services/snackbar';
import { PaymentRuleCard } from 'containers/profile/checkout/PaymentRuleCard';
import { Button } from 'phoenix-components';
import PropTypes from 'prop-types';
import { FooterButton } from 'components/common/FooterButton';
import { SideDrawer } from 'components/shared/SideDrawer';
import emptyIcon from 'assets/v2/settings/checkout/emptyPaymentRules.svg';
import { useHistory } from 'react-router-dom';
import styles from './PaymentRules.module.css';
import { marshall, schema } from './paymentRuleUtils';

function PaymentRules({ onClose }) {
  const shop = useShop();
  const paymentRules = usePaymentRules(false);
  const refreshShop = useRefreshShop();
  const isDesktop = useDesktop();
  const history = useHistory();

  const onActivatePayments = () => {
    history.push('/manage/paymentModes');
  };

  const onSave = async (values) => {
    try {
      Loader.show();
      const checkout = shop?.checkout || {};
      const checkIfPartialCodEnabled = values.find(x => x.type === 'cod')?.partial?.type?.length > 0
       && values.find(x => x.type === 'cod')?.partial?.value !== 0;
      if (checkIfPartialCodEnabled) {
        const checkIfAnyPaymentModeEnabled = shop?.paymentModes?.online?.enabled
        || shop?.paymentModes?.custompayment?.enabled;
        if (!checkIfAnyPaymentModeEnabled) {
          SnackBar.showError('Any one payment should be enabled other than cash');
          return;
        }
      }
      checkout.paymentRules = marshall(values);
      await Becca.updateShop({ checkout });
      SnackBar.show('Payment rules saved successfully', 'success');
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
      initialValues={paymentRules}
      validationSchema={schema}
      onSubmit={onSave}
    >
      {({ values = [], submitForm }) => (
        <Component
          title="Payment Rules"
          backButton
          onClose={onClose}
        >
          {paymentRules.length === 0 && (
            <div className={styles.empty}>
              <img src={emptyIcon} alt="" />
              <span>
                No payment modes enabled.
              </span>
              <Button
                label="Activate Payments"
                onClick={onActivatePayments}
              />
            </div>
          )}
          {paymentRules.length > 0 && (
            <div className={styles.container}>
              {values.map((_v, idx) => (
                <PaymentRuleCard key={idx} index={idx} partial={values[idx].type === 'cod'} />
              ))}
            </div>
          )}
          {paymentRules?.length > 0 && (
            <>
              {isDesktop ? (
                <div className={styles.buttonD}>
                  <Button label="Save" size="large" bordered={true} onClick={submitForm} />
                </div>
              ) : (
                <FooterButton>
                  <Button label="Save" size="large" bordered={false} fullWidth onClick={submitForm} />
                </FooterButton>
              )}
            </>
          )}
        </Component>
      )}
    </Formik>
  );
}

PaymentRules.propTypes = {
  onClose: PropTypes.func.isRequired,
};

PaymentRules.defaultProps = {};

export default PaymentRules;
