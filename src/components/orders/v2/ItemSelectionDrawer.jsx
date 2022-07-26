import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Snackbar from 'services/snackbar';
import { SideDrawer } from 'components/shared/SideDrawer';
import { BottomDrawer } from 'components/shared/BottomDrawer';
import { useDesktop, useShop } from 'contexts';
import { useOrderItems } from 'contexts/orderContext';
import { Button, Clickable } from 'phoenix-components';
import selectIcon from 'assets/v2/orders/selectv2.svg';
import unSelectIcon from 'assets/v2/orders/unselectV2.svg';
import { useToggle } from 'hooks/common';
import Alert from 'components/shared/alert/Alert';
import styles from './ItemSelectionDrawer.module.css';

export function ItemSelectionDrawer({
  onClose,
  onSubmit
}) {
  const isDesktop = useDesktop();
  const { currency } = useShop();
  const [selectedItems, setItems] = useState([]);
  const [open, toggleOpen] = useToggle();
  const items = useOrderItems();
  const itemSet = new Set(selectedItems);
  const Component = isDesktop ? SideDrawer : BottomDrawer;
  const allSelected = selectedItems.length === items.length;

  const onAdd = (item) => {
    const hasPhysicalAndDigital = selectedItems.find(selectedItem => (
      selectedItem?.productType !== item?.productType
    ));
    const hasMultiDigitalProdcuts = selectedItems.find(selectedItem => (
      selectedItem?.productType === item?.productType && item?.productType === 'digital'
    ));
    if (hasPhysicalAndDigital || hasMultiDigitalProdcuts) {
      Snackbar.showError("Can't select both physical and digital");
      return;
    }
    const set = new Set(selectedItems);
    if (set.has(item)) {
      set.delete(item);
    } else {
      set.add(item);
    }
    setItems([...set]);
  };

  const selectAll = () => {
    const filteredItems = items.filter(product => product.productType === 'physical');
    if (filteredItems.length !== items.length) {
      Snackbar.showError("Can't select both physical and digital");
      return;
    }
    if (allSelected) {
      setItems([]);
    } else {
      setItems(items);
    }
  };

  const onSubmitClick = () => {
    if (selectedItems.length === 0) {
      toggleOpen();
      return;
    }
    onSubmit(selectedItems);
  };

  const renderItem = item => {
    const image = item?.content?.images[0]?.url;
    const variant = item?.content?.details;
    const color = item?.content?.color;
    return (
      <>
        <div className={styles.imageContainer}>
          <img src={image} alt="" />
        </div>
        <div>
          <div className={styles.firstRow}>
            <div className={styles.title}>
              {item.content.title}
            </div>
            <div className={styles.price}>
              {currency}
              {' '}
              {item.discountedAmount}
            </div>
          </div>
          <div className={styles.firstRow}>
            {variant?.name && variant?.value && (
              <div className={styles.variant}>
                {variant.name}
                {' '}
                :
                {' '}
                {variant.value}
              </div>
            )}
            <div className={styles.quantity}>
              {item.quantity}
              {' '}
              Qty
            </div>
            {color && color?.hex && (
              <div className={styles.color} style={{ background: color?.hex }}>
              </div>
            )}
          </div>
        </div>
        <div className={styles.select}>
          <img src={itemSet.has(item) ? selectIcon : unSelectIcon} alt="" />
        </div>
      </>
    );
  };

  return (
    <Component
      title="Choose Items"
      backButton
      onClose={onClose}
      closeButton={false}
      button
      classes={isDesktop ? undefined : {
        heading: styles.bottomDrawerContainer,
      }}
      onClick={isDesktop ? onSubmitClick : undefined}
      btnLabel={isDesktop ? 'Next' : undefined}
    >
      {open && (
        <Alert
          btnText="Ok"
          text="Oops! You haven't ticked the items you'd like to proceed with."
          onClick={toggleOpen}
        />
      )}
      {!isDesktop && (
        <div className={styles.borderBottom} />
      )}
      <Clickable onClick={selectAll} className={styles.selectAll}>
        <span>
          {allSelected ? 'Unselect' : 'Select'}
          {' '}
          All
        </span>
        <img src={allSelected ? selectIcon : unSelectIcon} alt="" />
      </Clickable>
      <div className={styles.container}>
        {items.map(item => (
          <Clickable onClick={() => onAdd(item)} key={item._id} className={styles.itemContainer}>
            {renderItem(item)}
          </Clickable>
        ))}
      </div>
      {!isDesktop && (
        <div className={styles.submit}>
          <Button fullWidth label="Next" size="large" bordered={false} onClick={onSubmitClick} />
        </div>
      )}
    </Component>
  );
}

ItemSelectionDrawer.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

ItemSelectionDrawer.defaultProps = {};
