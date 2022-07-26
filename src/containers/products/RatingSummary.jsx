import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import star from 'assets/images/products/star.svg';
import styles from './RatingSummary.module.css';

export function RatingSummary({
  product
}) {
  return (
    <div className={styles.container}>
      <div className={styles.ratingBar}>
        <div
          className={styles.average}
        >
          <div className={styles.ratingCount}>
            {product?.ratings?.avg || 0}
            <img src={star} alt="" />
          </div>
          <div className={styles.customerReviewCount}>
            {' '}
            {product?.ratings?.total || 0}
            {' '}
            Reviews
          </div>
        </div>
        <div
          className={styles.list}
        >
          {[5, 4, 3, 2, 1].map(x => (
            <div key={x} className={styles.line}>
              <div className={styles.lineLeft}>
                {x}
                <img src={star} alt="" />
              </div>
              <div className={styles.lineRight}>
                <div
                  className={cx(styles.greenLine, {
                    [styles.poorLine2]: x === 2,
                    [styles.poorLine1]: x === 1,
                  })}
                >
                </div>
                <div>{product?.ratings && product?.ratings[x]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

RatingSummary.propTypes = {
  product: PropTypes.object.isRequired,
};

RatingSummary.defaultProps = {};
