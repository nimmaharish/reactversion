import React from 'react';
import { CheckBox } from 'phoenix-components/lib/formik';
import visibilityIcon from 'assets/overview/visibility.svg';
import styles from './Visibility.module.css';

const BOXES = [
  {
    label: 'Home',
    value: 'home'
  },
  {
    label: 'Product Details',
    value: 'pdp'
  },
  {
    label: 'Cart',
    value: 'cart'
  },
  {
    label: 'Featured Products',
    value: 'featured'
  },
  {
    label: 'Product List',
    value: 'productList'
  },
  {
    label: 'Search',
    value: 'search'
  },
  {
    label: 'Catalog List',
    value: 'catalogList'
  },
];

export function Visibility() {
  return (
    <div>
      <div className={styles.hintContainer}>
        <img
          src={visibilityIcon}
          className={styles.imgH}
          alt="" />
        <div className={styles.hintText}>
          Decide where to show the Hello Bar from
          restricting it form showing in all the screens
        </div>
      </div>
      <div className={styles.boxes}>
        {BOXES.map(box => (
          <CheckBox label={box.label} name={`visibility.${box.value}`} key={box.value} />
        ))}
      </div>
    </div>
  );
}

Visibility.propTypes = {};

Visibility.defaultProps = {};
