import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDesktop, useShop } from 'contexts';
import _ from 'lodash';
import infoIcon from 'assets/v2/orders/info.svg';
import { Clickable } from 'phoenix-components';
import { Grid, Popover } from '@material-ui/core';
import { useOrder, useRefresh } from 'contexts/orderContext';
import { getOrderStatusLabel, getPaymentStatusLabel, getShippingStatusLabel } from 'components/orders/v2/statusUtils';
import thIcon from 'assets/images/orders/list/payment.svg';
import tIcon from 'assets/images/orders/list/rocket.svg';
import { RatingsShare } from 'components/reviewProduct/RatingsShare';
import DigitalShippingCard from 'components/orders/v2/DigitalShippingCard';
import fIcon from 'assets/images/orders/list/bag.svg';
import { StatusHistory } from 'components/orders/v2/StatusHistory';
import Loader from 'services/loader';
import Snackbar from 'services/snackbar';
import { Factory } from 'api';
import styles from './Item.module.css';

export function Item({ item }) {
  const shop = useShop();
  const order = useOrder();
  const refreshOrder = useRefresh();
  const { currency } = shop;
  const image = item?.content?.images[0]?.url;
  const variant = item?.content?.details;
  const color = item?.content?.color;
  const [anchorEl, setAnchorEl] = useState(null);
  const isDesktop = useDesktop();
  const [type, setType] = useState('');
  const [history, setHistory] = useState(null);
  const links = item?.links;
  const { productType } = item;

  const openOrderHistory = () => {
    const his = item?.statuses?.orderHistory || [];
    if (his.length === 0) {
      return;
    }
    setHistory(his.map(x => ({
      ...x,
      status: getOrderStatusLabel(x.status),
    })).reverse());
    setType('Order');
  };

  const openPaymentHistory = () => {
    const his = order?.statuses?.paymentHistory || [];
    if (his.length === 0) {
      return;
    }
    setHistory(his.map(x => ({
      ...x,
      status: getPaymentStatusLabel(x.status),
    })).reverse());
    setType('Payment');
  };

  const openShippingHistory = () => {
    const his = item?.statuses?.shippingHistory || [];
    if (his.length === 0) {
      return;
    }
    setHistory(his.map(x => ({
      ...x,
      status: getShippingStatusLabel(x.status),
    })).reverse());
    setType('Shipping');
  };

  const setLinks = async (links) => {
    try {
      Loader.show();
      await Factory.updateStatus(order._id, 'shipping', 'delivered', [item._id], '', {}, links);
      refreshOrder();
    } catch (e) {
      Snackbar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const renderNotePopOver = () => {
    if (!anchorEl) {
      return null;
    }
    return (
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <div className={styles.noteContainer}>
          <img src={infoIcon} alt="" />
          <div>
            <div className={styles.customerNote}>Customer Note</div>
            <div>
              {item?.note}
            </div>
          </div>
        </div>
      </Popover>
    );
  };

  if (isDesktop) {
    return (
      <>
        <div className={styles.container}>
          {history && (
            <StatusHistory type={type} onClose={() => setHistory(null)} history={history} />
          )}
          {renderNotePopOver()}
          <div className={styles.imageContainer}>
            <img src={image} alt="" />
          </div>
          <div className={styles.firstRow}>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <div className={styles.title}>
                  {item.content.title}
                </div>
              </Grid>
              <Grid item md={2}>
                <div className={styles.qty}>
                  Qty
                </div>
              </Grid>
              <Grid item md={2}>
                {color && color?.hex ? (
                  <div className={styles.colorName}>
                    Colors
                  </div>
                ) : (
                  <div className={styles.colorName}>
                    &nbsp;
                  </div>
                )}
              </Grid>
              <Grid item md={2}>
                {!_.isEmpty(item.note) && (
                  <Clickable className={styles.note} onClick={e => setAnchorEl(e.currentTarget)}>
                    <img src={infoIcon} alt="" />
                    <span>View Note</span>
                  </Clickable>
                )}
                {_.isEmpty(item.note) && (
                  <div className={styles.emptyNote}>
                    &nbsp;
                  </div>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item md={6} className={styles.variantRow}>
                <div className={styles.price}>
                  {currency}
                  {' '}
                  {item.discountedAmount}
                </div>
                {variant?.name && variant?.value && (
                  <div className={styles.variant}>
                    {variant.value}
                    {' '}
                    {variant.name}
                  </div>
                )}
              </Grid>
              <Grid item md={2}>
                <div className={styles.qty}>
                  {item.quantity}
                </div>
              </Grid>
              <Grid item md={2}>
                {color && color?.hex && (
                  <div className={styles.color} style={{ background: color?.hex }}>
                  </div>
                )}
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item md={3}>
                <Clickable className={styles.orderStatus} onClick={openOrderHistory}>
                  <div className={styles.thIcon}>
                    <img src={thIcon} alt="" />
                  </div>
                  <span>
                    {getOrderStatusLabel(item?.statuses?.order)}
                  </span>
                </Clickable>
              </Grid>
              <Grid item md={3}>
                <Clickable className={styles.shippingStatus} onClick={openShippingHistory}>
                  <div className={styles.tIcon}>
                    <img src={tIcon} alt="" />
                  </div>
                  <span>
                    {getShippingStatusLabel(item?.statuses?.shipping)}
                  </span>
                </Clickable>
              </Grid>
              <Grid item md={3}>
                <Clickable className={styles.paymentStatus} onClick={openPaymentHistory}>
                  <div className={styles.fIcon}>
                    <img src={fIcon} alt="" />
                  </div>
                  <span>
                    {getPaymentStatusLabel(order?.statuses?.payment)}
                  </span>
                </Clickable>
              </Grid>
            </Grid>
          </div>
        </div>
        {productType === 'digital' && (
          <div className={styles.digitalShippingSection}>
            <DigitalShippingCard digitalProducts={links} onUpload={setLinks} />
          </div>
        )}
        <div className={styles.shareSection}>
          <RatingsShare shop={shop} product={item} />
        </div>
      </>
    );
  }

  return (
    <div className={styles.container}>
      {history && (
        <StatusHistory type={type} onClose={() => setHistory(null)} history={history} />
      )}
      {renderNotePopOver()}
      <div className={styles.firstRow}>
        <div className={styles.imageContainer}>
          <img src={image} alt="" />
        </div>
        <div className={styles.right}>
          <div className={styles.title}>
            {item.content.title}
          </div>
          <div className={styles.priceRow}>
            <div className={styles.price}>
              {currency}
              {' '}
              {item.discountedAmount}
            </div>
            {!_.isEmpty(item.note) && (
              <Clickable className={styles.note} onClick={e => setAnchorEl(e.currentTarget)}>
                <img src={infoIcon} alt="" />
                <span>View Note</span>
              </Clickable>
            )}
          </div>
          <div className={styles.variantRow}>
            {variant?.name && variant?.value && (
              <div className={styles.variant}>
                {variant.name}
                {' '}
                :
                {' '}
                {variant.value}
              </div>
            )}
            <div>
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
      </div>
      {productType === 'digital' && (
        <div className={styles.digitalShippingSection}>
          <DigitalShippingCard digitalProducts={links} onUpload={setLinks} />
        </div>
      )}
      <div className={styles.shareSection}>
        <RatingsShare shop={shop} product={item} />
      </div>
      <div className={styles.statusContainer}>
        <Clickable className={styles.orderStatus} onClick={openOrderHistory}>
          <div className={styles.thIcon}>
            <img src={thIcon} alt="" />
          </div>
          <span>
            {getOrderStatusLabel(item?.statuses?.order)}
          </span>
        </Clickable>
        <Clickable className={styles.shippingStatus} onClick={openShippingHistory}>
          <div className={styles.tIcon}>
            <img src={tIcon} alt="" />
          </div>
          <span>
            {getShippingStatusLabel(item?.statuses?.shipping)}
          </span>
        </Clickable>
        <Clickable className={styles.paymentStatus} onClick={openPaymentHistory}>
          <div className={styles.fIcon}>
            <img src={fIcon} alt="" />
          </div>
          <span>
            {getPaymentStatusLabel(order?.statuses?.payment)}
          </span>
        </Clickable>
      </div>
    </div>
  );
}

Item.propTypes = {
  item: PropTypes.object.isRequired,
};

Item.defaultProps = {};
