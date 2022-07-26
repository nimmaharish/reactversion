import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardContent, Dialog
} from '@material-ui/core';
import { BottomDrawer } from 'components/shared/BottomDrawer';
import { Chip, Button } from 'phoenix-components';
import { useField } from 'formik';
import { useDesktop } from 'contexts';
import styles from './CategoryDrawer.module.css';

export function CategoryDrawer({ onClose, categories }) {
  const isDesktop = useDesktop();
  const [{ value: selectedCat = [] }, , { setValue: setCategories }] = useField('categories');
  const [{ value: selectedSubCat = [] }, , { setValue: setSubCategories }] = useField('subCategories');

  const cats = Object.keys(categories);

  const setCategory = (value) => () => {
    if (selectedCat.includes(value)) {
      setCategories(selectedCat.filter(x => x !== value));
      const items = categories[value].map(x => x.label);
      const filtered = selectedSubCat.filter(x => !items.includes(x));
      setSubCategories(filtered);
      return;
    }
    setCategories([...selectedCat, value]);
  };

  const setSubCategory = (value) => () => {
    if (selectedSubCat.includes(value)) {
      setSubCategories(selectedSubCat.filter(x => x !== value));
      return;
    }
    setSubCategories([...selectedSubCat, value]);
  };

  return (
    <>
      {!isDesktop && (
        <BottomDrawer
          classes={{
            heading: styles.heading,
          }}
          onClose={onClose}
          title="Select Category"
          closeButton
        >
          <div className={styles.container}>
            <div className={styles.row}>
              {cats.map(c => (
                <Chip
                  label={c}
                  key={c}
                  selected={selectedCat.includes(c)}
                  onSelect={setCategory(c)}
                  clearIcon
                />
              ))}
            </div>
            {selectedCat?.length > 0 && (
              <div className={styles.subHeading}>
                Select sub categories
              </div>
            )}
            {selectedCat.map(c => (
              <div>
                <div className={styles.subCatHeading}>
                  {c}
                </div>
                <div className={styles.row}>
                  {categories[c].map(sub => (
                    <Chip
                      label={sub.label}
                      key={sub.value}
                      selected={selectedSubCat.includes(sub.value)}
                      onSelect={setSubCategory(sub.value)}
                      clearIcon
                    />
                  ))}
                </div>
              </div>
            ))}
            <div className={styles.button}>
              <Button
                label="Save"
                primary={true}
                onClick={onClose}
              />
            </div>
          </div>
        </BottomDrawer>
      )}

      {isDesktop && (
        <Dialog open={true} onClose={onClose} fullWidth>
          <div className={styles.card}>
            <Card>
              <CardContent>
                <div className={styles.container}>
                  <div className={styles.row}>
                    {cats.map(c => (
                      <Chip
                        label={c}
                        key={c}
                        selected={selectedCat.includes(c)}
                        onSelect={setCategory(c)}
                        clearIcon
                      />
                    ))}
                  </div>
                  {selectedCat?.length > 0 && (
                    <div className={styles.subHeading}>
                      Select sub categories
                    </div>
                  )}
                  {selectedCat.map(c => (
                    <div>
                      <div className={styles.subCatHeading}>
                        {c}
                      </div>
                      <div className={styles.row}>
                        {categories[c].map(sub => (
                          <Chip
                            label={sub.label}
                            key={sub.value}
                            selected={selectedSubCat.includes(sub.value)}
                            onSelect={setSubCategory(sub.value)}
                            clearIcon
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className={styles.button}>
                    <Button
                      label="Save"
                      primary={true}
                      onClick={onClose}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Dialog>
      )}
    </>
  );
}

CategoryDrawer.propTypes = {
  onClose: PropTypes.func.isRequired,
  categories: PropTypes.object.isRequired,
};

CategoryDrawer.defaultProps = {};
