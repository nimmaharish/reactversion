import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent } from '@material-ui/core';
import { Formik } from 'formik';
import { getInitialProductValues, marshallProductData } from 'components/posts/utils';
import { productSchema } from 'components/posts/schema';
import { CreateProduct } from 'components/posts/CreateProduct';
import { Button } from 'phoenix-components';
import { Nikon } from 'api';
import SnackBar from 'services/snackbar';
import { useDesktop } from 'contexts';
import { useShop } from 'contexts/userContext';
import Loader from 'services/loader';
import styles from './CreateProductDialog.module.css';

export function CreateProductDialog({
  onClose,
  id
}) {
  const shop = useShop();
  const isDesktop = useDesktop();
  const onSubmit = async (values, helpers) => {
    helpers.setSubmitting(true);
    try {
      Loader.show();
      const data = marshallProductData(values, shop);
      await Nikon.createProduct(data, id);
      SnackBar.show('Product will be created within few minutes', 'success');
      onClose();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
    helpers.setSubmitting(false);
  };
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogContent>
        <Formik
          initialValues={getInitialProductValues({})}
          validationSchema={productSchema}
          onSubmit={onSubmit}
        >
          {({ submitForm }) => (
            <>
              <CreateProduct />
              <br />
              {isDesktop ? (
                <div className="flexCenter">
                  <Button
                    label="Create Product"
                    onClick={submitForm}
                    className={styles.createProductButton}
                  />
                </div>
              ) : (
                <Button
                  label="Create Product"
                  onClick={submitForm}
                  fullWidth
                />
              )}
            </>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}

CreateProductDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

CreateProductDialog.defaultProps = {};
