import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Item } from 'components/orders/v2/Item';
import cx from 'classnames';
import cmStyles from 'components/orders/v2/Common.module.css';
import { Button, Clickable } from 'phoenix-components';
import { useToggle } from 'hooks/common';
import chevUp from 'assets/v2/orders/chevUpPrimary.svg';
import chevDown from 'assets/v2/orders/chevDownPrimary.svg';
import { ShippingModal } from 'components/orders/ShippingModal';
import { useOrder } from 'contexts/orderContext';
import { Drawer } from '@material-ui/core';
import locationIcon from 'assets/images/orders/details/route.svg';
import _, { get } from 'lodash';
import { TrackingPopOver } from 'components/orders/TrackingPopOver';
import emailIcon from 'assets/images/email.svg';
import downloadIcon from 'assets/images/orders/details/download.svg';
import deliveryTag from 'assets/images/orders/details/tag.svg';
import Loader from 'services/loader';
import { Factory } from 'api';
import SnackBar from 'services/snackbar';
import CONFIG from 'config';
import Storage from 'services/storage';
import WebView from 'services/webview';
import fileDownload from 'js-file-download';
import { useIsWebView } from 'hooks';
import styles from './ShippingGroup.module.css';

export function ShippingGroup({ group }) {
  const [open, toggleOpen] = useToggle();
  const [retryShipping, toggleRetryShipping] = useToggle();
  const order = useOrder();
  const enableTracking = _.get(group, 'buttons.enableTracking', false);
  const enableDownloadLabel = get(group, 'buttons.enableDownloadLabel', false);
  const [popOverEL, setPopOverEl] = useState(null);
  const [downloadEl, setDownloadEl] = useState(null);
  const webview = useIsWebView();

  const openPopOver = (e) => {
    setPopOverEl(e.currentTarget);
  };

  const closePopOver = () => {
    setPopOverEl(null);
  };

  const openDownload = (e) => {
    setDownloadEl(e.currentTarget);
  };

  const closeDownload = () => {
    setDownloadEl(false);
  };

  const sendEmail = async () => {
    try {
      Loader.show();
      await Factory.sendEmailLabel(order._id, group._id);
      SnackBar.show('Sent to your email');
    } catch (e) {
      SnackBar.show('Something went wrong', 'error');
    } finally {
      Loader.hide();
    }
  };
  const downloadLabel = async () => {
    const path = `${order._id}/${group._id}`;
    try {
      Loader.show();
      if (webview) {
        const url = `${CONFIG.FACTORY.host}/seller/orders/${path}/label?authorization=${Storage.getItem('token')}`;
        await WebView.download(url);
        return;
      }
      const {
        data,
        headers
      } = await Factory.getLabel(order._id, group._id);
      fileDownload(data, headers['x-suggested-filename'], headers['content-type']);
    } catch (e) {
      SnackBar.show('Something went wrong', 'error');
    } finally {
      closeDownload();
      Loader.hide();
    }
  };

  return (
    <div className={styles.container}>
      <Drawer
        anchor="bottom"
        open={!!popOverEL}
        onClose={closePopOver}
        PaperProps={{
          classes: {
            root: styles.paper,
          }
        }}
      >
        {!!popOverEL && (<TrackingPopOver order={order} groupId={group._id} />)}
      </Drawer>
      <Drawer
        anchor="bottom"
        open={!!downloadEl}
        onClose={closeDownload}
        PaperProps={{
          classes: {
            root: styles.paper,
          }
        }}
      >
        <div className={styles.downloadPopoverRoot}>
          <div onClick={sendEmail} className={cx(styles.downloadPopoverContainer, styles.border)}>
            <img src={emailIcon} alt="" />
            <div className={styles.downloadPopoverLabel}>Send to email</div>
          </div>
          <div onClick={downloadLabel} className={styles.downloadPopoverContainer}>
            <img src={downloadIcon} alt="" />
            <div className={cx(styles.downloadPopoverLabel)}>Download</div>
          </div>
        </div>
      </Drawer>
      {retryShipping && (
        <ShippingModal groupId={group._id} order={order} onClose={toggleRetryShipping} />
      )}
      {group.items.map(item => (
        <>
          <Item item={item} key={item._id} />
          <div className={cx(cmStyles.marginV20)} />
        </>
      ))}
      {(enableTracking || enableDownloadLabel || group.type === 'self' || group.type === 'windo') && (
        <div className={styles.accordion}>
          <Clickable onClick={toggleOpen} className={styles.opener}>
            <span className={styles.title}>Shipping Details</span>
            <span className="spacer" />
            {group.status === 'shipping pending' && (
              <span className={styles.actionPending}>
                Action Pending
              </span>
            )}
            <img src={open ? chevUp : chevDown} alt="" />
          </Clickable>
          {open && (
            <div className={styles.accordionContainer}>
              {group.status === 'shipping pending' && (
                <div>
                  <div className={styles.shippingFailedStatus}>
                    <span>Shipping Status</span>
                    <span>:</span>
                    <span>Failed</span>
                  </div>
                  <div className="flexCenter">
                    <Button
                      label="Retry"
                      onClick={toggleRetryShipping}
                    />
                  </div>
                </div>
              )}
              {group.status !== 'shipping pending' && (
                <div className={styles.flexContainer}>
                  {enableTracking && (
                    <Clickable onClick={openPopOver} className={styles.iconContainer}>
                      <img src={locationIcon} alt="" />
                      <div className={styles.iconLabel}>Track Order</div>
                    </Clickable>
                  )}

                  {enableDownloadLabel && (
                    <Clickable onClick={openDownload} className={styles.iconContainer}>
                      <img src={deliveryTag} alt="" />
                      <div className={styles.iconLabel}>Shipping Label</div>
                    </Clickable>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

ShippingGroup.propTypes = {
  group: PropTypes.object.isRequired,
};

ShippingGroup.defaultProps = {};
