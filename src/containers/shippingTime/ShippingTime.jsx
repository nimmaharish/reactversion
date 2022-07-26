import React from 'react';
import { Drawer } from 'components/shared/Drawer';
import estimateDelivery from 'assets/overview/estimateDelivery.svg';
import { Button, FormikInput } from 'phoenix-components';
import { Select } from 'phoenix-components/lib/formik';
import { Formik, useField } from 'formik';
import { Becca } from 'api';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import PropTypes from 'prop-types';
import Header from 'containers/products/Header';
import { useHistory } from 'react-router-dom';
import { useDesktop, useRefreshShop, useShop } from 'contexts';
import EventManager from 'utils/events';
import { SideDrawer } from 'components/shared/SideDrawer';
import { FooterButton } from 'components/common/FooterButton';
import styles from './ShippingTime.module.css';
import { getInitialValues, schema, typeOptions } from './utils';

function ShippingTime({
  isProduct,
  onBack
}) {
  const { delivery: { shippingTime = {} } } = useShop();
  const history = useHistory();
  const [{ value: updated = {} }, , { setValue }] = isProduct
    ? useField('shippingTime') : [{ value: {} }, null, { setValue: null }];
  const refresh = useRefreshShop();
  const isDesktop = useDesktop();

  const onSubmit = async (values) => {
    try {
      Loader.show();
      const {
        toItemValue,
        fromItemValue,
        itemType
      } = values;
      const from = {
        type: itemType,
        value: fromItemValue
      };
      const to = {
        type: itemType,
        value: toItemValue
      };
      if (!isProduct) {
        await Becca.updateShop({
          shippingTime: {
            from,
            to
          },
        });
        EventManager.emitEvent('shipping_time_added');
        refresh();
        SnackBar.show('updated successfully', 'success');
        history.goBack();
        return;
      }
      setValue({
        from,
        to
      });
      if (Object.keys(shippingTime).length === 0) {
        await Becca.updateShop({
          shippingTime: {
            from,
            to
          },
        });
        refresh();
      }
      onBack();
    } catch (e) {
      SnackBar.showError(e);
      console.log(e);
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

  if (isDesktop) {
    return (
      <>
        <Formik
          validationSchema={schema}
          initialValues={getInitial()}
          onSubmit={onSubmit}
        >
          {({
            values,
            setFieldValue,
            submitForm
          }) => (
            <SideDrawer
              backButton={true}
              title="Shipping Time"
              onClose={() => history.goBack()}
              onClick={() => submitForm()}
            >
              <div className={styles.desktopC}>
                <div className={styles.dtext}>
                  Shipping Time
                </div>
                <div className={styles.mainContainer}>
                  <div className={styles.container}>
                    <div className={styles.formik}>
                      <div className={styles.firstDiv}>
                        <FormikInput
                          label="Min. no. of days/hours to ship"
                          name="fromItemValue"
                          placeholder="Enter Days/Hours"
                          type="number"
                          inputClass={styles.input}
                        />
                        <div className={styles.padding}>
                          Enter the minimum no.of days/hours it takes
                          to get the order ready and ship
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
                    <div className={styles.formik}>
                      <div className={styles.firstDiv}>
                        <FormikInput
                          label="Max. no. of days/hours to ship"
                          name="toItemValue"
                          placeholder="Enter Days/Hours"
                          type="number"
                          inputClass={styles.input}
                        />
                        <div className={styles.padding}>
                          Enter the max no.of days/hours it takes
                          to get the order ready and ship
                        </div>
                      </div>
                      <div className={styles.select}>
                        <Select
                          name="itemType"
                          label="Days/hours"
                          isDisabled={true}
                          onChange={(val) => {
                            setFieldValue('itemType', val.value);
                          }}
                          options={typeOptions}
                          value={typeOptions.find(x => x.value === values?.itemType)}
                        />
                      </div>
                    </div>
                    <div className={styles.preview}>
                      Your Delivery Timeline
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
                      {/* <div className={styles.bottom}>
                        3-4 days will be added to your order ready time to include pickup and
                        delivery time for the customer
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.buttonD}>
                <Button
                  label="Save"
                  size="large"
                  onClick={submitForm}
                />
              </div>
            </SideDrawer>
          )}
        </Formik>
      </>

    );
  }

  return (
    <Drawer title="Shipping Timeline" hideHeader={isProduct}>
      {isProduct && <Header title="Shipping Time" onBack={onBack} />}
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
                    inputClass={styles.input}
                  />
                  <div className={styles.padding}>
                    Enter the minimum no.of days/hours it takes
                    to get the order ready and ship
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
                <div className={styles.firstDiv1}>
                  <FormikInput
                    label="Max. no. of days/hours to ship"
                    name="toItemValue"
                    placeholder="Enter Days/Hours"
                    type="number"
                    inputClass={styles.input}
                  />
                  <div className={styles.padding}>
                    Enter the max no.of days/hours it takes
                    to get the order ready and ship
                  </div>
                </div>
                <div className={styles.select}>
                  <Select
                    name="itemType"
                    label="Days/hours"
                    isDisabled={true}
                    onChange={(val) => {
                      setFieldValue('itemType', val.value);
                    }}
                    options={typeOptions}
                    value={typeOptions.find(x => x.value === values?.itemType)}
                  />
                </div>
              </div>
              <div className={styles.preview}>
                Your Delivery Timeline
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
                {/* <div className={styles.bottom}>
                  3-4 days will be added to your order ready time to include pickup and
                  delivery time for the customer
                </div> */}
              </div>
              <FooterButton>
                <Button
                  fullWidth
                  bordered={false}
                  label="Save"
                  size="large"
                  onClick={submitForm}
                />
              </FooterButton>
            </div>
          )}
        </Formik>
      </div>
    </Drawer>
  );
}

ShippingTime.propTypes = {
  isProduct: PropTypes.bool,
  onBack: PropTypes.func,
};

ShippingTime.defaultProps = {
  isProduct: false,
  onBack: () => {
  }
};

export default ShippingTime;
