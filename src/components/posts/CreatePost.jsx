import React, { useState } from 'react';
import { Drawer } from 'components/shared/Drawer';
import { Field, Formik } from 'formik';
import {
  FileUpload, HashTagSelect, Select2, TextArea
} from 'components/formik';
import { useShop } from 'contexts/userContext';
import { useCategories, useToggle } from 'hooks/common';
import { Loading } from 'components/shared/Loading';
import { RadioGroup } from 'formik-material-ui';
import { FormControlLabel } from '@material-ui/core';
import { BlackRadio } from 'components/coupons/BlackRadio';
import { PostType } from 'constants/posts';
import { postSchema } from 'components/posts/schema';
import ButtonComponent from 'containers/profile/ButtonComponent';
import { ProductsDrawer } from 'components/shared/ProductsDrawer';
import SnackBar from 'services/snackbar';
import { Nikon } from 'api';
import { useHistory } from 'react-router-dom';
import { UploadProgress } from 'components/shared/UploadProgress';
import { ListProducts } from 'components/coupons/ListProducts';
import Info from 'components/info/Info';
import { CreateProduct } from 'components/posts/CreateProduct';
import { getInitialProductValues, getInitialValues, marshallData } from './utils';
import styles from './CreatePost.module.css';

export function CreatePost() {
  const shop = useShop();
  const [open, toggle] = useToggle();
  const [openProduct, toggleProduct] = useToggle();
  const [categories, loading] = useCategories();
  const history = useHistory();
  const [progress, setProgress] = useState(null);

  const shopCategories = shop.categories.map(value => ({
    label: value,
    value
  }));

  if (loading) {
    return (<Loading />);
  }

  const onDrawClose = (setField) => (ids) => {
    setField('products', ids);
    toggle();
  };

  const categoryList = Object.keys(categories)
    .map(value => ({
      label: value,
      value
    }));

  const onProgress = e => {
    setProgress(+((e.loaded * 100) / e.total).toFixed(0));
  };

  const onSubmit = async (values, helpers) => {
    helpers.setSubmitting(true);
    try {
      setProgress(0);
      const data = marshallData(values, shop);
      await Nikon.createPost(data, onProgress);
      SnackBar.show('post uploaded successfully', 'success');
      history.goBack();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      setProgress(null);
    }
    helpers.setSubmitting(false);
  };

  const attachProduct = setField => values => {
    setField('product', getInitialProductValues(values.product));
    toggleProduct();
  };

  return (
    <Drawer title="Add Images Or Video">
      <div className={styles.container}>
        <Formik
          validationSchema={postSchema}
          initialValues={getInitialValues({ categories: shopCategories })}
          onSubmit={onSubmit}
        >
          {({
            values,
            submitForm,
            setFieldValue,
          }) => (
            <>
              <Field
                component={RadioGroup}
                className={styles.radioContainer}
                name="type"
              >
                <FormControlLabel
                  control={<BlackRadio />}
                  label="Images"
                  value={PostType.IMAGES}
                />
                <FormControlLabel
                  control={<BlackRadio />}
                  label="Video"
                  value={PostType.VIDEO}
                />
              </Field>
              {values.type === PostType.VIDEO && (
                <Info text="Video posts will take sometime to reflect in your feed after creation." title="Info" />
              )}
              {values.type === PostType.IMAGES && (
                <FileUpload
                  accept="image/*"
                  className={styles.fileUpload}
                  multi
                  name="images"
                />
              )}
              {values.type === PostType.VIDEO && (
                <div className={styles.videoBar}>
                  <div>
                    <span>Thumbnail</span>
                    <FileUpload
                      accept="image/*"
                      className={styles.fileUpload}
                      name="thumbnail"
                      add={!values.thumbnail}
                    />
                  </div>
                  <div>
                    <span>Video</span>
                    <FileUpload
                      accept="video/*"
                      className={styles.fileUpload}
                      name="video"
                      add={!values.video}
                    />
                  </div>
                </div>
              )}
              <TextArea rows={5} name="description" placeholder="Description" />
              <Select2
                name="categories"
                placeholder="Categories"
                options={categoryList}
                isMulti
              />
              <HashTagSelect
                name="hashTags"
                placeholder="Hash Tags"
                isMulti
              />
              {openProduct && (<CreateProduct prefix="product" />)}

              {!openProduct && (
                <div className={styles.tagButtonContainer}>
                  <ButtonComponent
                    style={styles.productButton}
                    onclick={attachProduct(setFieldValue)}
                    text="Add as Product"
                  />
                  <ButtonComponent
                    onclick={toggle}
                    text="Tag Products"
                  />
                </div>
              )}
              {values.products?.length > 0 && <ListProducts products={values.products} />}
              <div className={styles.submit}>
                <ButtonComponent
                  onclick={submitForm}
                  text={openProduct ? 'Create' : 'Create Post'}
                />
              </div>
              {open && (
                <ProductsDrawer
                  onClose={onDrawClose(setFieldValue)}
                  title="Tag Products"
                  initial={values.products}
                  filters={{ status: ['live', 'created'] }}
                />
              )}
            </>
          )}
        </Formik>
      </div>
      {progress !== null && <UploadProgress type="linear" text="Please Wait ..." progress={progress} />}
    </Drawer>
  );
}

CreatePost.propTypes = {};

CreatePost.defaultProps = {};
