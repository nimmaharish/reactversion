import React from 'react';
import { Formik, useField } from 'formik';
import { SideDrawer } from 'components/shared/SideDrawer';
import { Button } from 'phoenix-components';
import cx from 'classnames';
import {
  useDesktop, useOpenPlans, useRefreshShop, useShop
} from 'contexts';
import { Drawer } from 'components/shared/Drawer';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import { useToggle } from 'hooks/common';
import { FooterButton } from 'components/common/FooterButton';
import { useIsConditionalChargesEnabled } from 'contexts/userContext';
import { Becca } from 'api';
import PropTypes from 'prop-types';
import ShippingCard from './ShippingCard';
import { DeliveryType } from './utils';
import { getInitialValues, marhsalData } from './ShippingUtils';
import styles from './ShippingDelivery.module.css';

export function ShippingDelivery({ onTypeChange }) {
  const refreshShop = useRefreshShop();
  const isDesktop = useDesktop();
  const [viewConfig, toggleConfig] = useToggle(true);
  const [{ value: type }] = useField('chargeType');
  const isConditionalChargesEnabled = useIsConditionalChargesEnabled();
  const { delivery } = useShop();
  const openPlans = useOpenPlans();

  const onSubmit = async (values) => {
    try {
      Loader.show();
      await Becca.updateShop({
        delivery: {
          ...delivery,
          shippingModes: marhsalData(values),
        }
      });
      await onTypeChange('shipping');
      SnackBar.show('Successfully Updated');
      refreshShop();
      toggleConfig();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  if (type !== DeliveryType.SHIPPING) {
    return null;
  }

  if (viewConfig) {
    return (
      <div className={cx('flexBetween', styles.view)}>
        <Button
          label="View Config"
          primary={false}
          size="medium"
          onClick={isConditionalChargesEnabled ? toggleConfig : openPlans}
        />
      </div>
    );
  }

  const Component = isDesktop ? SideDrawer : Drawer;
  return (
    <Component
      title="Delivery Charge by Mode"
      backButton
      onClose={toggleConfig}
    >
      <Formik
        initialValues={getInitialValues(delivery?.shippingModes)}
        onSubmit={onSubmit}
      >
        {({
          values,
          submitForm
        }) => (
          <>
            {values?.map((mode, index) => (
              <ShippingCard
                key={index}
                index={index}
              />
            ))}
            {isDesktop
              ? (
                <div className={styles.btnDesk}>
                  <div>
                    <Button
                      onClick={submitForm}
                      bordered={true}
                      className={styles.dBtn}
                      label="save"
                      size="large"
                    />
                  </div>
                </div>
              )
              : (
                <FooterButton>
                  <Button
                    fullWidth
                    bordered={false}
                    label="Save"
                    size="large"
                    onClick={submitForm}
                  />
                </FooterButton>
              )}
          </>
        )}
      </Formik>
    </Component>
  );
}

ShippingDelivery.propTypes = {
  onTypeChange: PropTypes.func.isRequired,
};
