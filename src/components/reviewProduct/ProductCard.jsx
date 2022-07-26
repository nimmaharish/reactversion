import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cx from 'classnames';
import { Clickable } from 'phoenix-components';
import { useShop } from 'contexts/userContext';
import { useToggle } from 'hooks/common';
import unchecked from 'assets/images/payments/unselect.svg';
import checked from 'assets/v2/products/checked.svg';
import { RatingsShare } from 'components/reviewProduct/RatingsShare';
import styles from './ProductCard.module.css';

export function ProductCard({ product, onShareOpen, measure }) {
  const image = _.get(product, 'images[0].url', '');
  const shop = useShop();
  const [openShare, toggleShare] = useToggle(false);

  const onClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleShare();
    onShareOpen(openShare);
    measure();
  };

  const variations = product.variations?.values ? product.variations?.values.join(', ') : '';
  const { colors = [] } = product;

  const { amount, discountedAmount } = product;

  const discount = (((amount - discountedAmount) / amount) * 100).toFixed(0);

  return (
    <Clickable
      className={cx(styles.root)}
    >
      <div onClick={onClick} className={styles.section}>
        <div className={styles.container}>
          <div className={styles.left}>
            <img src={image} alt="" loading="lazy" />
          </div>
          <div className={styles.column}>
            <div className={styles.row1}>
              <div className={styles.title} translate="no">
                {product.title}
              </div>
              <div
                role="presentation"
                onClick={onClick}
              >
                <img src={openShare ? checked : unchecked} className={styles.icon} alt="" />
              </div>
            </div>
            {product.variations && (
              <div className={cx(styles.row)}>
                <div className={styles.variations}>
                  <div className={styles.nameSection}>
                    {variations.slice(0, 24)}
                    {variations.length > 24 ? '...' : ''}
                  </div>
                  <div className={styles.colorsSection}>
                    {colors.map(x => (
                      <div>
                        <div className={styles.colorBox} style={{ background: x.hex }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className={cx(styles.row, styles.noMar)}>
              <div
                className={cx(styles.price, {
                  [styles.noBorder]: product.variantCount === 1 && product.amount === product.discountedAmount,
                })}
              >
                {`${shop.currency} ${(product?.discountedAmount || 0).toFixed(2)}`}
              </div>
              <div
                className={styles.variantCount}
              >
                {product.amount !== product.discountedAmount && (
                  <>
                    <span className={styles.amount}>
                      {`${shop.currency} ${product.amount?.toFixed(2)}`}
                    </span>
                    <span className={styles.discount}>
                      {discount}
                      % OFF
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {openShare && (
          <RatingsShare shop={shop} product={product} />
        )}
      </div>
    </Clickable>
  );
}

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onShareOpen: PropTypes.func.isRequired,
  measure: PropTypes.func.isRequired,
};
