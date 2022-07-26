import React, { useState } from 'react';
import {
  useEnableAccept, useEnableCancel, useEnablePendingCustomization, useGetIds, useOrder, useRefresh
} from 'contexts/orderContext';
import { Factory } from 'api';
import SnackBar from 'services/snackbar';
import deliveryTag from 'assets/images/orders/details/tag.svg';
import { Drawer } from '@material-ui/core';
import emailIcon from 'assets/images/email.svg';
import downloadIcon from 'assets/images/orders/details/download.svg';
import CONFIG from 'config';
import Storage from 'services/storage';
import WebView from 'services/webview';
import fileDownload from 'js-file-download';
import { useIsWebView } from 'hooks';
import Loader from 'services/loader';
import cx from 'classnames';
import { get } from 'lodash';
import { useHistory } from 'react-router-dom';
import { Button, Clickable } from 'phoenix-components';
import { useToggle } from 'hooks/common';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import PropTypes from 'prop-types';
import { useDesktop } from 'contexts';
import Alert from 'components/shared/alert/Alert';
import EventManager from 'utils/events';
import styles from './CenterButton.module.css';

export function CenterButton({
  order,
  hideLabel
}) {
  const enableCancel = useEnableCancel();
  const enableConfirm = useEnableAccept();
  const enableCustomizationPending = useEnablePendingCustomization();
  const enableDelivered = get(order, 'buttons.enableDelivered', false);
  const enableOutForDelivery = get(order, 'buttons.enableOutForDelivery', false);
  const enableDownloadLabel = get(order, 'buttons.enableDownloadLabel', false);
  const webview = useIsWebView();
  const refresh = useRefresh();
  const rootOrder = useOrder();
  const [downloadEl, setDownloadEl] = useState(null);
  const [openCancel, toggleCancel] = useToggle();
  const [showError, setShowError] = useToggle(false);
  const ids = useGetIds();
  const emptyIdErr = 'Oops! You haven\'t ticked the orders you\'d like to proceed with.';

  const history = useHistory();
  const isDesktop = useDesktop();

  const acceptOrder = async () => {
    try {
      Loader.show();
      if (ids.length === 0) {
        setShowError();
        return;
      }
      await Factory.confirm(rootOrder._id, { ids });
      EventManager.emitEvent('order_accepted', {
        id: rootOrder._id,
        length: ids.length,
      });
      await refresh();
    } catch (e) {
      console.error(e);
      if (e?.response?.status === 412) {
        SnackBar.show('Please add bank details to accept order', 'error');
        history.push('/manage/bank');
        return;
      }
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const deliverOrder = async () => {
    try {
      Loader.show();
      await Factory.deliver(rootOrder._id, order.groupId);
      EventManager.emitEvent('order_delivered', {
        id: rootOrder._id,
        groupId: order.groupId,
        type: 'self'
      });
      await refresh();
    } catch (e) {
      console.error(e);
      SnackBar.show('Something went wrong', 'error');
    } finally {
      Loader.hide();
    }
  };

  const openDownload = (e) => {
    setDownloadEl(e.currentTarget);
  };

  const closeDownload = () => {
    setDownloadEl(false);
  };

  const cancelOrder = async () => {
    try {
      Loader.show();
      await Factory.cancelOrder(rootOrder._id);
      await refresh();
    } catch (e) {
      console.error(e);
      SnackBar.show('Something went wrong', 'error');
    } finally {
      Loader.hide();
    }
  };

  const sendEmail = async () => {
    try {
      Loader.show();
      await Factory.sendEmailLabel(rootOrder._id, order.groupId);
      SnackBar.show('Sent to your email');
    } catch (e) {
      SnackBar.show('Something went wrong', 'error');
    } finally {
      Loader.hide();
    }
  };

  const downloadLabel = async () => {
    const path = `${rootOrder._id}/${order.groupId}`;
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
      } = await Factory.getLabel(rootOrder._id, order.groupId);
      fileDownload(data, headers['x-suggested-filename'], headers['content-type']);
    } catch (e) {
      SnackBar.show('Something went wrong', 'error');
    } finally {
      closeDownload();
      Loader.hide();
    }
  };

  if (enableCustomizationPending) {
    return (
      <div className={styles.customizationPending}>
        Customization charges not paid
      </div>
    );
  }

  if (enableConfirm && !order.groupId) {
    return (
      <div className={styles.btn}>
        {showError && (
          <Alert
            text={emptyIdErr}
            btnText="Ok"
            textClass={styles.textClass}
            onClick={setShowError}
          />
        )}
        {openCancel && (
          <DeleteAlert
            title="Oops! Are you sure want to cancel this order?"
            subTitle="Sure you want to cancel this order?"
            onCancel={toggleCancel}
            onDelete={cancelOrder}
            primary="Yes"
            secondary="No"
          />
        )}
        {enableCancel && (
          <div>
            <Clickable className={styles.cancelButton} onClick={toggleCancel}>
              Cancel Order?
            </Clickable>
          </div>
        )}
        <div className="flexCenter">
          <Button
            fullWidth={!isDesktop}
            label={`Accept Order${ids.length > 1 ? 's' : ''}`}
            onClick={acceptOrder}
            size="large"
          />
        </div>
      </div>
    );
  }

  if (enableDelivered && !enableOutForDelivery) {
    return (
      <div className={cx(styles.btn, 'flexCenter')}>
        <Button
          label="Delivered"
          onClick={deliverOrder}
          size="large"
          fullWidth={!isDesktop}
        />
      </div>
    );
  }

  if (enableDownloadLabel && !hideLabel) {
    return (
      <>
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
              <div className={cx(styles.downloadPopoverLabel, styles.lSpacing)}>Download</div>
            </div>
          </div>
        </Drawer>
        <div onClick={openDownload} className={styles.iconContainer}>
          <img src={deliveryTag} alt="" />
          <div className={styles.iconLabel}>Shipping Label</div>
        </div>
      </>
    );
  }

  if (enableCancel) {
    return (
      <div className={cx(styles.btn, 'flexCenter')}>
        <Button
          label="Cancel Order"
          fullWidth={!isDesktop}
          onClick={toggleCancel}
          size="large"
        />
        {openCancel && (
          <DeleteAlert
            title="Oops! Are you sure want to cancel this order?"
            subTitle="Sure you want to cancel this order?"
            onCancel={toggleCancel}
            onDelete={cancelOrder}
            primary="Yes"
            secondary="No"
          />
        )}
      </div>
    );
  }

  return null;
}

CenterButton.propTypes = {
  order: PropTypes.any,
  groupId: PropTypes.string,
  hideLabel: PropTypes.bool
};

CenterButton.defaultProps = {
  groupId: '',
  order: {},
  hideLabel: false
};
