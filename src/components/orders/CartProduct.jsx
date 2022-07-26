import React from 'react';
import PropTypes from 'prop-types';
import { useShop } from 'contexts/userContext';
import styles from './CartDetails.module.css';

function CartProduct({ product }) {
  const shop = useShop();
  const image = product?.images[0]?.url;

  return (
    <div className={styles.containerCard}>
      <div className={styles.imageContainer}>
        <img src={image} alt="" />
      </div>
      <div className={styles.otherDetails}>
        <div className={styles.title}>
          {product?.title}
        </div>
        <div className={styles.title}>
          {shop.currency}
          {' '}
          {product?.discountedAmount}
        </div>
        <div className={styles.variants}>
          <div className={styles.qty}>
            {product?.quantity}
            {' '}
            Qty
          </div>
          {product?.details && (
            <>
              <div className={styles.lineV} />
              <div className={styles.size}>
                {product?.details?.value}
              </div>
            </>
          )}
          {product?.color && (
            <>
              <div className={styles.lineV} />
              <div className={styles.colorBox} style={{ background: product?.color?.hex }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

CartProduct.propTypes = {
  product: PropTypes.object.isRequired,
};

export default CartProduct;
