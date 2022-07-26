import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';
import cx from 'classnames';
import { Dialog } from '@material-ui/core';
import { Button, Clickable, FormikInput } from 'phoenix-components';
import { Switch } from 'phoenix-components/lib/formik';
import { LinkBar } from 'phoenix-components/lib/containers';
import editIcon from 'assets/overview/edit.svg';
import generateIcon from 'assets/logos/generate.svg';
import closeIcon from 'assets/images/orders/list/close.svg';
import {
  useCustomDomain, useDesktop, useIsOnCustomDomain, useShop
} from 'contexts';
import { useNonConfirmedAmount, useOrder } from 'contexts/orderContext';
import { useToggle } from 'hooks/common';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { Factory } from 'api';
import { Drawer } from 'components/shared/Drawer';
import { SideDrawer } from 'components/shared/SideDrawer';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import { FooterButton } from 'components/common/FooterButton';
import { share } from 'utils';
import DeviceUtils from 'utils/deviceUtils';
import { getInitialValues, marshalData, schema } from './paymentLinkUtils';
import styles from './PaymentLink.module.css';

export default function PaymentLink() {
  const order = useOrder();
  const [link, setLink] = useState(order?.paymentLink);
  const [linkAlert, toggleLinkAlert] = useToggle();
  const shop = useShop();
  const isDesktop = useDesktop();
  const due = useNonConfirmedAmount();
  const [paymentLinkFormOpen, togglePaymentLinkForm] = useToggle();
  const isCustomDomain = useIsOnCustomDomain();
  const domain = useCustomDomain();
  const history = useHistory();

  const url = `https://${isCustomDomain ? domain : 'mywindo.shop'}/pay/${link?._id}`;

  const generatePaymentLink = async (values) => {
    const mode = values.modes.find(x => x.enabled);
    if (!mode) {
      SnackBar.showError('Please select at least one mode');
      return;
    }
    try {
      Loader.show();
      setLink(await Factory.generatePaymentLink({
        orderId: order?._id,
        modes: marshalData(values)
      }));
      toggleLinkAlert();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const copyToClipboard = () => {
    DeviceUtils.copy(url);
    SnackBar.show('Shop URL Copied !!!');
  };

  const shareToUser = e => {
    e.stopPropagation();
    e.preventDefault();
    share(`Hello
    Your order tracking link for order id #${order?.orderId} is

    url

    Thank you
    ${shop?.name}`);
  };

  const Component = isDesktop ? SideDrawer : Drawer;

  if (due === 0) {
    return null;
  }

  return (
    <>
      <div className={cx(styles.container, { [styles.linkExists]: link })}>
        {link ? (
          <div className={cx('flexBetween', styles.shareSection)}>
            <p>Share payment link</p>
            <img src={editIcon} alt="editIcon" onClick={togglePaymentLinkForm} />
          </div>
        ) : null}
        {link ? (
          <div className={styles.shareLinkSection}>
            <div className={styles.linkbarContainer}>
              <LinkBar url={url} onCopy={copyToClipboard} onClick={shareToUser} />
            </div>
          </div>
        ) : (
          <div className={cx('flexCenter', styles.btnContainer)}>
            <img className={styles.generateIcon} src={generateIcon} alt="" />
            <p className={styles.text} onClick={togglePaymentLinkForm}>Generate payment link</p>
          </div>
        )}
      </div>
      <Dialog
        PaperProps={{
          classes: {
            root: styles.dialog,
          }
        }}
        maxWidth={isDesktop ? 'xs' : 'md'}
        open={linkAlert}>
        <div className={cx('flexEnd', styles.closeIcon)}>
          <Clickable
            onClick={() => {
              togglePaymentLinkForm();
              toggleLinkAlert();
            }}>
            <img src={closeIcon} alt="" />
          </Clickable>
        </div>
        <p className={styles.paymentText}>
          Your payment link as been created. You can share the payment link with your user.
        </p>
        <p className={styles.sharePaymentHeading}>Share Payment Link</p>
        <div className={styles.shareLinkSection}>
          <div className={styles.paymentLinkbar}>
            <LinkBar url={url} onCopy={copyToClipboard} onClick={shareToUser} />
          </div>
        </div>
        <p className={styles.paymentText}>
          you can always share the payment link later in order
          detail screen
        </p>
      </Dialog>
      {
        paymentLinkFormOpen && (
          getInitialValues(shop, link)?.modes?.length === 0 ? (
            <DeleteAlert
              title="Enable at least one payment mode"
              onCancel={() => history.go(0)}
              primary="Payments"
              onDelete={() => history.replace('/payments')}
            />
          )
            : (
              <Component
                title="Generate Payment Link"
                backButton
                onClose={togglePaymentLinkForm}>
                <Formik
                  validationSchema={schema}
                  initialValues={getInitialValues(shop, link)}
                  onSubmit={generatePaymentLink}>
                  {({
                    values,
                    submitForm,
                  }) => (
                    <>
                      <div className={styles.paymentsContainer}>
                        <div>
                          <p>Enter the amount</p>
                          <FormikInput
                            variant="outlined"
                            name="payable"
                            type="text"
                            label="Enter Amount"
                            placeholder="e.g. INR 100" />
                          <p>Payment Mode</p>
                          {values?.modes?.map((payment, index) => (
                            <div key={index} className={cx('flexBetween', styles.paymentCard)}>
                              <p>{payment?.name}</p>
                              <Switch
                                name={`modes[${index}].enabled`}
                              />
                            </div>
                          ))}
                        </div>
                        {isDesktop ? (
                          <Button
                            fullWidth
                            bordered={false}
                            label="Generate Payment Link"
                            className={styles.button}
                            onClick={submitForm}
                            variant="outlined"
                            size="small"
                          />
                        ) : (
                          <FooterButton>
                            <Button
                              fullWidth
                              bordered={false}
                              label="Generate Payment Link"
                              className={styles.button}
                              onClick={submitForm}
                              variant="outlined"
                              size="small"
                            />
                          </FooterButton>
                        )}
                      </div>
                    </>
                  )}
                </Formik>
              </Component>
            )
        )
      }
    </>
  );
}
