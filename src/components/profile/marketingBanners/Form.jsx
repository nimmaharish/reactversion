import React, { useRef } from 'react';
import { Drawer } from 'components/shared/Drawer';
import PropTypes from 'prop-types';
import { FormikInput, Button } from 'phoenix-components';
import tagIcon from 'assets/v2/settings/tag.svg';
import tagGreenIcon from 'assets/v2/settings/greenTag.svg';
import cx from 'classnames';
// import { Select } from 'phoenix-components/lib/formik';
import { Formik } from 'formik';
import { useToggle } from 'hooks/common';
import { Becca } from 'api';
import { get } from 'lodash';
import Header from 'containers/products/Header';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import { useRefreshTemplates } from 'contexts';
import { ProductsDrawer } from 'components/shared/ProductsDrawer';
import Catalog from 'containers/products/Catalog/List';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import {
  useIsBannersEnabled
} from 'contexts/userContext';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import { useDesktop } from 'contexts';
import { SideDrawer } from 'components/shared/SideDrawer';
import {
  Dialog
} from '@material-ui/core';
import { Card } from './Card';
import styles from './Form.module.css';
import { getInitialValues, schema } from './utils';
import ProductsPopUp from '../../../containers/products/Drawers/ProductPopUp';

function Form({ onClose, values }) {
  const refresh = useRefreshTemplates();
  const history = useHistory();
  const params = useQueryParams();
  const [open, setOpen] = useToggle(false);
  const [unTagSkus, toggleUnTagSkusModal] = useToggle(false);
  const [unTagCats, toggleUnTagCatsModal] = useToggle(false);
  const [openCatalog, toggleOpenCatalog] = useToggle(false);
  const [liveClicked, toggleClicked] = useToggle(false);
  const isEdit = get(values, '_id', false);
  const inputRef = useRef();
  const isBannerConfig = useIsBannersEnabled();
  const isDesktop = useDesktop();

  const onSubmit = async (payload) => {
    if (liveClicked) {
      payload.status = 'live';
    }
    if (!isBannerConfig) {
      params.set('openPlans', 'generic');
      history.push({
        search: params.toString(),
      });
      return;
    }
    try {
      Loader.show();
      if (isEdit) {
        await Becca.patchTemplate(values._id, payload);
      } else {
        await Becca.addTemplate(payload);
      }
      refresh();
      onClose();
      const successText = isEdit ? 'Template Updated Successfully' : 'Template Added Successfully';
      SnackBar.show(successText, 'success');
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const uploadAsset = async (e, setValue) => {
    try {
      Loader.show();
      const files = e?.target?.files;
      const file = files && files[0];
      const payload = new FormData();
      payload.append('name', file.name);
      payload.append('purpose', 'shop-marketing-template');
      payload.append('type', 'image');
      payload.append('file', file);
      const { url } = await Becca.uploadAsset(payload);
      setValue('image', url);
      SnackBar.show('upload success');
    } catch (e) {
      SnackBar.show('upload failed', 'error');
    } finally {
      Loader.hide();
    }
  };

  const onDrawerClose = (setField) => (ids) => {
    setField('type', 'sku');
    setField('items', ids);
    setOpen();
  };

  const onCatalogDrawerClose = (setField) => (ids) => {
    setField('type', 'catalog');
    setField('items', ids);
  };

  const getLabelProducts = (values) => {
    const { type, items } = values;
    if (type === 'sku') {
      return items.length > 0 ? `Tagged ${items.length} Products` : '';
    }
  };

  const getLabelCatalogs = (values) => {
    const { type, items } = values;
    if (type === 'catalog') {
      return items.length > 0 ? `Tagged ${items.length} Catalogs` : '';
    }
  };

  if (isDesktop) {
    return (
      <>
        <Formik
          validationSchema={schema}
          initialValues={getInitialValues(values)}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            submitForm,
          }) => (
            <SideDrawer
              backButton={true}
              title="Select Collection"
              onClose={onClose}
            >
              <div className={styles.container}>
                <div className={styles.container1}>
                  {open && (
                    <ProductsPopUp
                      title="Tag Products"
                      initial={values.type === 'sku' ? values.items : []}
                      onClose={onDrawerClose(setFieldValue)}
                    />
                  )}
                  {openCatalog && (
                    <Dialog
                      open={true}
                      onClose={toggleOpenCatalog}
                      maxWidth="md"
                      PaperProps={{
                        classes: {
                          root: styles.dialog,
                        }
                      }}
                    >
                      <Catalog
                        from="product"
                        selected={values.type === 'catalog' ? values.items : []}
                        onSelect={onCatalogDrawerClose(setFieldValue)}
                        onHide={true}
                      />
                      <div className="flexCenter">
                        <Button
                          label={`Tag ${values.items.length > 0 ? values.items.length : ''} Catalog`}
                          onClick={toggleOpenCatalog}
                          size="large"
                        />
                      </div>
                    </Dialog>
                  )}
                  <div className={styles.formik}>
                    <div className={styles.firstDiv}>
                      <FormikInput
                        label="Title (Optional)"
                        name="title"
                        placeholder="Enter Title Name"
                      />
                    </div>
                  </div>
                  <div className={styles.formik2}>
                    <div className={styles.firstDiv}>
                      <FormikInput
                        type="textarea"
                        rows={5}
                        label="Description (Optional)"
                        name="description"
                        placeholder="Type here"
                        className={styles.input}
                      />
                    </div>
                  </div>
                  <div className={styles.customImage}>
                    <div className="relative">
                      <input
                        ref={inputRef}
                        accept="image/*"
                        hidden
                        id="icon-button-file"
                        type="file"
                        onChange={(e) => {
                          uploadAsset(e, setFieldValue);
                        }} />
                      <label htmlFor="icon-button-file">
                        <Button
                          size="medium"
                          label="Browse Custom Image"
                          primary={false}
                          onClick={() => {
                        // eslint-disable-next-line no-unused-expressions
                        inputRef?.current?.click();
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div className={styles.head}>
                    Banner Preview
                  </div>
                  <Card
                    title={values?.title}
                    description={values?.description}
                    image={values?.image}
                    showEdit={false}
                    onClick={() => {}}
                  />
                  {unTagSkus && (
                    <DeleteAlert
                      title="You can tag either catalogs or products at a time, untag products to tag the catalogs"
                      onCancel={toggleUnTagSkusModal}
                      primary="Untag"
                      secondary="Cancel"
                      onDelete={() => {
                        setFieldValue('items', []);
                        toggleUnTagSkusModal();
                        toggleOpenCatalog();
                      }}
                    />
                  )}
                  {unTagCats && (
                    <DeleteAlert
                      title="You can tag either catalogs or products at a time, untag catalogs to tag products"
                      onCancel={toggleUnTagCatsModal}
                      primary="Untag"
                      secondary="Cancel"
                      onDelete={() => {
                        setFieldValue('items', []);
                        toggleUnTagCatsModal();
                        setOpen();
                      }}
                    />
                  )}
                  <div className={styles.tag}>
                    <Button
                      startIcon={getLabelProducts(values)?.length > 0 ? tagGreenIcon : tagIcon}
                      className={cx(styles.tagBtn, { [styles.tagActive]: getLabelProducts(values)?.length > 0 })}
                      label={getLabelProducts(values) || 'Tag Products'}
                      size="medium"
                      primary={false}
                      onClick={() => {
                        if (values?.type === 'sku' || values?.items?.length === 0) {
                          setOpen();
                          return;
                        }
                        toggleUnTagCatsModal();
                      }}
                    />
                    <Button
                      startIcon={getLabelCatalogs(values)?.length > 0 ? tagGreenIcon : tagIcon}
                      className={cx(styles.tagBtn, { [styles.tagActive]: getLabelCatalogs(values)?.length > 0 })}
                      label={getLabelCatalogs(values) || 'Tag Catalogs'}
                      primary={false}
                      size="medium"
                      onClick={() => {
                        if (values.type === 'catalog' || values?.items?.length === 0) {
                          toggleOpenCatalog();
                          return;
                        }
                        toggleUnTagSkusModal();
                      }}
                    />
                  </div>
                  {errors?.items && touched?.items && (
                    <div className={styles.error}>
                      Tag atleast one product / catalog
                    </div>
                  )}
                  <div className={styles.info}>
                    On click of the banner, customer will be shown the tagged
                    products/catalogs on your shop website
                  </div>
                  {/* <div className={styles.button}>
                    <Button
                      label="Save"
                      size="large"
                      className={styles.buttonD}
                      bordered={true}
                      primary={true}
                      onClick={() => submitForm()}
                    />
                  </div> */}
                  <div className={styles.buttonContainerD}>
                    <Button
                      label="Save"
                      size="large"
                      className={styles.noBorder}
                      primary={false}
                      onClick={() => submitForm()}
                    />
                    <Button
                      label="Save & Apply"
                      size="large"
                      onClick={async () => {
                        await toggleClicked();
                        submitForm();
                      }}
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
    <Drawer hideHeader={true}>
      <Header title="Marketing Banner" onBack={onClose} />
      <Formik
        validationSchema={schema}
        initialValues={getInitialValues(values)}
        enableReinitialize={true}
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
              {open && (
                <ProductsDrawer
                  title="Tag Products"
                  initial={values.type === 'sku' ? values.items : []}
                  onClose={onDrawerClose(setFieldValue)}
                />
              )}
              {openCatalog && (
                <Drawer title="Tag Catalogs" onClose={toggleOpenCatalog}>
                  <Catalog
                    from="product"
                    selected={values.type === 'catalog' ? values.items : []}
                    onSelect={onCatalogDrawerClose(setFieldValue)}
                  />
                  <div className="flexCenter">
                    <Button
                      label={`Tag ${values.items.length > 0 ? values.items.length : ''} Catalog`}
                      onClick={toggleOpenCatalog}
                      size="large"
                    />
                  </div>
                </Drawer>
              )}
              <div className={styles.formik}>
                <div className={styles.firstDiv}>
                  <FormikInput
                    label="Title (Optional)"
                    name="title"
                    placeholder="Enter Title Name"
                  />
                </div>
              </div>
              <div className={styles.formik2}>
                <div className={styles.firstDiv}>
                  <FormikInput
                    type="textarea"
                    rows={5}
                    label="Description (Optional)"
                    name="description"
                    placeholder="Type here"
                    className={styles.input}
                  />
                </div>
              </div>
              <div className={styles.customImage}>
                <div className="relative">
                  <input
                    ref={inputRef}
                    accept="image/*"
                    hidden
                    id="icon-button-file"
                    type="file"
                    onChange={(e) => {
                      uploadAsset(e, setFieldValue);
                    }} />
                  <label htmlFor="icon-button-file">
                    <Button
                      size="medium"
                      label="Browse Custom Image"
                      primary={false}
                      onClick={() => {
                        // eslint-disable-next-line no-unused-expressions
                        inputRef?.current?.click();
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className={styles.head}>
                Banner Preview
              </div>
              <Card
                title={values?.title}
                description={values?.description}
                image={values?.image}
                showEdit={false}
                onClick={() => {}}
              />
              {unTagSkus && (
                <DeleteAlert
                  title="You can tag either catalogs or products at a time, untag products to tag the catalogs"
                  onCancel={toggleUnTagSkusModal}
                  primary="Untag"
                  secondary="Cancel"
                  onDelete={() => {
                    setFieldValue('items', []);
                    toggleUnTagSkusModal();
                    toggleOpenCatalog();
                  }}
                />
              )}
              {unTagCats && (
                <DeleteAlert
                  title="You can tag either catalogs or products at a time, untag catalogs to tag products"
                  onCancel={toggleUnTagCatsModal}
                  primary="Untag"
                  secondary="Cancel"
                  onDelete={() => {
                    setFieldValue('items', []);
                    toggleUnTagCatsModal();
                    setOpen();
                  }}
                />
              )}
              <div className={styles.tag}>
                <Button
                  startIcon={getLabelProducts(values)?.length > 0 ? tagGreenIcon : tagIcon}
                  className={cx(styles.tagBtn, { [styles.tagActive]: getLabelProducts(values)?.length > 0 })}
                  label={getLabelProducts(values) || 'Tag Products'}
                  size="medium"
                  primary={false}
                  onClick={() => {
                    if (values?.type === 'sku' || values?.items?.length === 0) {
                      setOpen();
                      return;
                    }
                    toggleUnTagCatsModal();
                  }}
                />
                <Button
                  startIcon={getLabelCatalogs(values)?.length > 0 ? tagGreenIcon : tagIcon}
                  className={cx(styles.tagBtn, { [styles.tagActive]: getLabelCatalogs(values)?.length > 0 })}
                  label={getLabelCatalogs(values) || 'Tag Catalogs'}
                  primary={false}
                  size="medium"
                  onClick={() => {
                    if (values.type === 'catalog' || values?.items?.length === 0) {
                      toggleOpenCatalog();
                      return;
                    }
                    toggleUnTagSkusModal();
                  }}
                />
              </div>
              {errors?.items && touched?.items && (
                <div className={styles.error}>
                  Tag atleast one product / catalog
                </div>
              )}
              <div className={styles.info}>
                On click of the banner, customer will be shown the tagged
                products/catalogs on your shop website
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <Button
                label="Save"
                size="large"
                className={styles.noBorder}
                bordered={false}
                fullWidth
                primary={false}
                onClick={() => submitForm()}
              />
              <Button
                label="Save & Apply"
                size="large"
                bordered={false}
                fullWidth
                onClick={async () => {
                  await toggleClicked();
                  submitForm();
                }}
              />
            </div>
          </div>
        )}
      </Formik>
    </Drawer>

  );
}

Form.propTypes = {
  onClose: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
};

export default Form;
