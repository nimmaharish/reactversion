import React from 'react';
import PropTypes from 'prop-types';
import Catalog from 'containers/products/Catalog/List';
import { SideDrawer } from 'components/shared/SideDrawer';
import styles from './CollectionDrawer.module.css';

export function CollectionDrawer({
  onClose,
}) {
  return (

    <SideDrawer
      button={true}
      btnLabel="Save"
      backButton={true}
      // onClick={submitForm}
      onClose={onClose}
      title="Select Collection"
    >
      <div className={styles.container}>
        <Catalog
          from="product"
          // selected={values.catalogs}
          // onSelect={(catalogs) => {
          //   setFieldValue('catalogs', catalogs);
          // }}
        />
      </div>
    </SideDrawer>
  );
}

CollectionDrawer.propTypes = {
  onClose: PropTypes.func.isRequired,
};

CollectionDrawer.defaultProps = {};
