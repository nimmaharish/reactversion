import React from 'react';
import PropTypes from 'prop-types';
import { useVariations } from 'contexts/orderContext';
import styles from './VariantBox.module.css';

export function VariantBox({ showLabel }) {
  const variations = useVariations();

  const renderValue = (key, value) => {
    switch (key) {
      case 'color':
      case 'colour':
        return (
          <div className={styles.colorBox} style={{ background: value }} />
        );
      default:
        return value;
    }
  };

  return (
    <div className={styles.container}>
      {showLabel && (
        <div className={styles.variants}>
          Variant Details
        </div>
      )}
      <div className={styles.variantContainer}>
        {variations.map(v => (
          <div key={v.key} className={styles.variantBox}>
            <div className={styles.variantName}>
              {v.key}
            </div>
            <div className={styles.variantValue}>
              {renderValue(v.key, v.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

VariantBox.propTypes = {
  showLabel: PropTypes.bool,
};

VariantBox.defaultProps = {
  showLabel: true
};
