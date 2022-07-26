import React from 'react';
import { useField } from 'formik';
import PropTypes from 'prop-types';
import { Switch } from 'phoenix-components';
import { useToggle } from 'hooks/common';
import { Drawer } from 'components/shared/Drawer';
import PencilIcon from 'assets/images/address/edit.svg';
import { SideDrawer } from 'components/shared/SideDrawer';
import { useDesktop } from 'contexts';
import Form from './Form';
import styles from './Card.module.css';

function Card({ index, toggleSave }) {
  const prefix = `custompayment.configured[${index}]`;

  const [{ value: customPayment }, , { setValue }] = useField(prefix);
  const [{ value: customPayments }] = useField('custompayment');
  const [, , { setValue: setCpEnabled }] = useField('custompayment.enabled');
  const [form, toggleForm] = useToggle(false);
  const isDesktop = useDesktop();

  const onUnlive = () => {
    const status = customPayment.status === 'live' ? 'unlive' : 'live';
    setValue({
      ...customPayment,
      status: customPayment.status === 'live' ? 'unlive' : 'live',
    });
    if (customPayments.configured.filter(x => x.status === 'live').length === 0 && status === 'unlive') {
      setCpEnabled(false);
    }
    toggleSave();
  };

  if (isDesktop) {
    return (
      <div className={styles.main}>
        {form && (
          <SideDrawer
            backButton={true}
            onClick={() => {
              toggleForm();
              toggleSave();
            }}
            onClose={toggleForm}
            title="Details of Custom Payment"
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
        <div className={styles.header}>
          <div className={styles.mode}>{customPayment?.mode}</div>
          <Switch
            active={customPayment?.status === 'live'}
            onChange={onUnlive}
          />
        </div>
        <div className={styles.content}>
          <div className={styles.html} dangerouslySetInnerHTML={{ __html: customPayment.details }}></div>
          <img src={PencilIcon} alt="" onClick={toggleForm} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.main}>
      {form && (
        <Drawer
          onClose={toggleForm}
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
      <div className={styles.header}>
        <div className={styles.mode}>{customPayment?.mode}</div>
        <Switch
          active={customPayment?.status === 'live'}
          onChange={onUnlive}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.html} dangerouslySetInnerHTML={{ __html: customPayment.details }}></div>
        <img src={PencilIcon} alt="" onClick={toggleForm} />
      </div>
    </div>
  );
}

Card.propTypes = {
  index: PropTypes.number.isRequired,
  toggleSave: PropTypes.func,
};

Card.defaultProps = {
  toggleSave: () => {}
};

export default Card;
