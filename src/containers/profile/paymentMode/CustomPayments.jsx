import React, { useState } from 'react';
import { useToggle } from 'hooks/common';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Button } from 'phoenix-components';
import { SideDrawer } from 'components/shared/SideDrawer';
import { Drawer } from 'components/shared/Drawer';
import { useField } from 'formik';
import { useDesktop } from 'contexts';
import Form from './Form';
import Card from './Card';
import styles from './CustomPayments.module.css';

function CustomPayments({ toggleSave }) {
  const isDesktop = useDesktop();
  const [index, setIndex] = useState(0);
  const [{ value: customPayments = [] }, , { setValue }] = useField('custompayment.configured');
  const [, , { setValue: setCpEnabled }] = useField('custompayment.enabled');
  const isEmpty = customPayments.length === 0;
  const [form, toggleForm, setForm] = useToggle(false);

  const addPayment = () => {
    const newItems = customPayments.concat({
      mode: '',
      details: '',
      receiptsRequired: true,
      status: 'live',
      isNew: true,
    });
    setValue(newItems);
    setCpEnabled(true);
    toggleForm();
  };

  const closeDrawer = () => {
    const { mode, details } = customPayments[index];
    if (!mode && !details) {
      const all = customPayments.filter((x, i) => i !== index);
      setValue(all);
      toggleSave();
    }
    toggleForm();
  };

  return (
    <>
      {!isDesktop && (
        <div>
          {form && (
            <Drawer
              onClose={closeDrawer}
              closeButton
              title="Details of Custom Payment"
            >
              <Form
                index={index}
                onSave={() => {
                  toggleForm();
                  toggleSave();
                }}
              />
            </Drawer>
          )}
          {isEmpty && (
            <div className={cx(styles.btnSection, 'flexCenter')}>
              <Button
                primary={false}
                label="Add"
                size="small"
                onClick={addPayment}
              />
            </div>
          )}
          {!isEmpty && (
            <>
              <div className={cx(styles.addedPayments, 'flexCenter')}>
                <div className={styles.label}> Added Payments </div>
              </div>
              {customPayments.map((x, i) => <Card key={i} toggleSave={toggleSave} index={i} />)}
              <div className={cx(styles.btnSection, 'flexCenter')}>
                <Button
                  label="Add More"
                  size="small"
                  onClick={() => {
                    setIndex(customPayments?.length);
                    addPayment();
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}
      {isDesktop && (
        <div className={styles.main}>
          {form && (
            <SideDrawer
              backButton={true}
              onClick={toggleForm}
              onClose={() => setForm(false)}
              title="Use custom payments"
            >
              <Form
                index={index}
                onSave={() => {
                  toggleForm();
                  toggleSave();
                }}
              />
            </SideDrawer>
          )}
          {isEmpty && (
            <div className={cx(styles.btnSection, 'flexCenter')}>
              <Button
                primary={false}
                label="Add"
                size="small"
                onClick={addPayment}
              />
            </div>
          )}
          {!isEmpty && (
            <>
              <div className={cx(styles.addedPayments, 'flexCenter')}>
                <div className={styles.label}> Added Payments </div>
              </div>
              {customPayments.map((x, i) => <Card index={i} toggleSave={toggleSave} />)}
              <div className={cx(styles.btnSection, 'flexCenter')}>
                <Button
                  primary={false}
                  label="Add More"
                  size="small"
                  onClick={() => {
                    setIndex(customPayments?.length);
                    addPayment();
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}
    </>

  );
}

CustomPayments.propTypes = {
  toggleSave: PropTypes.func,
};

CustomPayments.defaultProps = {
  toggleSave: () => { }
};

export default CustomPayments;
