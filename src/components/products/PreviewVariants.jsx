import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import cx from 'classnames';
import { getVariations } from './Utils';
import styles from './PreviewVariants.module.css';

export function PreviewVariants({ variants }) {
  const variations = getVariations(variants);
  return (
    <div className={styles.root}>
      <div className={cx(styles.head, 'textCenter fullWidth bold')}> Customer Preview </div>
      <div className={styles.variantSec}>
        {Object.keys(variations || {})?.map(y => (
          <>
            <div className="marginSTopBottom textCapital fs14 textLeft">
              {`Select ${y}`}
            </div>
            <div className={styles.flex}>
              {variations[y].map(x => (
                <>
                  {y !== 'color' && (
                    <Button
                      variant="contained"
                      size="small"
                      data-id="product_detail_variant"
                      data-value={`${y}-${x}`}
                      style={{
                        padding: y === 'color' ? '' : 'var(--s-spacing) var(--l-spacing)',
                        border: y === 'color' ? 'none' : '1px solid var(--new-primary)',
                        backgroundColor: (y === 'color' ? x : 'var(--secondary)'),
                        color: y === 'color' ? x : 'var(--black)',
                      }}
                      className={cx(styles.btn)}
                    >
                      {y === 'color' ? '' : x}
                    </Button>
                  )}
                  {y === 'color' && (
                    <div
                      className={styles.outer}
                      style={{
                        border: `2px solid ${x}`
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        style={{
                          backgroundColor: x,
                        }}
                        data-id="product_detail_variant"
                        data-value={`${y}-${x}`}
                        className={cx(styles.btnC)}
                      >
                      </Button>
                    </div>
                  )}
                </>
              ))}
            </div>
          </>
        ))}
        {Object.keys(variations || {}).length === 0 && (
          <div className="fs16 marginMTopBottom"> Please add variants to preview </div>
        )}
      </div>
    </div>
  );
}

PreviewVariants.propTypes = {
  variants: PropTypes.array.isRequired,
};

PreviewVariants.defaultProps = {};
