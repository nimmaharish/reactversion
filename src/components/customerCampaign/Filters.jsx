import React from 'react';
import { useToggle } from 'hooks/common';
import cx from 'classnames';
import { useQueryParams } from 'hooks';
import { Button } from '@material-ui/core';
import notAppliedIcon from 'assets/images/payments/filter.svg';
import appliedIcon from 'assets/images/payments/filterSel.svg';
import PropTypes from 'prop-types';
import { ProductsDrawer } from './ProductsDrawer';
import { OrderValueForm } from './OrderValueForm';
import styles from './Filters.module.css';

function Filters({ setSkuIds, setOrderValue }) {
  const params = useQueryParams();
  const isOrder = params.has('Order value');
  const isProduct = params.has('Products');
  const [openProducts, toggleProducts] = useToggle(false);
  const [openValues, toggleValues] = useToggle();

  return (
    <>
      {openProducts && (
        <ProductsDrawer
          onClose={(e) => {
            toggleProducts();
            setSkuIds(e);
          }}
        />
      )}
      {openValues && (
        <OrderValueForm
          onClose={toggleValues}
          onSubmit={(e) => {
            setOrderValue(e);
            toggleValues();
          }}
        />
      )}
      <div className={styles.container}>
        <Button
          onClick={toggleProducts}
          className={cx(styles.button, {
            [styles.btnActive]: isProduct
          })}
          endIcon={<img src={isProduct ? appliedIcon : notAppliedIcon} alt="" />}
        >
          Products
        </Button>
        <Button
          onClick={toggleValues}
          className={cx(styles.button, {
            [styles.btnActive]: isOrder
          })}
          endIcon={<img src={isOrder ? appliedIcon : notAppliedIcon} alt="" />}
        >
          Order value
        </Button>
      </div>
    </>
  );
}

Filters.propTypes = {
  setSkuIds: PropTypes.func.isRequired,
  setOrderValue: PropTypes.func.isRequired,
};

export default Filters;
