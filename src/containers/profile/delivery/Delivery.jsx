import React from 'react';
import { Drawer } from 'components/shared/Drawer';
import { FormControlLabel } from '@material-ui/core';
import { Field, Formik } from 'formik';
import { RadioGroup } from 'formik-material-ui';
import { PrimaryRadio } from 'components/coupons/Radio.jsx';
import { DeliveryType, getInitialValues } from 'components/profile/delivery/utils';
import {
  ConditionalDelivery, DistanceDelivery, FixedDelivery, ShippingDelivery
} from 'components/profile/delivery';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { Becca } from 'api';
import starIcon from 'assets/overview/star.svg';
import { useHistory } from 'react-router-dom';
import { Button } from 'phoenix-components';
import { useQueryParams } from 'hooks';
import {
  useIsConditionalChargesEnabled
} from 'contexts/userContext';
import EventManager from 'utils/events';
import { useDesktop } from 'contexts';
import { SideDrawer } from 'components/shared/SideDrawer';
import { FooterButton } from 'components/common/FooterButton';
import { useChargeConfig } from 'hooks/areasServed';
import { Loading } from 'components/shared/Loading';
import { deliverySchema } from './schema';
import styles from './Delivery.module.css';

function Delivery() {
  const params = useQueryParams();
  const history = useHistory();
  const isConditionalChargesEnabled = useIsConditionalChargesEnabled();
  const [chargeConfig, refresh, loading] = useChargeConfig();
  const isDesktop = useDesktop();

  if (loading) {
    return <Loading />;
  }

  const onSubmit = async (values) => {
    try {
      Loader.show();
      if (values.chargeType !== 'fixed' && values.chargeType !== 'free') {
        if (!isConditionalChargesEnabled) {
          params.set('openPlans', 'generic');
          history.push({
            search: params.toString(),
          });
          return;
        }
      }
      await Becca.updateChargeConfig(values);
      EventManager.emitEvent('delivery_details_added', {
        type: values.chargeType,
      });
      SnackBar.show('Delivery charges saved!', 'success');
      refresh();
      history.goBack();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const onShippingTypeChange = async (type) => onSubmit({
    ...chargeConfig,
    chargeType: type,
  });

  if (isDesktop) {
    return (
      <Formik
        validationSchema={deliverySchema}
        initialValues={getInitialValues(chargeConfig || {})}
        onSubmit={onSubmit}
      >
        {({ submitForm }) => (
          <SideDrawer
            backButton={true}
            title="Delivery Charges"
            onClose={() => history.goBack()}
            onClick={() => submitForm()}
          >
            <div className={styles.container}>
              <>
                <Field
                  component={RadioGroup}
                  name="chargeType"
                >
                  <div className={styles.card}>
                    <FormControlLabel
                      control={<PrimaryRadio />}
                      label="Free delivery"
                      value={DeliveryType.FREE}
                    />
                  </div>
                  <div className={styles.card}>
                    <FormControlLabel
                      control={<PrimaryRadio />}
                      label="Fixed Delivery Charge"
                      value={DeliveryType.FIXED}
                    />
                    <FixedDelivery />
                  </div>
                  <div className={styles.card}>
                    <FormControlLabel
                      control={<PrimaryRadio />}
                      label="Delivery Charge by Order Value"
                      value={DeliveryType.CONDITIONAL} />
                    <ConditionalDelivery />
                    {!isConditionalChargesEnabled && (<img className={styles.iconF} src={starIcon} alt="" />)}
                  </div>
                  <div className={styles.card2}>
                    <div>
                      <FormControlLabel
                        control={<PrimaryRadio />}
                        label="Delivery Charge by Zone"
                        value={DeliveryType.AREA} />
                      <DistanceDelivery onRefresh={refresh} />
                    </div>
                    {!isConditionalChargesEnabled && (<img className={styles.iconF} src={starIcon} alt="" />)}
                  </div>
                  <div className={styles.card2}>
                    <div>
                      <FormControlLabel
                        control={<PrimaryRadio />}
                        label="Delivery Charge by Mode"
                        value={DeliveryType.SHIPPING} />
                      <ShippingDelivery onTypeChange={onShippingTypeChange} />
                    </div>
                    {!isConditionalChargesEnabled && (<img className={styles.iconF} src={starIcon} alt="" />)}
                  </div>
                </Field>
              </>
              <br />
              <br />
              <div className={styles.buttonD}>
                <Button
                  label="Save"
                  size="large"
                  onClick={submitForm}
                  style={styles.button}
                />
              </div>
            </div>
          </SideDrawer>
        )}
      </Formik>
    );
  }

  return (
    <Drawer
      title="Delivery Charges"
      containerClass={styles.drawer}
      topBarClass={styles.drawer}
    >
      <div className={styles.container}>
        <Formik
          validationSchema={deliverySchema}
          initialValues={getInitialValues(chargeConfig)}
          onSubmit={onSubmit}
        >
          {({ submitForm }) => (
            <>
              <Field
                component={RadioGroup}
                name="chargeType"
              >
                <div className={styles.card}>
                  <FormControlLabel
                    control={<PrimaryRadio />}
                    label="Free delivery"
                    value={DeliveryType.FREE}
                  />
                </div>
                <div className={styles.card}>
                  <FormControlLabel
                    control={<PrimaryRadio />}
                    label="Fixed Delivery Charge"
                    value={DeliveryType.FIXED}
                  />
                  <FixedDelivery />
                </div>
                <div className={styles.card}>
                  <FormControlLabel
                    control={<PrimaryRadio />}
                    label="Delivery Charge by Order Value"
                    value={DeliveryType.CONDITIONAL} />
                  <ConditionalDelivery />
                  {!isConditionalChargesEnabled && (<img className={styles.iconF} src={starIcon} alt="" />)}
                </div>
                <div className={styles.card2}>
                  <div>
                    <FormControlLabel
                      control={<PrimaryRadio />}
                      label="Delivery Charge by Zone"
                      value={DeliveryType.AREA} />
                    <DistanceDelivery onRefresh={refresh} />
                  </div>
                  {/* <Clickable onClick={toggleSelect} className={styles.iconR}>
                    <span className={styles.config}>View Config</span>
                  </Clickable>
                  {select && <DistanceDelivery onClose={toggleSelect} onRefresh={refresh} />} */}
                  {!isConditionalChargesEnabled && (<img className={styles.iconF} src={starIcon} alt="" />)}
                </div>
                <div className={styles.card2}>
                  <div>
                    <FormControlLabel
                      control={<PrimaryRadio />}
                      label="Delivery Charge by Mode"
                      value={DeliveryType.SHIPPING} />
                    <ShippingDelivery onTypeChange={onShippingTypeChange} />
                  </div>
                  {!isConditionalChargesEnabled && (<img className={styles.iconF} src={starIcon} alt="" />)}
                </div>
              </Field>
              <FooterButton>
                <Button
                  fullWidth
                  bordered={false}
                  label="Save"
                  size="large"
                  onClick={submitForm}
                  style={styles.button}
                />
              </FooterButton>
            </>
          )}
        </Formik>
        <br />
        <br />
      </div>
    </Drawer>
  );
}

Delivery.propTypes = {};

Delivery.defaultProps = {};

export default Delivery;
