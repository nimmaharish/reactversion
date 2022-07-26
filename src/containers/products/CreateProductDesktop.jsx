import React, { lazy, useState } from 'react';
import { isEmpty } from 'lodash';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { Formik } from 'formik';
import {
  Grid
} from '@material-ui/core';
import { RatingsShare } from 'components/reviewProduct/RatingsShare';
import {
  Button, Card, Chip, Clickable, FormikInput, Switch
} from 'phoenix-components';
import estimateDelivery from 'assets/overview/estimateDelivery.svg';
import customizationIcon from 'assets/overview/customization.svg';
import editIcon from 'assets/overview/editDesk.svg';
import { VariantBlock } from 'components/products/VariantBlock';
import { ErrorMessage, Radio } from 'phoenix-components/lib/formik';
import { Radio as Rdio } from 'phoenix-components';
import {
  calculateDiscount,
  getInitialValues,
  calculateTax,
  getVideosAndImages,
  marshallPayload,
  productSchema,
  draftSchema,
} from 'components/products/variantUtils';
import Quantity from 'components/products/Quantity';
import { useImagesLength, useShop } from 'contexts/userContext';
import { SideDrawer } from 'components/shared/SideDrawer';
import review from 'assets/images/products/review1x.svg';
import { useToggle } from 'hooks/common';
import Catalog from 'containers/products/Catalog/List';
import chevronBottom from 'assets/v2/common/chevronGreyBottom.svg';
import { ImagePicker } from 'components/common/ImagePicker';
import { UnitDrawer } from 'components/products/UnitDrawer';
import { ProductVariantDrawer } from 'components/products/ProductVariantDrawer';
import chevDown from 'assets/v2/settings/paymentModes/chevDown.svg';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { useIsRatingsEnabled, useIsFreePlan } from 'contexts';
import { Becca } from 'api';
import { inParallelWithLimit } from 'utils/parallel';
import { useProductDetails } from 'components/products/hooks';
import { Loading } from 'components/shared/Loading';
import { DescriptionDraw } from 'components/products/DescriptionDraw';
import Kbc from 'components/knowBaseCards/KnowBaseCards.jsx';
import UploadProduct from 'components/products/UploadProduct.jsx';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import cx from 'classnames';
import {
  useShopTaxes,
} from 'contexts/userContext';
import { TaxCard } from './TaxCard.jsx';
import styles from './CreateProductDesktop.module.css';

export const ShippingTimeDesktop = lazy(() => import(/* webpackChunkName: "shipping time desktop" */
  'containers/shippingTime/ShippingTimeDesktop'
));
function CreateProductDesktop(

) {
  const shop = useShop();
  const { id } = useParams();
  const [product] = useProductDetails(id);
  const history = useHistory();
  const isUpdate = !isEmpty(id);
  const { state } = useLocation();
  const [openDescription, toggleDescription] = useToggle(false);
  const [isDraft, toggleIsDraft] = useState(false);
  const [openCollection, toggleCollection, setOpenCollection] = useToggle(false);
  const [openVariantBlock, toggleVariantBlock, setOpenVariantBlock] = useToggle(false);
  const [openUnit, toggleUnit] = useToggle(false);
  // const [categories] = useCategories();
  const [openShippingTime, toggleShippingTime] = useToggle(false);
  const [openDetails, toggleOpenDetails, setOpenDetails] = useToggle(false);
  // const [openCategory, toggleCategory] = useToggle(false);
  const [openCustomization, toggleCustomization] = useToggle(false);
  const isEnabledRatings = useIsRatingsEnabled();
  const showReview = isUpdate && isEnabledRatings;
  const isDraftProduct = product && product.status === 'draft';
  const isFreePlan = useIsFreePlan();
  const fileLength = useImagesLength(false);
  const [isDigitalProduct, setIsDigitalProduct] = useToggle(false);
  const [openUploadDrawer, setOpenUploadDrawer] = useToggle(false);

  const taxes = useShopTaxes();
  const initialValues = getInitialValues({ ...product, ...state }, isUpdate ? [] : taxes);

  const onSave = async (values) => {
    if (isDraftProduct) {
      values.status = 'live';
    }
    const {
      variants,
      sku
    } = marshallPayload(values);
    Loader.show();
    try {
      if (sku._id) {
        await Becca.updateProduct(sku._id, sku);
        await inParallelWithLimit(variants, 5, async variant => {
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
      }
      history.goBack();
      SnackBar.show(`Product ${isUpdate ? 'updated' : 'created'} successfully`, 'success');
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
    const {
      videos,
      images
    } = getVideosAndImages(files);
    setField('images', images);
    setField('videos', videos);
  };

  const onProductUpload = (setField) => (files) => setField('links', files);

  const getSchema = () => {
    const checkList = ['deleted', 'draft'];
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

  const onReviewClick = () => history.push(`/products/rating/${id}`);

  if (isUpdate && !product) {
    return <Loading />;
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSave}
      validationSchema={getSchema()}
    >
      {({
        values,
        setFieldValue,
        submitForm
      }) => (
        <div className={styles.main}>
          {showReview && (
            <Grid item xs={12} className={styles.containerMain}>
              <Grid item xs={3} className={styles.titleContainer}>
              </Grid>
              <Grid item xs={5}>
                <div className={styles.review} onClick={onReviewClick}>
                  <img src={review} alt="" />
                  Reviews
                </div>
              </Grid>
            </Grid>
          )}
          <Grid item={12} className={styles.containerMain}>
            <Grid item xs={3} className={styles.titleContainer}>
              <div className={styles.title}>Create Product</div>
              <div className={styles.titleHelper}>Add more additional details</div>
            </Grid>
            <Grid item xs={5}>
              <Card
                outlined={false}
                className={styles.cardContainer}
              >
                <ImagePicker
                  label="Upload high-resolution photos
                           and videos of your product"
                  onChange={onImageChange(setFieldValue)}
                  isMulti={true}
                  showCover={true}
                  images={[...values.images, ...values.videos]}
                  accept="image/*,video/mp4,video/x-m4v,video/*"
                  videos={!isFreePlan}
                  size={fileLength}
                />
                <ErrorMessage name="images" />
                <Grid item xs={12}>
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
                    ) : null}
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
                        null
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={12} container spacing={1}>
                    <Grid item xs={12}>
                      <FormikInput
                        label="Product Name"
                        name="title"
                        placeholder="Give your product a stand-out name"
                      />
                    </Grid>
                  </Grid>
                  <Grid item xs={12} container spacing={1}>
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
                  </Grid>
                  {values?.variant?.amount > 0 && values?.variant?.discountedAmount > 0 && (
                    <Grid item xs={12}>
                      <div className={styles.helperText}>
                        Price to Customer :
                        {' '}
                        {shop.currencySymbol}
                        {values.variant.discountedAmount}
                        {' '}
                        <span className={styles.strikeOff}>
                          {shop.currencySymbol}
                          {values.variant.amount}
                        </span>
                        {' '}
                        {calculateDiscount(values.variant.amount, values.variant.discountedAmount)}
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
                  {values?.unit?.value > 0 && values?.unit?.type && values?.variant?.discountedAmount && (
                    <Grid item xs={6}>
                      <div className={styles.helperText}>
                        Unit :
                        {' '}
                        {shop.currencySymbol}
                        {' '}
                        {values.variant.discountedAmount}
                        {' '}
                        Per
                        {' '}
                        {values.unit.value}
                        {' '}
                        {values.unit.type}
                      </div>
                    </Grid>
                  )}
                  <Grid item xs={12} container spacing={1}>
                    <Grid item xs={12}>
                      <Clickable onClick={toggleDescription} className={styles.descriptionContainer}>
                        <div className={styles.descriptionHeading}>Product Description</div>
                        {values?.plainDescription?.length > 0 ? (
                          <div className={styles.descriptionText}>
                            {values.plainDescription.slice(0, 80)}
                            {values.plainDescription.length > 80 && (
                              <span className={styles.descriptionLink}>more...</span>
                            )}
                          </div>
                        ) : (
                          <div className={styles.descriptionPlaceholder}>Describe your product in a few lines</div>
                        )}
                      </Clickable>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
          {values.productType === 'digital' ? (
            <Grid item={12} className={styles.containerMain}>
              <Grid item xs={3} className={styles.titleContainer}>
                <div className={styles.title}>Upload Product link</div>
                <div className={styles.titleHelper}>Add Files or product link</div>
              </Grid>
              <Grid item xs={5}>
                <Card
                  outlined={true}
                  className={styles.cardContainer}
                >
                  <div className={styles.catalogRow1}>
                    <div className={styles.catalogCol}>
                      <div className={styles.subTitle1}>
                        Upload link
                        <Clickable onClick={() => setOpenUploadDrawer(!openUploadDrawer)}>
                          <img src={chevronBottom} alt="" />
                        </Clickable>
                      </div>
                      <div className={styles.catalogs}>
                        <VariantBlock />
                      </div>
                      <Button
                        className={styles.addButton}
                        label={values.links.length > 0 ? 'Edit' : 'Upload link'}
                        primary={false}
                        onClick={() => setOpenUploadDrawer(!openUploadDrawer)}
                      />
                    </div>
                  </div>
                  {openUploadDrawer && (
                    <UploadProduct
                      onBack={() => {
                        setOpenUploadDrawer(!openUploadDrawer);
                      }}
                      onUpload={onProductUpload(setFieldValue)}
                      onSave={() => setOpenUploadDrawer(!openUploadDrawer)}
                      digitalProducts={values.links}
                    />
                  )}
                </Card>
              </Grid>
            </Grid>
          ) : null}
          <Grid item={12} className={styles.containerMain}>
            <Grid item xs={3} className={styles.titleContainer}>
              <div className={styles.title}>Stock and Availability</div>
              <div className={styles.titleHelper}>Add more additional details</div>
            </Grid>
            <Grid item xs={5}>
              <Card
                outlined={true}
                className={styles.cardContainer}
              >
                <div className={styles.subTitle}>How many units do you have in stock?</div>
                <Grid container spacing={2}>
                  <Grid item xs={5}>
                    <Radio name="variant.availableType" value="finite" label="Limited Stock" />
                  </Grid>
                  <Grid item xs={5}>
                    <Radio name="variant.availableType" value="infinite" label="Always in Stock" />
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
                    <div className={cx(styles.helperText, styles.marginTop)}>
                      Your order will be Out of Stock once Available Quantity becomes 0
                    </div>
                  </Grid>
                )}
              </Card>
            </Grid>
          </Grid>
          <Grid item={12} className={styles.containerMain}>
            <Grid item xs={3} className={styles.titleContainer}>
              <div className={styles.title}>Collections & Variants</div>
              <div className={styles.titleHelper}>Add more additional details</div>
            </Grid>
            <Grid item xs={5}>
              {values?.catalogs?.length === 0 && (
                <div className={styles.catalogBox}>
                  <div className={styles.catalogRow1}>
                    <div className={styles.catalogCol}>
                      <div className={styles.subTitle1}>
                        Collections
                        <Clickable onClick={toggleCollection}>
                          <img src={chevronBottom} alt="" />
                        </Clickable>
                      </div>
                      <Button
                        className={styles.addButton1}
                        label="Add Collections"
                        primary={false}
                        onClick={toggleCollection} />
                    </div>
                  </div>
                </div>
              )}
              {values?.catalogs?.length > 0 && (
                <div className={styles.catalogBox}>
                  <div className={styles.catalogRow1}>
                    <div className={styles.catalogCol}>
                      <div className={styles.subTitle1}>
                        Selected Collection
                        <Clickable onClick={toggleCollection}>
                          <img src={chevronBottom} alt="" />
                        </Clickable>
                      </div>
                      <div className={styles.catalogs}>
                        {values.catalogs.map(c => (
                          <Chip
                            clearIcon
                            label={c}
                            selected={true}
                            onSelect={() => {
                              setFieldValue('catalogs', values.catalogs.filter(x => x !== c));
                            }}
                          />
                        ))}
                      </div>
                      <Button
                        className={styles.addButton}
                        label="Add Collection"
                        primary={false}
                        onClick={toggleCollection} />
                    </div>
                  </div>
                </div>
              )}
              <div className={styles.margin}></div>
              {values?.variants?.length === 0 && (
                <div className={styles.catalogBox}>
                  <div className={styles.catalogRow1}>
                    <div className={styles.catalogCol}>
                      <div className={styles.subTitle1}>
                        Variants
                        <Clickable onClick={toggleVariantBlock}>
                          <img src={chevronBottom} alt="" />
                        </Clickable>
                      </div>
                      <Button
                        className={styles.addButton1}
                        label="Add Variants"
                        primary={false}
                        onClick={toggleVariantBlock} />
                    </div>
                  </div>
                </div>
              )}
              {values?.variants?.length > 0 && (
                <div className={styles.catalogBox}>
                  <div className={styles.catalogRow1}>
                    <div className={styles.catalogCol}>
                      <div className={styles.subTitle1}>
                        Selected Variants
                        <Clickable onClick={toggleVariantBlock}>
                          <img src={chevronBottom} alt="" />
                        </Clickable>
                      </div>
                      <div className={styles.catalogs}>
                        <VariantBlock />
                      </div>
                      <Button
                        className={styles.addButton}
                        label="Add Variants"
                        primary={false}
                        onClick={toggleVariantBlock} />
                    </div>
                  </div>
                </div>
              )}
            </Grid>
          </Grid>

          <Grid item={12} className={styles.containerMain}>
            <Grid item xs={3} className={styles.titleContainer}>
              <div className={styles.title}>Other Details</div>
              <div className={styles.titleHelper}>Add more additional details</div>
            </Grid>
            <Grid item xs={5}>
              {values?.customizable === 'no' ? (
                <Grid item xs={12}>
                  <div className={styles.catalogBox}>
                    <div className={styles.catalogRow1}>
                      <div className={styles.catalogCol}>
                        <div className={styles.subTitle1}>
                          Customization
                          <Clickable onClick={toggleCustomization}>
                            <img src={chevronBottom} alt="" />
                          </Clickable>
                        </div>
                        <Button
                          className={styles.addButton1}
                          label="Add Customization"
                          primary={false}
                          onClick={toggleCustomization} />
                      </div>
                    </div>
                  </div>
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <div className={styles.catalogBox}>
                    <div className={styles.catalogRow1}>
                      <div className={styles.catalogCol}>
                        <div className={styles.subTitle1}>
                          Customization
                          <div className="flexCenter">
                            <div className="flexCenter">
                              <img src={customizationIcon} alt="" />
                              <div className={styles.Ytext}>Yes</div>
                            </div>
                            <Clickable onClick={toggleCustomization}>
                              <img src={chevronBottom} alt="" />
                            </Clickable>
                          </div>
                        </div>
                        <Button
                          className={styles.addButton1}
                          label="Edit Customization"
                          primary={false}
                          onClick={toggleCustomization} />
                      </div>
                    </div>
                  </div>
                </Grid>
              )}

              <div className={styles.margin}></div>
              <Grid item xs={12}>
                <Grid item xs={12}>
                  <div className={styles.catalogBox}>
                    <div className={styles.catalogRow1}>
                      <div className={styles.catalogCol}>
                        <div className={styles.subTitle1}>
                          More Details
                          <Clickable onClick={toggleOpenDetails}>
                            <img src={chevronBottom} alt="" />
                          </Clickable>
                        </div>
                        <Button
                          className={styles.addButton1}
                          label={`${values.categories.length
                            && values.subCategories.length ? 'Edit' : 'Add'} more details`}
                          primary={false}
                          onClick={toggleOpenDetails} />
                      </div>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {isUpdate && (
            <Grid item={12} className={styles.containerMain}>
              <Grid item xs={3}></Grid>
              <Grid item xs={5}>
                <div className={styles.shareSection}>
                  <RatingsShare shop={shop} product={product} />
                </div>
              </Grid>
            </Grid>
          )}
          <Grid item={12} className={styles.containerMain}>
            <Grid item xs={6}>
              <Kbc
                type="productCreation"
              />
            </Grid>

          </Grid>

          <div className={styles.submitButton}>
            {!isUpdate && (
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
                      SnackBar.show('Please add all required fields', 'error');
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
                      SnackBar.show('Please add all required fields', 'error');
                    }
                    // submit form to show field errors
                    submitForm();
                  }}
                />
              </div>
            )}
            {(isUpdate && product?.status !== 'deleted') && (
              <Button
                label={isDraftProduct ? 'Update Product' : 'Update Product'}
                size="large"
                className={styles.buttonS}
                onClick={async () => {
                  const cL = ['live', 'created', 'out of stock', 'draft'];
                  if (!cL.includes(product?.status)) {
                    submitForm();
                    return;
                  }
                  await toggleIsDraft(false);
                  try {
                    await productSchema.validateSync(values);
                  } catch (e) {
                    SnackBar.show('Please add all required fields', 'error');
                  }
                  // submit form to show field errors
                  submitForm();
                }}
              />
            )}
          </div>
          {openVariantBlock
            && (
              <>
                <SideDrawer
                  backButton={true}
                  onClick={toggleVariantBlock}
                  onClose={() => setOpenVariantBlock(false)}
                  title="Product Variants"
                >
                  <ProductVariantDrawer onClose={() => setOpenVariantBlock(false)} />
                </SideDrawer>
              </>
            )}
          {openCollection
            && (
              <>
                <SideDrawer
                  button={true}
                  btnLabel="Save"
                  backButton={true}
                  onClick={toggleCollection}
                  onClose={() => setOpenCollection(false)}
                  title="Select Collection"
                >
                  <Catalog
                    from="product"
                    onHide={true}
                    selected={values.catalogs}
                    onSelect={(catalogs) => {
                      setFieldValue('catalogs', catalogs);
                    }} />
                </SideDrawer>
              </>
            )}
          {openUnit && <UnitDrawer prefix="unit.type" onClose={toggleUnit} />}
          {openDescription && <DescriptionDraw onClose={toggleDescription} />}
          {/* {openCategory && <CategoryDrawer onClose={toggleCategory} categories={categories} />} */}
          {openCustomization
            && (
              <>
                <>
                  <SideDrawer
                    button={true}
                    btnLabel="Save"
                    backButton={true}
                    onClick={toggleCustomization}
                    onClose={toggleCustomization}
                    title="Customization"
                  >
                    <Card>
                      <Grid item xs={12} className={styles.subSection}>
                        <div className={styles.subTitle}>Can this be Customized?</div>
                        <Grid container spacing={2} className={styles.section}>
                          <Grid item xs={4}>
                            <Radio name="customizable" value="yes" label="Yes" />
                          </Grid>
                          <Grid item xs={4}>
                            <Radio name="customizable" value="no" label="No" />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Card>
                  </SideDrawer>
                </>
                <Button
                  label={isUpdate ? isDraftProduct ? 'Live' : 'Update Product' : 'Add Product'}
                  size="large"
                  fullWidth
                  onClick={submitForm} />
              </>
            )}
          {openDetails && (
            <>
              <SideDrawer
                backButton={true}
                onClose={() => setOpenDetails(false)}
                title="More Details"
              >
                <Card className={styles.taxCard}>
                  <Grid container>
                    <Grid item xs={12} className={styles.taxText}>
                      <div className={styles.subTitle}>Are taxes included in the price?</div>
                    </Grid>
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
                </Card>
                <Grid container>
                  <Grid item xs={12} className={styles.subSectionTax}>
                    <div className={styles.subTitleTax}>Shipping Time</div>
                    {openShippingTime && (
                      <ShippingTimeDesktop
                        isProduct={true}
                        onBack={toggleShippingTime} />
                    )}
                    {!openShippingTime && values?.shippingTime?.from?.value && (
                      <div
                        className={styles.est}
                      >
                        <img src={estimateDelivery} alt="" className={styles.img} />
                        <div className={styles.estText}>

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
                        <Clickable
                          onClick={toggleShippingTime}
                        >
                          <img
                            src={editIcon}
                            alt=""
                            className={styles.img} />
                        </Clickable>
                      </div>
                    )}
                    {!openShippingTime && (
                      <>
                        {!values?.shippingTime?.from?.value && (
                          <Grid item xs={12} className={styles.taxGrid}>
                            <div className={styles.catalogBox}>
                              <div className={styles.catalogRow1}>
                                <div className={styles.catalogCol}>
                                  <div className={styles.subTitle1}>
                                    Shipping time
                                    <Clickable>
                                      <img src={chevronBottom} alt="" />
                                    </Clickable>
                                  </div>
                                  {!values?.shippingTime?.from?.value && (
                                    <Button
                                      className={styles.addButton2}
                                      label="Shipping Time"
                                      primary={false}
                                      onClick={toggleShippingTime} />
                                  )}
                                </div>
                              </div>
                            </div>
                          </Grid>
                        )}
                      </>
                    )}
                  </Grid>
                </Grid>
                <Grid container>
                  <Quantity />
                </Grid>
              </SideDrawer>
            </>
          )}
        </div>
      )}
    </Formik>
  );
}

CreateProductDesktop.defaultProps = {};

export default CreateProductDesktop;
