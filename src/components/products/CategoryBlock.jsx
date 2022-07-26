import React from 'react';
import PropTypes from 'prop-types';
import { OtherButton } from 'components/products/OtherButton';
import { useToggle } from 'hooks/common';
import { CategoryDrawer } from 'components/products/CategoryDrawer';
import { Chip, Clickable } from 'phoenix-components';
import { useField } from 'formik';
import styles from './CategoryBlock.module.css';

export function CategoryBlock({ categories }) {
  const [openDraw, toggleDraw] = useToggle(false);
  const [{ value: selectedCat = [] }] = useField('categories');
  const [{ value: subCategories = [] }] = useField('subCategories');
  const [open, toggle] = useToggle(selectedCat.length > 0);

  return (
    <div className={styles.container}>
      {openDraw && (
        <CategoryDrawer onClose={toggleDraw} categories={categories} />
      )}
      <OtherButton onClick={toggle} label="Category & Sub-category" open={open} />
      {open && (
        <div className={styles.margin}>
          <Clickable className={styles.box} onClick={toggleDraw}>
            <div className={styles.boxTitle}>Select Category</div>
            <div className={styles.categories}>
              {selectedCat.map(c => (
                <Chip
                  label={c}
                  selected={true}
                  clearIcon
                  primary={false}
                />
              ))}
            </div>
          </Clickable>
          <Clickable className={styles.box} onClick={toggleDraw}>
            <div className={styles.boxTitle}>Select Sub Category</div>
            <div className={styles.categories}>
              {subCategories.map(c => (
                <Chip
                  label={c}
                  selected={true}
                  clearIcon
                  primary={false}
                />
              ))}
            </div>
          </Clickable>
        </div>
      )}
    </div>
  );
}

CategoryBlock.propTypes = {
  categories: PropTypes.object.isRequired,
};

CategoryBlock.defaultProps = {};
