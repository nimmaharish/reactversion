import React from 'react';
import PropTypes from 'prop-types';
import { useProducts } from 'hooks';
import { useToggle } from 'hooks/common';
import _ from 'lodash';
import { LightBlueTile } from 'components/cards';
import { ProductsDrawer } from 'components/shared/ProductsDrawer';
import { useDesktop } from 'contexts';
import styles from './ListProducts.module.css';
import ProductsPopUp from '../../containers/products/Drawers/ProductPopUp.jsx';

export function ListProducts({ products }) {
  const [productList] = useProducts(0, {
    _id: {
      $in: products.slice(0, 3)
    }
  });

  const [open, toggle] = useToggle(false);
  const isDesktop = useDesktop();

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div>
          Added
          {' '}
          {products.length ?? 0}
          {' '}
          Products
        </div>
        {products.length > 3 && (
          <div onClick={toggle}>View All</div>
        )}
      </div>
      {productList && productList.length && (
        <div className={styles.products}>
          {productList.map(p => (
            <div className={styles.previewContainer}>
              <LightBlueTile key={p._id} className={styles.block}>
                <img src={_.get(p, 'images[0].url')} alt="" />
              </LightBlueTile>
              <div className={styles.title}>{p.title}</div>
            </div>
          ))}
        </div>
      )}
      {open && (isDesktop ? (
        <ProductsPopUp
          title="Attached Products"
          allowCheck={false}
          onClose={toggle}
          initial={[]}
          filters={{
            _id: {
              $in: products
            }
          }}
        />
      )
        : (
          <ProductsDrawer
            title="Attached Products"
            allowCheck={false}
            onClose={toggle}
            initial={[]}
            filters={{
              _id: {
                $in: products
              }
            }}
          />
        ))}
    </div>
  );
}

ListProducts.propTypes = {
  products: PropTypes.array.isRequired,
};

ListProducts.defaultProps = {};
