import React, { lazy, useState } from 'react';
import { isEmpty } from 'lodash';
import { useHistory, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Formik } from 'formik';
import { Grid } from '@material-ui/core';
import {
  Button,
  Chip,
  Clickable,
  FormikInput,
  Switch,
} from 'phoenix-components';
import estimateDelivery from 'assets/overview/estimateDelivery.svg';
import editIcon from 'assets/overview/editIcon.svg';
import { ErrorMessage, Radio } from 'phoenix-components/lib/formik';
import {
  calculateDiscount,
  calculateTax,
  getInitialValues,
  getVideosAndImages,
  marshallPayload,
  productSchema,
  draftSchema,
} from 'components/products/variantUtils';
import { Radio as Rdio } from 'phoenix-components';
import { useImagesLength, useShop } from 'contexts/userContext';
import { useToggle } from 'hooks/common';
import Catalog from 'containers/products/Catalog/List';
import { Drawer } from 'components/shared/Drawer';
import { OtherButton } from 'components/products/OtherButton';
import { ImagePicker } from 'components/common/ImagePicker';
import { UnitDrawer } from 'components/products/UnitDrawer';
import chevronRight from 'assets/v2/common/chevronBlackRight.svg';
import { VariantBlock } from 'components/products/VariantBlock';
import Quantity from 'components/products/Quantity';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { Becca } from 'api';
import { useDesktop } from 'contexts';
import { useIsRatingsEnabled, useIsFreePlan } from 'contexts';
import Header from 'containers/products/Header';
import { inParallelWithLimit } from 'utils/parallel';
import { useProductDetails } from 'components/products/hooks';
import { Loading } from 'components/shared/Loading';
import { DescriptionDraw } from 'components/products/DescriptionDraw';
import cx from 'classnames';
import EventManager from 'utils/events';
import chevDown from 'assets/v2/settings/paymentModes/chevDown.svg';
import { FooterButton } from 'components/common/FooterButton';
import { RatingsShare } from 'components/reviewProduct/RatingsShare';
import { DeleteAlert } from 'components/shared/DeleteAlert.jsx';
import UploadProduct from 'components/products/UploadProduct.jsx';
import {
  useShopTaxes,
} from 'contexts/userContext';
import Kbc from 'components/knowBaseCards/KnowBaseCards.jsx';
import CreateProductDesktop from './CreateProductDesktop.jsx';
import { TaxCard } from './TaxCard.jsx';
import styles from './CreateProduct.module.css';

export const ShippingTime = lazy(() => import(
  /* webpackChunkName: "profile" */
  'containers/shippingTime/ShippingTime'
));

function CreateProduct() {
  const shop = useShop();
  const isDesktop = useDesktop();
  const { id } = useParams();
  const [product] = useProductDetails(id);
  const history = useHistory();
  const { state } = useLocation();
  const isUpdate = !isEmpty(id);
  const [openCatalog, toggleOpenCatalog] = useToggle(false);
  const [openDescription, toggleDescription] = useToggle(false);
  const [isDraft, toggleIsDraft] = useState(false);
  const [openUnit, toggleUnit] = useToggle(false);
  const [openShippingTime, toggleShippingTime] = useToggle(false);
  const [openCustomiz, toggleOpenCustomiz] = useToggle(false);
  const [openDetails, toggleOpenDetails] = useToggle(false);
  const isEnabledRatings = useIsRatingsEnabled();
  const isDraftProduct = product && product.status === 'draft';
  const taxes = useShopTaxes();
  const initialValues = getInitialValues({ ...product, ...state }, isUpdate ? [] : taxes);
  const isFreePlan = useIsFreePlan();
  const fileLength = useImagesLength(false);
  const [isDigitalProduct, setIsDigitalProduct] = useState(false);
  const [openUploadDrawer, setOpenUploadDrawer] = useState(false);

  const onSave = async (values) => {
    if (isDraftProduct) {
      values.status = 'live';
    }
    const { variants, sku } = marshallPayload(values);
    Loader.show();
    try {
      if (sku._id) {
        await Becca.updateProduct(sku._id, sku);
        await inParallelWithLimit(variants, 5, async (variant) => {
          if (variant._id) {
            await Becca.updateVariant(variant._id, variant);
          } else {
            await Becca.createVariant({
              skuId: sku._id,
              ...variant,
            });
          }
        });
      } else {
        const { _id } = await Becca.createProduct({
          ...sku,
          variants,
        });
        sku._id = _id;
        EventManager.emitEvent('product_created', {
          id: _id,
          title: values.title,
        });
      }
      history.goBack();
      SnackBar.show(
        `Product ${isUpdate ? 'updated' : 'created'} successfully`,
        'success',
      );
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const onUnitSelect = (e) => {
    e.preventDefault();
    e.target.blur();
    toggleUnit();
  };

  const onImageChange = (setField) => (files) => {
    const { videos, images } = getVideosAndImages(files);
    setField('images', images);
    setField('videos', videos);
  };

  const onProductUpload = (setField) => (files) => setField('links', files);

  const getSchema = () => {
    const checkList = ['deleted'];
    if (isUpdate) {
      if (checkList.includes(product?.status)) {
        return draftSchema;
      }
      return productSchema;
    }
    if (isDraft) {
      return draftSchema;
    }
    return productSchema;
  };

  if (isUpdate && !product) {
    return <Loading />;
  }

  return (
    <>
      {isDesktop && <CreateProductDesktop />}
      {!isDesktop && (
        <>
          <div className={styles.section}>
            <Header
              showFaq={!isEnabledRatings}
              showLogo={false}
              onBack={history.goBack}
              showItems={['products']}
              title={isUpdate ? 'Update Product' : 'Create Product'}
              showReview={isUpdate && isEnabledRatings}
              onReviewClick={() => history.push(`/products/rating/${id}`)}
            />
            <Formik
              initialValues={initialValues}
              onSubmit={onSave}
              validationSchema={getSchema()}
              enableReinitialize={true}
            >
              {({ values, setFieldValue, submitForm }) => (
                <div className={styles.main}>
                  <ImagePicker
                    onChange={onImageChange(setFieldValue)}
                    isMulti={true}
                    images={[...values.images, ...values.videos]}
                    accept="image/*,video/mp4,video/x-m4v,video/*"
                    showCover={true}
                    size={fileLength}
                    videos={!isFreePlan}
                  />
                  <ErrorMessage name="images" />
                  <div className={styles.title}>Product Details</div>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      {isDigitalProduct ? (
                        <DeleteAlert
                          title="Enable this option only if you’re selling digital
                            products like e-books, videos & services."
                          subTitle="Shipping address for this product will be disabled
                            on your website."
                          primary="CONTINUE"
                          secondary="Cancel"
                          onCancel={() => setIsDigitalProduct(!isDigitalProduct)}
                          onDelete={() => {
                            setIsDigitalProduct(!isDigitalProduct);
                            setFieldValue('productType', 'digital');
                          }}
                        />
                      ) : ''}
                      <div
                        className={
                          values.productType === 'digital'
                            ? styles.activeDigitalProductContainer
                            : styles.digitalProductContainer
                        }
                      >
                        <div className="flexBetween">
                          <p>Digital Product</p>
                          <Switch
                            active={values.productType === 'digital'}
                            onChange={() => {
                              setIsDigitalProduct(!(values.productType === 'digital'));
                              setFieldValue(
                                'productType',
                                'physical',
                              );
                            }}
                          />
                        </div>
                        {values.productType === 'digital' ? (
                          <p className={styles.enableDigitalText}>
                            Enable this option if its a digital Product
                          </p>
                        ) : (
                          ''
                        )}
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <FormikInput
                        label="Product Name"
                        name="title"
                        placeholder="Give your product a stand-out name"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormikInput
                        label="Price"
                        name="variant.discountedAmount"
                        placeholder="e.g. 160"
                        type="number"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormikInput
                        label="Strike-off Price"
                        name="variant.amount"
                        placeholder="e.g. 200"
                        type="number"
                      />
                      <div className={styles.optionalText}>(Optional)</div>
                    </Grid>
                    {values?.variant?.amount > 0
                      && values?.variant?.discountedAmount > 0 && (
                        <Grid item xs={12}>
                          <div className={styles.helperText}>
                            Price to Customer :
                            {' '}
                            {`${shop.currency} ${values.variant.discountedAmount}`}
                            {' '}
                            <span className={styles.strikeOff}>
                              {`${shop.currency} ${values.variant.amount}`}
                            </span>
                            {' '}
                            {calculateDiscount(
                              values.variant.amount,
                              values.variant.discountedAmount,
                            )}
                            % OFF
                          </div>
                        </Grid>
                      )}
                    <div className={styles.customInput}>
                      <div className={styles.left}>
                        <FormikInput
                          label="Product Unit"
                          name="unit.value"
                          placeholder="0"
                          type="number"
                        />
                      </div>
                      <div className={styles.right}>
                        <FormikInput
                          label="Product Unit"
                          name="unit.type"
                          placeholder="select"
                          inputClass={styles.readonlyField}
                          inputProps={{
                            onClick: onUnitSelect,
                          }}
                        />
                        <img
                          role="none"
                          className={styles.chevDown}
                          src={chevDown}
                          alt=""
                          onClick={onUnitSelect}
                        />
                      </div>
                    </div>
                    {values?.unit?.value > 0
                      && values?.unit?.type
                      && values?.variant?.discountedAmount && (
                        <Grid item xs={12}>
                          <div className={styles.helperText}>
                            Unit :
                            {' '}
                            {`${shop.currency}. ${values.variant.discountedAmount} `}
                            {' '}
                            Per
                            {' '}
                            {values.unit.value}
                            {' '}
                            {values.unit.type}
                          </div>
                        </Grid>
                      )}
                    <Grid item xs={12}>
                      <Clickable
                        onClick={toggleDescription}
                        className={styles.descriptionContainer}
                      >
                        <div className={styles.descriptionHeading}>
                          Product Description
                        </div>
                        {values?.plainDescription?.length > 0 ? (
                          <div className={styles.descriptionText}>
                            {values.plainDescription.slice(0, 80)}
                            {values.plainDescription.length > 80 && (
                              <span className={styles.descriptionLink}>
                                more...
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className={styles.descriptionPlaceholder}>
                            Describe your product in a few lines
                          </div>
                        )}
                      </Clickable>
                    </Grid>
                    {values.productType === 'digital' ? (
                      <Grid item xs={12}>
                        <OtherButton
                          label={values.links.length > 0 ? 'Edit' : 'Upload Product link'}
                          onClick={() => {
                            setOpenUploadDrawer(!openUploadDrawer);
                          }}
                        />
                        {openUploadDrawer ? (
                          <UploadProduct
                            onBack={() => {
                              setOpenUploadDrawer(!openUploadDrawer);
                            }}
                            onUpload={onProductUpload(setFieldValue)}
                            onSave={() => setOpenUploadDrawer(!openUploadDrawer)}
                            digitalProducts={values.links}
                          />
                        ) : ''}
                      </Grid>
                    ) : (
                      ''
                    )}
                    <Grid item xs={12}>
                      <div className={styles.subTitle}>
                        1. How many units do you have in stock?
                      </div>
                      <Grid container spacing={2}>
                        <Grid item xs={5}>
                          <Radio
                            name="variant.availableType"
                            value="infinite"
                            label="Always in Stock"
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <Radio
                            name="variant.availableType"
                            value="finite"
                            label="Limited Stock"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    {values?.variant?.availableType === 'finite' && (
                      <Grid item xs={12}>
                        <FormikInput
                          label="Availability"
                          name="variant.available"
                          placeholder="0"
                          type="number"
                        />
                        <div
                          className={cx(styles.helperText, styles.marginTop)}
                        >
                          Your order will be Out of Stock once Available
                          Quantity becomes 0
                        </div>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <div className={styles.subTitle}>
                        2. Collections & Variants
                      </div>
                      {values?.catalogs?.length > 0 ? (
                        <div className={styles.catalogBox}>
                          <div className={styles.catalogRow}>
                            <div className={styles.catalogCol}>
                              <div className={styles.catalogTitle}>
                                Selected Collections
                              </div>
                              <div className={styles.catalogs}>
                                {values.catalogs.map((c) => (
                                  <Chip
                                    clearIcon
                                    label={c}
                                    selected={true}
                                    onSelect={() => {
                                      setFieldValue(
                                        'catalogs',
                                        values.catalogs.filter((x) => x !== c),
                                      );
                                    }}
                                  />
                                ))}
                              </div>
                            </div>
                            <Clickable onClick={toggleOpenCatalog}>
                              <img src={chevronRight} alt="" />
                            </Clickable>
                          </div>
                        </div>
                      ) : (
                        <OtherButton
                          label="Collections"
                          onClick={toggleOpenCatalog}
                          from="create"
                        />
                      )}
                      <VariantBlock />
                    </Grid>
                    <Grid item xs={12}>
                      <div className={styles.subTitle}>3. Other Details</div>
                      <OtherButton
                        label="Customization"
                        onClick={toggleOpenCustomiz}
                      />
                      <div className={styles.spacer} />
                      <OtherButton
                        label="More details"
                        onClick={toggleOpenDetails}
                      />
                      <div className={styles.spacer} />
                      {isUpdate && (
                        <div className={styles.shareSection}>
                          <RatingsShare shop={shop} product={product} />
                        </div>
                      )}
                      <Kbc
                        type="productCreation"
                      />
                    </Grid>
                    {openCustomiz && (
                      <Drawer
                        title="Customization"
                        onClose={toggleOpenCustomiz}
                      >
                        <Grid item xs={12} className={styles.subSection}>
                          <div className={styles.subTitle}>
                            Can this be Customized?
                          </div>
                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <Radio
                                name="customizable"
                                value="yes"
                                label="Yes"
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <Radio
                                name="customizable"
                                value="no"
                                label="No"
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <div className={styles.button}>
                          <Button
                            label="Save"
                            onClick={toggleOpenCustomiz}
                            size="large"
                          />
                        </div>
                      </Drawer>
                    )}
                    {openDetails && (
                      <Drawer title="More details" onClose={toggleOpenDetails}>
                        <Grid container>
                          <Grid item xs={12} className={styles.subSection}>
                            <div className={styles.subTitle}>Are taxes included in the price?</div>
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid item xs={6} className={styles.subSection}>
                            <Rdio
                              inputProps={{
                                onChange: () => setFieldValue('taxes.inclusive', true),
                              }}
                              label="Yes"
                              value={true}
                              selected={values.taxes.inclusive}
                            />
                            {/* <Radio name="taxes.inclusive" value="true" label="Yes" /> */}
                          </Grid>
                          <Grid item xs={6} className={styles.subSection}>
                            <Rdio
                              inputProps={{
                                onChange: () => setFieldValue('taxes.inclusive', false),
                              }}
                              label="No"
                              value={true}
                              selected={!values.taxes.inclusive}
                            />
                            {/* <Radio name="taxes.inclusive" value="false" label="No" /> */}
                          </Grid>
                        </Grid>
                        <Grid container>
                          {values?.variant?.discountedAmount > 0 && (
                            <Grid item xs={12}>
                              <div className={cx(styles.helperText, 'marginLLeftRight', styles.marginTop)}>
                                Price to Customer :
                                {' '}
                                {`${shop.currency} ${calculateTax(taxes, values) || 0}`}
                              </div>
                            </Grid>
                          )}
                        </Grid>
                        <Grid container>
                          <Grid item xs={12} className={styles.subSection}>
                            {taxes.map((tax) => (<TaxCard tax={tax} key={tax._id} />))}
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid item xs={12} className={styles.subSection}>
                            <div className={styles.subTitle}>Shipping Time</div>
                            {values?.shippingTime?.from?.value && (
                              <div className={styles.est}>
                                <img
                                  src={estimateDelivery}
                                  alt=""
                                  className={styles.img}
                                />
                                <div>
                                  { }
                                  Estimated Delivery Time :
                                  {' '}
                                  {values?.shippingTime?.from?.value}
                                  {' '}
                                  -
                                  {' '}
                                  {values?.shippingTime?.to?.value}
                                  {' '}
                                  {values?.shippingTime?.to?.type}
                                </div>
                                <img
                                  src={editIcon}
                                  alt=""
                                  onClick={toggleShippingTime}
                                  className={styles.img}
                                />
                              </div>
                            )}
                            {!values?.shippingTime?.from?.value && (
                              <Clickable
                                className={styles.shippingTime}
                                onClick={() => { }}
                              >
                                <OtherButton
                                  onClick={toggleShippingTime}
                                  label="Shipping Options"
                                />
                              </Clickable>
                            )}
                          </Grid>
                          <div className={styles.button}>
                            <Button
                              label="Save"
                              onClick={() => {
                                toggleOpenDetails();
                              }}
                              size="large"
                              bordered={false}
                              fullWidth
                            />
                          </div>
                        </Grid>
                        <div className={styles.spacing}></div>
                        <Grid container>
                          <Quantity />
                        </Grid>
                        {openShippingTime && (
                          <Drawer
                            title="Shipping Time"
                            onClose={toggleShippingTime}
                          >
                            <ShippingTime
                              isProduct={true}
                              onBack={toggleShippingTime}
                            />
                          </Drawer>
                        )}
                      </Drawer>
                    )}
                  </Grid>
                  {openCatalog && (
                    <Drawer
                      title="Select Collection"
                      onClose={toggleOpenCatalog}
                    >
                      <Catalog
                        from="product"
                        selected={values.catalogs}
                        onSelect={(catalogs) => {
                          setFieldValue('catalogs', catalogs);
                        }}
                      />
                      <div className={styles.button}>
                        <Button
                          label="Save"
                          bordered={false}
                          fullWidth
                          onClick={toggleOpenCatalog}
                          size="large"
                        />
                      </div>
                    </Drawer>
                  )}
                  {!isUpdate && (
                    <FooterButton>
                      <div className={styles.btns}>
                        <Button
                          label="Save as Draft"
                          size="large"
                          primary={false}
                          onClick={async () => {
                            await toggleIsDraft(true);
                            setFieldValue('status', 'draft');
                            try {
                              await draftSchema.validateSync(values);
                            } catch (e) {
                              console.log(e);
                              const [err] = e?.errors || [];
                              SnackBar.show(
                                err || 'Please add all required fields',
                                'error',
                              );
                              return;
                            }
                            // submit form to show field errors
                            submitForm();
                          }}
                        />
                        <Button
                          label="Add Product"
                          size="large"
                          onClick={async () => {
                            await toggleIsDraft(false);
                            setFieldValue('status', 'live');
                            try {
                              await productSchema.validateSync(values);
                            } catch (e) {
                              const [err] = e?.errors || [];
                              SnackBar.show(
                                err || 'Please add all required fields',
                                'error',
                              );
                              return;
                            }
                            // submit form to show field errors
                            submitForm();
                          }}
                        />
                      </div>
                    </FooterButton>
                  )}
                  {isUpdate && product?.status !== 'deleted' && (
                    <FooterButton>
                      <div className={styles.btnsUpdate}>
                        <Button
                          label="Update Product"
                          size="large"
                          fullWidth
                          onClick={async () => {
                            const cL = [
                              'live',
                              'created',
                              'out of stock',
                              'draft',
                            ];
                            if (!cL.includes(product?.status)) {
                              submitForm();
                              return;
                            }
                            await toggleIsDraft(false);
                            try {
                              await productSchema.validateSync(values);
                            } catch (e) {
                              const [err] = e?.errors || [];
                              SnackBar.show(
                                err || 'Please add all required fields',
                                'error',
                              );
                              return;
                            }
                            // submit form to show field errors
                            submitForm();
                          }}
                        />
                      </div>
                    </FooterButton>
                  )}
                  {openUnit && (
                    <UnitDrawer prefix="unit.type" onClose={toggleUnit} />
                  )}
                  {openDescription && (
                    <DescriptionDraw
                      title="Add Description"
                      placeholder="Describe your product and what makes it special"
                      onClose={toggleDescription}
                    />
                  )}
                </div>
              )}
            </Formik>
          </div>
        </>
      )}
    </>
  );
}

CreateProduct.propTypes = {};

CreateProduct.defaultProps = {};

export default CreateProduct;
