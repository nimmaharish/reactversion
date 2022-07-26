import React from 'react';
import estimateDelivery from 'assets/overview/estimateDelivery.svg';
import { FormikInput, Button } from 'phoenix-components';
import { Select } from 'phoenix-components/lib/formik';
import { Formik, useField } from 'formik';
import { Becca } from 'api';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useShop, useRefreshShop } from 'contexts';
import EventManager from 'utils/events';
import styles from './ShippingTime.module.css';
import { getInitialValues, schema, typeOptions } from './utils';

function ShippingTimeDesktop({ isProduct, onBack }) {
  const { delivery: { shippingTime = {} } } = useShop();
  const history = useHistory();
  const [{ value: updated = {} }, , { setValue }] = isProduct
    ? useField('shippingTime') : [{ value: {} }, null, { setValue: null }];
  const refresh = useRefreshShop();

  const onSubmit = async (values) => {
    try {
      Loader.show();
      const { toItemValue, fromItemValue, itemType } = values;
      const from = { type: itemType, value: fromItemValue };
      const to = { type: itemType, value: toItemValue };
      if (!isProduct) {
        await Becca.updateShop({
          shippingTime: { from, to },
        });
        EventManager.emitEvent('shipping_time_added');
        refresh();
        SnackBar.show('updated successfully', 'success');
        history.goBack();
        return;
      }
      setValue({ from, to });
      if (Object.keys(shippingTime).length === 0) {
        await Becca.updateShop({
          shippingTime: { from, to },
        });
        refresh();
      }
      onBack();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const getInitial = () => {
    if (isProduct && Object.keys(updated).length > 0) {
      return getInitialValues(updated);
    }
    return getInitialValues(shippingTime);
  };

  return (
    <>
      <div className={styles.mainContainer}>
        <Formik
          validationSchema={schema}
          initialValues={getInitial()}
          onSubmit={onSubmit}
        >
          {({
            values,
            setFieldValue,
            submitForm,
          }) => (
            <div className={styles.container}>
              <div className={styles.formik}>
                <div className={styles.firstDiv}>
                  <FormikInput
                    label="Min. no. of days/hours to ship"
                    name="fromItemValue"
                    placeholder="Enter Days/Hours"
                    type="number"
                  />
                  <div className={styles.padding}>
                    Enter the least possible time it would take to
                    prepare and delivery your order
                  </div>
                </div>
                <div className={styles.select}>
                  <Select
                    label="Days/hours"
                    name="itemType"
                    onChange={(val) => {
                      setFieldValue('itemType', val.value);
                    }}
                    options={typeOptions}
                    value={typeOptions.find(x => x.value === values?.itemType)}
                  />
                </div>
              </div>
              <div className={styles.formik2}>
                <div className={styles.firstDiv}>
                  <FormikInput
                    label="Max. no. of days/hours to ship"
                    name="toItemValue"
                    placeholder="Enter Days/Hours"
                    type="number"
                    className={styles.input}
                  />
                  <div className={styles.padding}>
                    Enter the maximum time it would take to
                    prepare and deliver your order
                  </div>
                </div>
                <div className={styles.select}>
                  <Select
                    name="itemType"
                    label="Days/hours"
                    onChange={(val) => {
                      setFieldValue('itemType', val.value);
                    }}
                    options={typeOptions}
                    value={typeOptions.find(x => x.value === values?.itemType)}
                  />
                </div>
              </div>
              <div className={styles.preview}>
                Customer Preview
                <div className={styles.est}>
                  <img src={estimateDelivery} alt="" className={styles.img} />
                  {}
                  Estimated Delivery Time :
                  {' '}
                  {values?.fromItemValue}
                  {' '}
                  -
                  {' '}
                  {values?.toItemValue}
                  {' '}
                  {values?.itemType}
                </div>
                <div className={styles.bottom}>
                  Note: Please add 3-4 days to your order ready time to include pickup and delivery time
                  for the customer if shipping through 3rd party delivery partner.
                </div>
              </div>
              <div className="flexCenter">
                <Button
                  label="Save"
                  size="large"
                  onClick={submitForm}
                />
              </div>
            </div>
          )}
        </Formik>
      </div>
    </>
  );
}

ShippingTimeDesktop.propTypes = {
  isProduct: PropTypes.bool,
  onBack: PropTypes.func,
};

ShippingTimeDesktop.defaultProps = {
  isProduct: false,
  onBack: () => {}
};

export default ShippingTimeDesktop;
