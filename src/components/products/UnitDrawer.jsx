import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BottomDrawer } from 'components/shared/BottomDrawer';
import { Chip } from 'phoenix-components';
import { useField } from 'formik';
import {
  Dialog
} from '@material-ui/core';
import { unitTypes } from 'components/products/variantUtils';
import { Button, ReactInput, Clickable } from 'phoenix-components';
import Storage from 'services/storage';
import closeIcon from 'assets/images/orders/list/close.svg';
import { useDesktop } from 'contexts';
import SnackBar from 'services/snackbar';
import styles from './UnitDrawer.module.css';

export function UnitDrawer({
  prefix,
  onClose
}) {
  const [{ value },, { setValue }] = useField(prefix);
  const [custom, setCustom] = useState('');
  const isDesktop = useDesktop();

  const getUnits = () => {
    const units = Storage.getUnits('units');
    if (units) {
      return [...unitTypes, ...units];
    }
    return unitTypes;
  };

  const addUnit = () => {
    if (custom.length === 0) {
      SnackBar.show('Please add unit', 'error');
      return;
    }
    if (getUnits().includes(custom)) {
      SnackBar.show('Unit Already exists', 'error');
      return;
    }
    Storage.addUnit(custom);
    SnackBar.show('Unit added successfully', 'success');
    setCustom('');
  };

  const onChange = (type) => () => {
    setValue(type);
    onClose();
  };

  return (
    <>
      {!isDesktop && (
        <BottomDrawer
          title="Choose product unit"
          onClose={onClose}
          classes={{
            heading: styles.heading,
          }}
          closeButton
        >
          <div className={styles.container}>
            {getUnits().map(type => (
              <Chip
                label={type}
                key={type}
                selected={value === type}
                onSelect={onChange(type)}
              />
            ))}
          </div>
          <div className={styles.border}>
            <ReactInput
              value={custom}
              label="Add custom unit"
              placeholder="e.g. Gram"
              setValue={setCustom}
            />
            <div className={styles.footer}>
              <Button
                primary={false}
                label="Add"
                size="medium"
                onClick={addUnit}
              />
            </div>
          </div>
        </BottomDrawer>
      )}
      {isDesktop && (
        <>
          <Dialog
            open={true}
            onClose={onClose}
            fullWidth
          >

            <div className={styles.head}>
              <div className={styles.text}>
                Choose product unit
              </div>
              <div className="flexEnd">
                <Clickable
                  onClick={onClose}>
                  <img src={closeIcon} alt="" />
                </Clickable>
              </div>
            </div>
            <div className={styles.container}>
              {getUnits().map(type => (
                <Chip
                  label={type}
                  key={type}
                  selected={value === type}
                  onSelect={onChange(type)} />
              ))}
            </div>
            <div className={styles.border1}>
              <ReactInput
                value={custom}
                label="Add custom unit"
                placeholder="e.g. Gram"
                setValue={setCustom} />
              <div className={styles.footer}>
                <Button
                  primary={false}
                  label="Add"
                  size="medium"
                  onClick={addUnit} />
              </div>
            </div>

          </Dialog>
        </>
      )}
    </>
  );
}

UnitDrawer.propTypes = {
  prefix: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

UnitDrawer.defaultProps = {};
