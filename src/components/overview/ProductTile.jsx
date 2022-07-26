import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import ms from 'ms';
import cx from 'classnames';
import styles from './ProductTile.module.css';

export function ProductTile({ product }) {
  const history = useHistory();
  const url = _.get(product, 'images[0].url', '');
  const date = ms(Date.now() - new Date(product.createdAt));

  const status = product.status === 'created' || product.status === 'live' ? 'live' : product.status;

  const onClick = () => {
    history.push(`/products/product/${product._id}`);
  };

  return (
    <div onClick={onClick} className={styles.container}>
      <div className={styles.left}>
        <img src={url} alt="..." />
      </div>
      <div className={styles.center}>
        <div className={styles.line1}>
          <div className={styles.title}>{product?.title}</div>
        </div>
        <div className={styles.line3}>
          <div className={cx(styles.button)}>
            {`${product.variantCount} variants`}
          </div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.line1}>
          <div className={cx(styles.dot, styles[status])} />
          <div className={styles.status}>
            {status}
          </div>
        </div>
        <div className={cx(styles.line3, styles.date)}>
          {date}
          {' '}
          ago
        </div>
      </div>
    </div>
  );
}

ProductTile.propTypes = {
  product: PropTypes.object.isRequired,
};

ProductTile.defaultProps = {};
