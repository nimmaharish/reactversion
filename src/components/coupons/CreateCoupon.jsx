import React, { useState } from 'react';
import { Drawer } from 'components/shared/Drawer';
import { FormControlLabel, Grid } from '@material-ui/core';
import { Field, Formik } from 'formik';
import { RadioGroup } from 'formik-material-ui';
import { CouponLevel, DiscountType } from 'constants/coupon';
import { BlackRadio } from 'components/coupons/BlackRadio';
import { FooterButton } from 'components/common/FooterButton';
import calendarIcon from 'assets/images/coupons/calendar.svg';
import removeIcon from 'assets/images/coupons/remove.svg';
import { ProductsDrawer } from 'components/shared/ProductsDrawer';
import { ListProducts } from 'components/coupons/ListProducts';
import { KeyboardDateTimePicker } from 'formik-material-ui-pickers';
import { Snitch } from 'api';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import { useQueryParams } from 'hooks';
import { useCoupon } from 'hooks/coupons';
import { Loading } from 'components/shared/Loading';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import Kbc from 'components/knowBaseCards/KnowBaseCards';
import {
  FormikInput, Select, Button as Btn, Card
} from 'phoenix-components';
import usedTag from 'assets/images/coupons/used.svg';
import Add from 'assets/images/coupons/add.svg';
import moment from 'moment';
import { useOpenPlans } from 'contexts';
import { useIsCouponsEnabled, useIsStripeEnabledCountry, useShop } from 'contexts/userContext';
import EventManager from 'utils/events';
import online from 'assets/v2/settings/paymentModes/online.svg';
import cash from 'assets/v2/settings/paymentModes/cod.svg';
import custom from 'assets/v2/settings/paymentModes/custom.svg';
import checkedIcon from 'assets/images/orders/multi/check.svg';
import unCheckedIcon from 'assets/images/orders/multi/uncheck.svg';
import { SideDrawer } from 'components/shared/SideDrawer';
import { useDesktop } from 'contexts';
import ProductsPopUp from '../../containers/products/Drawers/ProductPopUp.jsx';
import styles from './CreateCoupon.module.css';
import { couponSchema } from './schema';
import { getInitialValues } from './utils';

export function CreateCoupon({ refresh }) {
  const [open, setOpen] = useState(false);
  const params = useQueryParams();
  const history = useHistory();
  const shop = useShop();
  const { paymentModes } = shop;
  const [coupon] = useCoupon(params.get('coupon'));
  const openPlans = useOpenPlans(false, 'coupons');
  const isCouponsEnabled = useIsCouponsEnabled();
  const isStripeEnabledCountry = useIsStripeEnabledCountry();
  const isIndia = shop?.country?.toLowerCase() === 'india';
  const id = params.get('coupon');
  const isDesktop = useDesktop();

  const discountOptions = [
    { label: 'Shop', value: CouponLevel.SHOP },
    { label: 'Products', value: CouponLevel.PRODUCT }
  ];

  const onSubmit = async (data, helpers) => {
    if (!isCouponsEnabled) {
      openPlans();
      return;
    }
    helpers.setSubmitting(true);
    try {
      data.code = data.code.toUpperCase();
      Loader.show();
      if (!id) {
        await Snitch.createCoupon(data);
        EventManager.emitEvent('coupon_created', {
          code: data.code,
        });
      } else {
        await Snitch.updateCoupon(coupon._id, _.omit(data, ['_id', '__v', 'used', 'createdAt', 'updatedAt', 'shopId']));
      }
      SnackBar.show(`Coupon ${!id ? 'created' : 'updated'} successfully`, 'success');
      history.push('/coupons');
      refresh();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
      helpers.setSubmitting(false);
    }
  };

  const onClose = (setField) => (ids) => {
    setOpen(false);
    setField('products', ids);
  };

  const isProduct = (val) => val.level === CouponLevel.PRODUCT;

  if (!!id && !coupon) {
    return (
      <Loading />
    );
  }

  if (isDesktop) {
    return (
      <>
        <Formik initialValues={getInitialValues(coupon || {})} validationSchema={couponSchema} onSubmit={onSubmit}>
          {({
            values,
            errors,
            touched,
            setFieldValue,
            submitForm,
          }) => (
            <SideDrawer
              backButton={true}
              title={id ? 'Update Discount Coupon' : 'Create Discount Coupon'}
              onClose={() => history.goBack()}
            >
              <div className={styles.container}>
                <div className={styles.container1}>
                  <div className={styles.topBar}>
                    <Field
                      className={styles.discountRadioContainer}
                      component={RadioGroup}
                      name="type"
                    >
                      <FormControlLabel
                        control={<BlackRadio />}
                        label="Flat Discount"
                        onChange={() => setFieldValue('value', '')}
                        value={DiscountType.FLAT}
                      />
                      <FormControlLabel
                        control={<BlackRadio />}
                        label="Percentage"
                        onChange={() => setFieldValue('value', '')}
                        value={DiscountType.PERCENTAGE}
                      />
                    </Field>
                    <div>
                      <div className={styles.radio}>
                        {id && (
                          <div className={styles.usedContainer}>
                            <img src={usedTag} alt="" />
                            <div className={styles.usedNumber}>{coupon.used}</div>
                            <div className={styles.usedTitle}>Used</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles.heading}>Coupon Details</div>
                  <Grid item xs={12} className={styles.grid}>
                    <FormikInput
                      variant="outlined"
                      name="code"
                      type="text"
                      label="Enter Coupon Code"
                      placeholder="Type Coupon Code"
                    />
                  </Grid>
                  <Grid item xs={12} className={styles.grid}>
                    <FormikInput
                      variant="outlined"
                      name="value"
                      type="number"
                      label={values.type === DiscountType.FLAT ? 'Flat Discount Value' : 'Discount Percentage'}
                      placeholder={values.type === DiscountType.FLAT ? 'Enter Value' : 'Enter Percentage %'}
                    />
                  </Grid>
                  <Grid item xs={12} className={styles.grid}>
                    <FormikInput
                      variant="outlined"
                      name="minOrderValue"
                      type="number"
                      label="Enter Minimum Order Value"
                      placeholder="e.g. 100"
                    />
                  </Grid>
                  {values.type === DiscountType.PERCENTAGE && (
                    <div className={styles.grid}>
                      <FormikInput
                        type="number"
                        variant="outlined"
                        name="maxValue"
                        label="Max Discount Value"
                        placeholder="Enter Value"
                      />
                    </div>
                  )}
                  <div className={styles.heading}>Other Details</div>
                  <Grid item xs={12} className={styles.grid}>
                    <Select
                      placeholder="Select"
                      label="Discount is Applicable on?"
                      name="level"
                      onChange={(val) => {
                        setFieldValue('level', val.value);
                      }}
                      value={discountOptions.find(x => x.value === values.level)}
                      options={discountOptions}
                      validate={true}
                    />
                    {errors.level && touched.level && <div className={styles.error}>This is a required field</div>}
                  </Grid>
                  {open && (
                    <ProductsPopUp
                      title="Select Products"
                      initial={values.products}
                      onClose={onClose(setFieldValue)}
                    />
                  )}
                  {isProduct(values) && (
                    <div>
                      <div className={styles.productBar}>
                        <Btn
                          primary={false}
                          className={styles.addButton}
                          onClick={() => setOpen(true)}
                          label="Add Products"
                          startIcon={Add}
                        />
                      </div>
                      {values.products?.length > 0 && <ListProducts products={values.products} />}
                    </div>
                  )}

                  <Grid item xs={12} className={styles.grid}>
                    <FormikInput
                      type="number"
                      variant="outlined"
                      name="limits.user"
                      label="User limit"
                      placeholder="Enter limit"
                    />
                  </Grid>
                  <div className={styles.valueFields}>
                    How many times a single user can use this coupon?
                  </div>
                  <Card
                    className={styles.onlineCard}
                    outlined={true}
                  >
                    <div className={styles.cardContainer}>
                      Select Payment Mode
                      <div className={styles.description}>
                        Choose payment mode on which this discount
                        coupon is applicable
                      </div>
                      <>
                        {paymentModes?.online?.enabled && (isStripeEnabledCountry || isIndia) && (
                          <div className={styles.optionContainer}>
                            <div className={styles.contentHead}>
                              <div className={styles.contentIcon}>
                                <img src={online} alt="" />
                              </div>
                              <div
                                className={styles.contentHeading1}
                              >
                                Online
                              </div>
                              <div className={styles.checkbox}>
                                <img
                                  onClick={() => setFieldValue('paymentModes.online', !(values?.paymentModes?.online))}
                                  src={values?.paymentModes?.online ? checkedIcon : unCheckedIcon}
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        {paymentModes?.custompayment?.enabled && (
                          <>
                            <div className={styles.line}></div>
                            <div className={styles.optionContainer}>
                              <div className={styles.contentHead}>
                                <div className={styles.contentIcon}>
                                  <img src={custom} alt="" />
                                </div>
                                <div
                                  className={styles.contentHeading1}
                                >
                                  {isStripeEnabledCountry || isIndia ? 'Custom Payments' : 'Online'}
                                </div>
                                <div className={styles.checkbox}>
                                  <img
                                    onClick={() => setFieldValue('paymentModes.custompayment',
                                      !(values?.paymentModes?.custompayment))}
                                    src={values?.paymentModes?.custompayment ? checkedIcon : unCheckedIcon}
                                    alt="" />
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        {paymentModes?.cod?.enabled && (
                          <>
                            <div className={styles.line}></div>
                            <div className={styles.optionContainer}>
                              <div className={styles.contentHead}>
                                <div className={styles.contentIcon}>
                                  <img src={cash} alt="" />
                                </div>
                                <div
                                  className={styles.contentHeading1}
                                >
                                  Cash
                                </div>
                                <div className={styles.checkbox}>
                                  <img
                                    onClick={() => setFieldValue('paymentModes.cod', !(values?.paymentModes?.cod))}
                                    src={values?.paymentModes?.cod ? checkedIcon : unCheckedIcon}
                                    alt=""
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    </div>

                  </Card>
                  <div className={styles.expiryGrid}>
                    <Grid item xs={6} className={styles.grid1}>
                      <div className={styles.selectExpiry}>
                        Select Expiry Date
                      </div>
                    </Grid>
                    <div className={styles.expiryContainer}>
                      <Field
                        component={KeyboardDateTimePicker}
                        name="expiresAt"
                        description="Select Date"
                        className={styles.datePicker}
                        disablePast={true}
                        keyboardIcon={
                          !values.expiresAt._isValid
                            ? <img src={calendarIcon} alt="" />
                            : <img src={removeIcon} onClick={() => setFieldValue('expiresAt', {})} alt="" />
                        }
                        minDate={moment().add(1, 'day')}
                        labelFunc={(date) => date.format('DD-MMM-YYYY hh:mm A')}
                      />
                    </div>
                  </div>
                  {/*  type="number" */}
                  {/*  variant="outlined" */}
                  {/*  component={TextField} */}
                  {/*  fullWidth */}
                  {/*  className={styles.textField} */}
                  {/*  name="limits.overall" */}
                  {/*  label="Overall limit" */}
                  {/*  placeholder="Overall limit" */}
                  {/*  helperText="Overall, how many times this coupon can be used across all users?" */}
                  {/* /> */}
                  <Grid item xs={12}>
                    <FormikInput
                      type="textarea"
                      rows={4}
                      variant="outlined"
                      name="description"
                      label="About Coupon"
                      placeholder="Type about coupon"
                    />
                  </Grid>
                  <Kbc type="discountCoupon" />
                  <div className={styles.buttonD}>
                    <Btn
                      onClick={submitForm}
                      size="large"
                      label="Save"
                      bordered={true}
                    />
                  </div>
                </div>
              </div>
            </SideDrawer>
          )}
        </Formik>
      </>
    );
  }

  return (
    <Drawer title={id ? 'Update Discount Coupon' : 'Create Discount Coupon'}>
      <Formik
        initialValues={getInitialValues(coupon || {}, paymentModes)}
        validationSchema={couponSchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          submitForm,
        }) => (
          <div className={styles.container}>
            <div className={styles.container1}>
              <div className={styles.topBar}>
                <Field
                  className={styles.discountRadioContainer}
                  component={RadioGroup}
                  name="type"
                >
                  <FormControlLabel
                    control={<BlackRadio />}
                    label="Flat Discount"
                    onChange={() => setFieldValue('value', '')}
                    value={DiscountType.FLAT}
                  />
                  <FormControlLabel
                    control={<BlackRadio />}
                    label="Percentage"
                    onChange={() => setFieldValue('value', '')}
                    value={DiscountType.PERCENTAGE}
                  />
                </Field>
                <div>
                  <div className={styles.radio}>
                    {id && (
                      <div className={styles.usedContainer}>
                        <img src={usedTag} alt="" />
                        <div className={styles.usedNumber}>{coupon.used}</div>
                        <div className={styles.usedTitle}>Used</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.heading}>Coupon Details</div>
              <Grid item xs={12} className={styles.grid}>
                <FormikInput
                  variant="outlined"
                  name="code"
                  type="text"
                  label="Enter Coupon Code"
                  placeholder="Type Coupon Code"
                />
              </Grid>
              <Grid item xs={12} className={styles.grid}>
                <FormikInput
                  variant="outlined"
                  name="value"
                  type="number"
                  label={values.type === DiscountType.FLAT ? 'Flat Discount Value' : 'Discount Percentage'}
                  placeholder={values.type === DiscountType.FLAT ? 'Enter Value' : 'Enter Percentage %'}
                />
              </Grid>
              <Grid item xs={12} className={styles.grid}>
                <FormikInput
                  variant="outlined"
                  name="minOrderValue"
                  type="number"
                  label="Enter Minimum Order Value"
                  placeholder="e.g. 100"
                />
              </Grid>
              {values.type === DiscountType.PERCENTAGE && (
                <div className={styles.grid}>
                  <FormikInput
                    type="number"
                    variant="outlined"
                    name="maxValue"
                    label="Max Discount Value"
                    placeholder="Enter Value"
                  />
                </div>
              )}
              <div className={styles.heading}>Other Details</div>
              <Grid item xs={12} className={styles.grid}>
                <Select
                  placeholder="Select"
                  label="Discount is Applicable on?"
                  name="level"
                  onChange={(val) => {
                    setFieldValue('level', val.value);
                  }}
                  value={discountOptions.find(x => x.value === values.level)}
                  options={discountOptions}
                  validate={true}
                />
                {errors.level && touched.level && <div className={styles.error}>This is a required field</div>}
              </Grid>
              {open && (
                <ProductsDrawer
                  title="Select Products"
                  initial={values.products}
                  onClose={onClose(setFieldValue)}
                />
              )}
              {isProduct(values) && (
                <div>
                  <div className={styles.productBar}>
                    <Btn
                      primary={false}
                      className={styles.addButton}
                      onClick={() => setOpen(true)}
                      label="Add Products"
                      startIcon={Add}
                    />
                  </div>
                  {values.products?.length > 0 && <ListProducts products={values.products} />}
                </div>
              )}

              <Grid item xs={12} className={styles.grid}>
                <FormikInput
                  type="number"
                  variant="outlined"
                  name="limits.user"
                  label="User limit"
                  placeholder="Enter limit"
                />
              </Grid>
              <div className={styles.valueFields}>
                How many times a single user can use this coupon?
              </div>
              <Card
                className={styles.onlineCard}
                outlined={true}
              >
                <div className={styles.cardContainer}>
                  Select Payment Mode
                  <div className={styles.description1}>
                    Choose payment mode on which this discount
                    coupon is applicable
                  </div>
                  <>
                    {paymentModes?.online?.enabled && (isStripeEnabledCountry || isIndia) && (
                      <div className={styles.optionContainer}>
                        <div className={styles.contentHead}>
                          <div className={styles.contentIcon}>
                            <img src={online} alt="" />
                          </div>
                          <div
                            className={styles.contentHeading1}
                          >
                            Online
                          </div>
                          <div className={styles.checkbox}>
                            <img
                              onClick={() => setFieldValue('paymentModes.online', !(values?.paymentModes?.online))}
                              src={values?.paymentModes?.online ? checkedIcon : unCheckedIcon}
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    {paymentModes?.custompayment?.enabled && (
                      <>
                        <div className={styles.line}></div>
                        <div className={styles.optionContainer}>
                          <div className={styles.contentHead}>
                            <div className={styles.contentIcon}>
                              <img src={custom} alt="" />
                            </div>
                            <div
                              className={styles.contentHeading1}
                            >
                              {isStripeEnabledCountry || isIndia ? 'Custom Payments' : 'Online'}
                            </div>
                            <div className={styles.checkbox}>
                              <img
                                onClick={() => setFieldValue('paymentModes.custompayment',
                                  !(values?.paymentModes?.custompayment))}
                                src={values?.paymentModes?.custompayment ? checkedIcon : unCheckedIcon}
                                alt="" />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {paymentModes?.cod?.enabled && (
                      <>
                        <div className={styles.line}></div>
                        <div className={styles.optionContainer}>
                          <div className={styles.contentHead}>
                            <div className={styles.contentIcon}>
                              <img src={cash} alt="" />
                            </div>
                            <div
                              className={styles.contentHeading1}
                            >
                              Cash
                            </div>
                            <div className={styles.checkbox}>
                              <img
                                onClick={() => setFieldValue('paymentModes.cod', !(values?.paymentModes?.cod))}
                                src={values?.paymentModes?.cod ? checkedIcon : unCheckedIcon}
                                alt=""
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                </div>

              </Card>
              <div className={styles.expiryGrid}>
                <Grid item xs={6} className={styles.grid1}>
                  <div className={styles.selectExpiry}>
                    Select Expiry Date
                  </div>
                </Grid>
                <Grid item xs={6} className={styles.expiryContainer}>
                  <Field
                    component={KeyboardDateTimePicker}
                    name="expiresAt"
                    description="Select Date"
                    className={styles.datePicker}
                    disablePast={true}
                    keyboardIcon={
                      !values.expiresAt._isValid
                        ? <img src={calendarIcon} alt="" />
                        : <img src={removeIcon} onClick={() => setFieldValue('expiresAt', {})} alt="" />
                    }
                    minDate={moment().add(1, 'day')}
                    labelFunc={(date) => date.format('DD-MMM-YYYY hh:mm A')}
                  />
                </Grid>
              </div>
              {/*  type="number" */}
              {/*  variant="outlined" */}
              {/*  component={TextField} */}
              {/*  fullWidth */}
              {/*  className={styles.textField} */}
              {/*  name="limits.overall" */}
              {/*  label="Overall limit" */}
              {/*  placeholder="Overall limit" */}
              {/*  helperText="Overall, how many times this coupon can be used across all users?" */}
              {/* /> */}
              <Grid item xs={12}>
                <FormikInput
                  type="textarea"
                  rows={4}
                  variant="outlined"
                  name="description"
                  label="About Coupon"
                  placeholder="Give customers a walk-through of this coupon!"
                />
              </Grid>
              <Kbc type="discountCoupon" />
            </div>
            <FooterButton>
              <Btn
                onClick={submitForm}
                size="large"
                label="Save"
                fullWidth
                bordered={false}
              // style={styles.submitButton}
              />
            </FooterButton>
          </div>
        )}
      </Formik>
    </Drawer>
  );
}

CreateCoupon.propTypes = {
  refresh: PropTypes.func.isRequired,
};

CreateCoupon.defaultProps = {};
