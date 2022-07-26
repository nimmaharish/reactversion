import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Button, Clickable, Radio } from 'phoenix-components';

import { useDesktop, useShop } from 'contexts';

import { allowedCountries } from 'constants/shop';

import { useToggle } from 'hooks/common';

import { SideDrawer } from 'components/shared/SideDrawer';
import { BottomDrawer } from 'components/shared/BottomDrawer';
import UploadProduct from 'components/products/UploadProduct.jsx';
import { NoteDialog } from 'components/orders/v2/NoteDialog';
import Alert from 'components/shared/alert/Alert';
import { DeleteAlert } from 'components/shared/DeleteAlert.jsx';

import styles from './StatusDrawer.module.css';

export function CommonStatusDrawer({
  onClose,
  onSubmit,
  statusList,
  onStartShipping,
  showStartShipping,
  title,
  items
}) {
  const shop = useShop();
  const [status, setStatus] = useState(null);
  const [openNote, toggleNote] = useToggle();
  const [openAlert, toggleAlert] = useToggle();
  const isDesktop = useDesktop();
  const isCountryEnabled = allowedCountries.includes(shop?.country?.toLowerCase());
  const [openUploadCard, toggleUploadCard] = useState(false);
  const [openSendProduct, toggleSendProduct] = useState(false);
  const digitalProducts = items.filter(product => product?.productType === 'digital');
  const isDigital = digitalProducts?.length > 0;

  const onSetStatus = (value) => (e) => {
    e.stopPropagation();
    setStatus(value);
  };

  const onUpdate = (nt) => {
    if (!status) {
      toggleAlert();
      return;
    }
    onSubmit(status, nt, digitalProducts[0]?.links);
  };

  const onUpdateWithNote = (nt) => {
    toggleNote();
    onUpdate(nt);
  };

  const openNoteDialog = () => {
    if (!status) {
      toggleAlert();
      return;
    }
    toggleNote();
  };

  const Component = isDesktop ? SideDrawer : BottomDrawer;

  return (
    <Component
      title={title}
      backButton
      onClose={onClose}
      classes={isDesktop ? undefined : {
        heading: styles.bottomDrawerContainer,
      }}
    >
      {isDigital && title === 'Shipping Status' ? (
        <div className={styles.sendProductBtn}>
          {openSendProduct ? (
            <DeleteAlert
              title="Your digital product will be sent by mail to the customer and
               the status of the order will be updated as Delivered."
              primary="Confirm"
              onCancel={() => toggleSendProduct(!openSendProduct)}
              onDelete={() => {
                if (!status) {
                  onStartShipping();
                } else onUpdate();
                toggleSendProduct(!openSendProduct);
                toggleUploadCard(!openUploadCard);
              }}
            />
          ) : null}
          {openUploadCard ? (
            <UploadProduct
              onBack={() => toggleUploadCard(!openUploadCard)}
              onUpload={(product) => {
                digitalProducts[0].links = [];
                digitalProducts[0].links.push(...product);
              }}
              onSave={() => {
                setStatus('delivered');
                toggleSendProduct(true);
              }}
              digitalProducts={digitalProducts[0]?.links}
              eitherIsMandatory={true}
            />
          ) : null}
        </div>
      ) : null}

      {openNote && (
        <NoteDialog onSubmit={onUpdateWithNote} onClose={toggleNote} />
      )}
      {openAlert && (
        <Alert btnText="Ok" text="Select Status" onClick={toggleAlert} />
      )}
      {!isDesktop && (
        <div className={styles.borderBottom} />
      )}
      <div className={styles.container}>
        {showStartShipping && isCountryEnabled && (
          <div className={styles.shippingButton}>
            <Button
              fullWidth={!isDesktop}
              size="large"
              label={isDigital ? 'Send Product' : 'Ship Via Partner'}
              onClick={isDigital ? () => toggleUploadCard(!openUploadCard) : onStartShipping} />
          </div>
        )}
        <div className={styles.statuses}>
          {statusList.map(x => (
            <Clickable
              key={x.value}
              onClick={onSetStatus(x.value)}
              className={cx(styles.radio, {
                [styles.selected]: status === x.value,
              })}
            >
              <div>{x.label}</div>
              <Radio
                label=""
                value={x.value}
                selected={status === x.value}
              />
            </Clickable>
          ))}
        </div>
      </div>
      <div className={styles.bottomButtons}>
        <Clickable
          className={styles.secondary}
          onClick={openNoteDialog}
        >
          Update Status With Note
        </Clickable>
        <Clickable className={styles.primary} onClick={() => onUpdate('')}>
          Update Status
        </Clickable>
      </div>
    </Component>
  );
}

CommonStatusDrawer.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  statusList: PropTypes.array.isRequired,
  onStartShipping: PropTypes.func,
  showStartShipping: PropTypes.bool,
  title: PropTypes.string,
  items: PropTypes.array
};

CommonStatusDrawer.defaultProps = {
  onStartShipping: () => { },
  showStartShipping: false,
  title: 'Update',
  items: []
};
