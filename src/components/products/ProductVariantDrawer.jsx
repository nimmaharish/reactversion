import React from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'components/shared/Drawer';
import { useToggle } from 'hooks/common';
import { useParams } from 'react-router-dom';
import { Formik, useField, useFormikContext } from 'formik';
import {
  marshallPayload,
} from 'components/products/variantUtils';
import { Button, Card } from 'phoenix-components';
import { Radio } from 'phoenix-components/lib/formik';
import { Grid } from '@material-ui/core';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { Becca } from 'api';
import { useDesktop } from 'contexts';
import Alert from 'components/shared/alert/Alert';
import DraftAlert from 'components/shared/alert/Draft/Alert';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import EventManager from 'utils/events';
import { ColorVariant } from './ColorVariant';
import styles from './ProductVariantDrawer.module.css';
import {
  getColorInitialValues,
  getCustomInitialValues,
  getSizeInitialValues,
  variantDrawerSchema
} from './variantUtils';
import { SizeVariant } from './SizeVariant';
import { CustomVariant } from './CustomVariant';

export function ProductVariantDrawer({ onClose }) {
  const { id } = useParams();
  const isUpdate = !_.isEmpty(id);
  const [, , { setValue: setSkuStatus }] = useField('status');
  const [{ value: variants = [] }, , { setValue }] = useField('variants');
  const [{ value: variantType }] = useField('variantType');
  const isDesktop = useDesktop();
  const history = useHistory();
  const [showAlert, toggleAlert] = useToggle(false);
  const [{ value: amount }] = useField('variant.amount');
  const [{ value: discountedAmount }] = useField('variant.discountedAmount');
  const [{ value: colors }, , { setValue: setColors }] = useField('colors');
  const emptyIdErr = 'You cannot keep both custom'
    + ' and size variants at once.';
  const [openDraft, toggleDraft] = useToggle(false);
  const { values } = useFormikContext();

  const addSizeVariant = (setField, values) => () => {
    if (values.variantType === 'size') {
      setField('variants', [...values.variants, getSizeInitialValues({
        amount,
        discountedAmount
      })]);
    } else {
      const name = values.variants[0]?.info?.name || '';
      setField('variants', [...values.variants, getCustomInitialValues({
        amount,
        discountedAmount,
        info: { name }
      })]);
    }
  };

  const saveDraft = async (data) => {
    const {
      variants,
      sku
    } = marshallPayload({ ...values, ...data });
    if (sku.status === 'draft' && sku.title.length === 0) {
      SnackBar.show('Please add product name', 'error');
      onClose();
      return;
    }
    Loader.show();
    const { _id } = await Becca.createProduct({
      ...sku,
      variants,
    });
    sku._id = _id;
    EventManager.emitEvent('product_created', {
      id: _id,
      title: values.title,
    });
    SnackBar.show('Product created successfully', 'success');
    history.push('/products');
    Loader.hide();
  };

  const addColor = (setField, values) => () => {
    setField('colors', [...values.colors, getColorInitialValues()]);
  };

  const onSubmit = async (values) => {
    setValue(values?.variants || []);
    setColors(values?.colors || []);
    onClose();
  };

  return (
    <>
      {showAlert && (
        <Alert
          text={emptyIdErr}
          btnText="Ok"
          textClass={styles.textClass}
          onClick={toggleAlert}
        />
      )}
      {!isDesktop
  && (
    <Drawer title="Product Variants" onClose={onClose}>
      <Formik
        initialValues={{
          variants: variants || [],
          colors: colors || [],
          variantType,
        }}
        onSubmit={onSubmit}
        validationSchema={variantDrawerSchema}
        enableReinitialize
      >
        {({
          submitForm,
          setFieldValue,
          values,
        }) => (
          <>
            {openDraft && (
              <DraftAlert
                text="Psst, save your details!"
                subText="Save your edits as a draft, so next time, you can pick up where you left off."
                cancelText="Discard"
                clickText="Save as Draft"
                onCancel={toggleDraft}
                onClick={() => {
                  saveDraft({ variants: values?.variants, colors: values.colors });
                }}
              />
            )}
            <div className={styles.main}>
              <div className={styles.variants}>
                <Grid container spacing={2} justify="center" className={styles.radioGrid}>
                  <Grid item xs={5}>
                    <Radio
                      name="variantType"
                      label="Size Variant"
                      value="size"
                      inputProps={{
                        onChange: () => {
                          if (values.variants.length > 0) {
                            toggleAlert();
                            return;
                          }
                          setFieldValue('variantType', 'size');
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Radio
                      name="variantType"
                      label="Custom Variant"
                      value="custom"
                      inputProps={{
                        onChange: () => {
                          if (values.variants.length > 0) {
                            toggleAlert();
                            return;
                          }
                          setFieldValue('variantType', 'custom');
                        }
                      }}
                    />
                  </Grid>
                </Grid>
                {values.variants.length === 0 && (
                  <div>
                    <div className={styles.heading}>{values.variantType === 'size' ? 'Size' : 'Variant'}</div>
                    <Card className={styles.noItemCard}>
                      <Button
                        label={values.variantType === 'size' ? 'Add Size' : 'Add Variant'}
                        size="small"
                        className={styles.addItemButton}
                        onClick={addSizeVariant(setFieldValue, values)}
                      />
                    </Card>
                  </div>
                )}
                {values.variants.length > 0 && (
                  <>
                    {values.variants.map((v, idx) => (
                      <>
                        {values.variantType === 'size' ? (
                          <SizeVariant index={idx} key={idx} />
                        ) : (
                          <CustomVariant index={idx} key={idx} />
                        )}
                      </>
                    ))}
                    <div className={styles.addAnother}>
                      <Button
                        label={
                          values.variantType === 'size'
                            ? 'Add Another Size'
                            : `Add Another 
                            ${_.isEmpty(values.variants[0]?.info?.name) ? 'Variant' : values.variants[0].info.name}`
                        }
                        size="small"
                        className={styles.addItemButton}
                        onClick={addSizeVariant(setFieldValue, values)}
                      />
                    </div>
                  </>
                )}
              </div>
              <div>
                {values.colors.length === 0 && (
                  <div>
                    <div className={styles.heading}>Color</div>
                    <Card className={styles.noItemCard}>
                      <Button
                        label="Add Color"
                        size="small"
                        className={styles.addItemButton}
                        onClick={addColor(setFieldValue, values)}
                      />
                    </Card>
                  </div>
                )}
                {values.colors.length > 0 && (
                  <>
                    {values.colors.map((v, idx) => (
                      <ColorVariant key={idx} index={idx} />
                    ))}
                    <div className={styles.addAnother}>
                      <Button
                        label="Add Another Color"
                        size="small"
                        className={styles.addItemButton}
                        onClick={addColor(setFieldValue, values)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className={styles.save}>
              <Button
                label="Save & Proceed"
                fullWidth
                onClick={async () => {
                  if (isUpdate) {
                    submitForm();
                    return;
                  }
                  try {
                    await variantDrawerSchema.validateSync({
                      colors: values.colors,
                      variants: values.variants,
                    }, {
                      abortEarly: true
                    });
                  } catch (e) {
                    setSkuStatus('draft');
                    toggleDraft(true);
                    return;
                  }
                  submitForm();
                }}
              />
            </div>
          </>
        )}
      </Formik>
    </Drawer>
  )}
      {isDesktop
  && (
    <Formik
      initialValues={{
        variants: variants || [],
        colors: colors || [],
        variantType,
      }}
      onSubmit={onSubmit}
      validationSchema={variantDrawerSchema}
    >
      {({
        setFieldValue,
        values,
        submitForm,
      }) => (
        <>
          {openDraft && (
            <DraftAlert
              text="Psst, save your details!"
              subText="Save your edits as a draft, so next time, you can pick up where you left off."
              cancelText="Discard"
              clickText="Save as Draft"
              onCancel={toggleDraft}
              onClick={() => {
                saveDraft({ variants: values?.variants, colors: values.colors });
              }}
            />
          )}
          <div className={styles.mainDesktop}>
            <div className={styles.variants1}>
              <Grid container spacing={2} justify="center" className={styles.radioGrid}>
                <Grid item xs={4}>
                  <Radio
                    name="variantType"
                    label="Size Variant"
                    value="size"
                    inputProps={{
                      onChange: () => {
                        if (values.variants.length > 0) {
                          toggleAlert();
                          return;
                        }
                        setFieldValue('variantType', 'size');
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Radio
                    name="variantType"
                    label="Custom Variant"
                    value="custom"
                    inputProps={{
                      onChange: () => {
                        if (values.variants.length > 0) {
                          toggleAlert();
                          return;
                        }
                        setFieldValue('variantType', 'custom');
                      }
                    }}
                  />
                </Grid>
              </Grid>
              {values.variants.length === 0 && (
                <div>
                  <div className={styles.heading}>{values.variantType === 'size' ? 'Size' : 'Variant'}</div>
                  <Card className={styles.noItemCard1}>
                    <Button
                      label={values.variantType === 'size' ? 'Add Size' : 'Add Variant'}
                      size="small"
                      className={styles.addItemButton}
                      primary={false}
                      onClick={addSizeVariant(setFieldValue, values)}
                    />
                  </Card>
                </div>
              )}
              {values.variants.length > 0 && (
                <>
                  {values.variants.map((v, idx) => (
                    <>
                      {values.variantType === 'size' ? (
                        <SizeVariant index={idx} key={idx} />
                      ) : (
                        <CustomVariant index={idx} key={idx} />
                      )}
                    </>
                  ))}
                  <div className={styles.addAnother1}>
                    <Button
                      label={
                        values.variantType === 'size'
                          ? 'Add Another Size'
                          : `Add Another 
                            ${_.isEmpty(values.variants[0]?.info?.name) ? 'Variant' : values.variants[0].info.name}`
                      }
                      size="small"
                      className={styles.addItemButton1}
                      primary={false}
                      onClick={addSizeVariant(setFieldValue, values)}
                    />
                  </div>
                </>
              )}
            </div>
            <div>
              {values.colors.length === 0 && (
                <div className={styles.colorContainer}>
                  <div className={styles.heading}>Color</div>
                  <Card className={styles.noItemCard1}>
                    <Button
                      label="Add Color"
                      size="small"
                      className={styles.addItemButton}
                      primary={false}
                      onClick={addColor(setFieldValue, values)}
                    />
                  </Card>
                </div>
              )}
              {values.colors.length > 0 && (
                <>
                  {values.colors.map((v, idx) => (
                    <ColorVariant key={idx} index={idx} />
                  ))}
                  <div className={styles.addAnother1}>
                    <Button
                      label="Add Another Color"
                      size="small"
                      className={styles.addItemButton}
                      primary={false}
                      onClick={addColor(setFieldValue, values)}
                    />
                  </div>
                </>
              )}
            </div>
            <div className={styles.save}>
              <Button
                fullWidth
                label="Save & Proceed"
                bordered={false}
                className={styles.saveButton}
                onClick={async () => {
                  try {
                    if (isUpdate) {
                      submitForm();
                      return;
                    }
                    await variantDrawerSchema.validateSync({
                      colors: values.colors,
                      variants: values.variants,
                    }, {
                      abortEarly: true
                    });
                  } catch (e) {
                    setSkuStatus('draft');
                    toggleDraft(true);
                    return;
                  }
                  submitForm();
                }}
              />
            </div>
          </div>
        </>
      )}
    </Formik>
  )}
    </>
  );
}

ProductVariantDrawer.propTypes = {
  onClose: PropTypes.func.isRequired,
};

ProductVariantDrawer.defaultProps = {};
