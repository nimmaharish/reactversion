import React, { useState } from 'react';
import { Switch, FormikInput, Button } from 'phoenix-components';
import Loader from 'services/loader';
import { Becca } from 'api/index';
import Snackbar from 'services/snackbar';
// import chevronRightIcon from 'assets/overview/chevronRight.svg';
import { Formik } from 'formik';
import { get } from 'lodash';
import { useHistory } from 'react-router-dom';
import editIcon from 'assets/images/sellerProfile/edit.svg';
import { useShop, useRefreshShop } from 'contexts';
import addressIcon from 'assets/overview/storeInfo/address.svg';
import mailIcon from 'assets/overview/storeInfo/mailIcon.svg';
import orderIcon from 'assets/overview/storeInfo/order.svg';
import paymentIcon from 'assets/overview/storeInfo/payment.svg';
import phoneIcon from 'assets/overview/storeInfo/phone.svg';
import { FooterButton } from 'components/common/FooterButton';
import shippingIcon from 'assets/overview/storeInfo/shipping.svg';
import { Drawer } from 'components/shared/Drawer';
import { Editor } from '@tinymce/tinymce-react';
import cx from 'classnames';
import { SideDrawer } from 'components/shared/SideDrawer';
import { useDesktop } from 'contexts';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import { cssStyle } from 'constants/tinymce';
import { getInitialValues } from './utils';
import styles from './StoreInfo.module.css';

export default function StoreInfo() {
  const shop = useShop();
  const refresh = useRefreshShop();
  const [storeInformation, toggleStoreInformation] = useState(false);
  const [shippingInformation, toggleShippingInformation] = useState(false);
  const [paymentInformation, togglePaymentInformation] = useState(false);
  const [orderTracking, toggleOrderTracking] = useState(false);
  const req = getInitialValues(shop?.footerInfo || {});
  const isDesktop = useDesktop();
  const history = useHistory();

  const onEdit = (value) => {
    switch (value) {
      case 'store':
        toggleStoreInformation(true);
        break;
      case 'order':
        toggleOrderTracking(true);
        break;
      case 'payment':
        togglePaymentInformation(true);
        break;
      case 'shipping':
        toggleShippingInformation(true);
        break;
      default:
        return null;
    }
  };

  const onSubmit = async (values) => {
    try {
      Loader.show();
      await Becca.updateStoreInfo(values);
      refresh();
      Loader.hide();
    } catch (exception) {
      const msg = get(exception, 'response.data.message', 'unknown error');
      Snackbar.show(msg, 'error');
    }
  };

  const handleSwitchChange = async (key) => {
    req.footerInfo[key].enabled = !req.footerInfo[key].enabled;
    onSubmit(req);
  };

  const getTitle = (value) => {
    switch (value) {
      case 'store':
        return 'Store Information';
      case 'order':
        return 'Order Tracking';
      case 'payment':
        return 'Payments Info';
      case 'shipping':
        return 'Shipping Info';
      default:
        return '';
    }
  };

  const getContent = (key, status, data = {},) => (
    <div className={styles.content}>
      <div className={styles.title}>
        {getTitle(key)}
        {status === false && key === 'store'
         && (data.phone.length < 1 || data.email.length < 1 || data.address.length < 1)
          ? <div className={styles.status2} onClick={() => onEdit(key)}>Add</div>
          : (
            <div className={status ? cx(styles.status, styles.active) : cx(styles.status, styles.inActive)}>
              {status ? 'Active' : 'Inactive'}
              <div className={styles.marginLeft}></div>
              <Switch
                active={status}
                onChange={() => handleSwitchChange(key)}
              />
            </div>
          )}
      </div>
      {key !== 'store' && status && (
        <div className={styles.desciption} onClick={() => onEdit(key)}>
          {data.title}
          ,
          {' '}
          {data.subTitle?.length > 0 ? data.subTitle : 'Dummy Text Of The Printing '}
          <img src={editIcon} className={styles.right} alt="chevron" />
        </div>
      )}
      {key === 'store' && status && (
        <div className={styles.desciption} onClick={() => onEdit(key)}>
          <div className={styles.data}>
            {data.phone}
            {(data.phone && data.email) && ','}
            {' '}
            {data.email}
            {(data.email && data.address) && ','}
            <div dangerouslySetInnerHTML={{ __html: data.address }} />
          </div>
          <img src={editIcon} className={styles.right} alt="chevron" />
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div className={styles.container}>
        <div onClick={() => history.goBack()} className={styles.maintitle}>
          <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          <div className={styles.hText}>Store Information</div>
        </div>
        <Formik
          initialValues={getInitialValues(shop?.footerInfo || {})}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, submitForm }) => (
            <div className={styles.mainContainer}>
              <div className={styles.dText}>
                Information you add here will be shown in shop website you can enable and disable them here.
              </div>
              <div className={styles.boxDesk}>
                {Object.entries(values?.footerInfo).map(([k, v]) => getContent(k, v?.enabled, v))}
              </div>
              <div className={styles.margin}>Store preview</div>
              <div className={styles.preview}>
                {values?.footerInfo?.store?.enabled
                && (
                  <div className={styles.info}>
                    <div className={styles.spacer}>Store Information</div>
                    {values?.footerInfo?.store?.email?.length > 0 && (
                      <div className={styles.flex}>
                        <img src={mailIcon} alt="" />
                        <div className={styles.tile}>{values?.footerInfo?.store?.email}</div>
                      </div>
                    )}
                    {values?.footerInfo?.store?.phone?.length > 0 && (
                      <div className={styles.flex}>
                        <img src={phoneIcon} alt="" />
                        <div className={styles.tile}>{values?.footerInfo?.store?.phone}</div>
                      </div>
                    )}
                    {values?.footerInfo?.store?.address?.length > 0 && (
                      <div className={styles.flex}>
                        <img src={addressIcon} alt="" />
                        <div
                          dangerouslySetInnerHTML={{ __html: values?.footerInfo?.store?.address }}
                          className={styles.tile}>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className={styles.grey}>
                  {values?.footerInfo?.shipping?.enabled && (
                    <div className={styles.flex}>
                      <img src={shippingIcon} alt="" />
                      <div className={styles.tile}>
                        <div className={styles.text}>{values?.footerInfo?.shipping?.title}</div>
                        <div className={styles.marginTop}>
                          {values?.footerInfo?.shipping?.subTitle?.length > 0 ? values?.footerInfo?.shipping?.subTitle
                            : 'Dummy Text Of The Printing ' }
                        </div>
                      </div>
                    </div>
                  )}
                  {values?.footerInfo?.payment?.enabled && (
                    <div className={styles.flex}>
                      <img src={paymentIcon} alt="" />
                      <div className={styles.tile}>
                        <div className={styles.text}>{values?.footerInfo?.payment?.title}</div>
                        <div className={styles.marginTop}>
                          {values?.footerInfo?.payment?.subTitle?.length > 0 ? values?.footerInfo?.payment?.subTitle
                            : 'Dummy Text Of The Printing ' }
                        </div>
                      </div>
                    </div>
                  )}
                  {values?.footerInfo?.order?.enabled && (
                    <div className={styles.flex}>
                      <img src={orderIcon} alt="" />
                      <div className={styles.tile}>
                        <div className={styles.text}>{values?.footerInfo?.order?.title}</div>
                        <div className={styles.marginTop}>
                          {values?.footerInfo?.order?.subTitle?.length > 0 ? values?.footerInfo?.order?.subTitle
                            : 'Dummy Text Of The Printing ' }
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {storeInformation && (
                <>
                  <SideDrawer
                    backButton={true}
                    onClose={() => toggleStoreInformation(false)}
                    title="Add Store Information"
                  >
                    <div className={styles.drawer2}>
                      <div className={styles.grid}>
                        <FormikInput
                          variant="outlined"
                          name="footerInfo.store.email"
                          type="text"
                          label="Enter Email ID"
                          placeholder="e.g. julie.smith@xyz.com" />
                      </div>
                      <div className={styles.grid}>
                        <FormikInput
                          variant="outlined"
                          name="footerInfo.store.phone"
                          type="number"
                          label="Enter Mobile Number"
                          placeholder="e.g. +91- 12345-67890" />
                      </div>
                      <div className={styles.grid}>
                        <Editor
                          value={values.footerInfo.store.address}
                          apiKey="jk7y6v6dbe2h16qh13q5klle5sz76ddgevc6ph3v1sa4bgu1"
                          init={{
                            menubar: false,
                            toolbar: false,
                            height: '20vh',
                            placeholder: 'Enter Store Address',
                            statusbar: false,
                            branding: false,
                            selector: 'textarea',
                            paste_data_images: true,
                            content_style: cssStyle,
                            plugins: [
                              'paste'
                            ],
                          }}
                          onEditorChange={(e) => {
                            setFieldValue('footerInfo.store.address', e);
                          }} />
                      </div>
                      <div className={styles.buttonContainer}>
                        <Button
                          label="Save"
                          onClick={() => {
                            setFieldValue('footerInfo.store.enabled', true);
                            submitForm();
                            toggleStoreInformation(false);
                          }}
                          primary
                          size="large"
                        />
                      </div>
                    </div>
                  </SideDrawer>
                </>
              )}
              {shippingInformation && (
                <SideDrawer
                  backButton={true}
                  onClick={toggleShippingInformation}
                  onClose={() => toggleShippingInformation(false)}
                  title="Add Shipping Info"
                >
                  <div className={styles.drawer2}>
                    <div className={styles.grid}>
                      <FormikInput
                        variant="outlined"
                        name="footerInfo.shipping.title"
                        type="textarea"
                        label="Enter Shipping Title"
                        placeholder="e.g. Fast Shipping"
                      />
                    </div>
                    <div className={styles.grid}>
                      <FormikInput
                        variant="outlined"
                        name="footerInfo.shipping.subTitle"
                        type="textarea"
                        label="Enter Shipping Description"
                        placeholder="e.g. Delivery happens within 4-3 days "
                      />
                    </div>
                    <div className={styles.buttonContainer}>
                      <Button
                        label="Save"
                        onClick={submitForm}
                        primary
                        size="large"
                      />
                    </div>
                  </div>
                </SideDrawer>
              )}
              {paymentInformation && (
                <SideDrawer
                  backButton={true}
                  onClick={togglePaymentInformation}
                  onClose={() => togglePaymentInformation(false)}
                  title="Add Payments Info"
                >
                  <div className={styles.drawer2}>
                    <div className={styles.grid}>
                      <FormikInput
                        variant="outlined"
                        name="footerInfo.payment.title"
                        type="textarea"
                        label="Enter Payment Title"
                        placeholder="e.g. Seamless Payments"
                      />
                    </div>
                    <div className={styles.grid}>
                      <FormikInput
                        variant="outlined"
                        name="footerInfo.payment.subTitle"
                        type="textarea"
                        label="Enter Payment Description"
                        placeholder="e.g. Dummy Text Of The Printing "
                      />
                    </div>
                    <div className={styles.buttonContainer}>
                      <Button
                        label="Save"
                        onClick={submitForm}
                        primary
                        size="large"
                      />
                    </div>
                  </div>
                </SideDrawer>
              )}
              {orderTracking && (
                <>
                  <SideDrawer
                    backButton={true}
                    onClick={toggleOrderTracking}
                    onClose={() => toggleOrderTracking(false)}
                    title="Add Order Tracking Info"
                  >
                    <div className={styles.drawer2}>
                      <div className={styles.grid}>
                        <FormikInput
                          variant="outlined"
                          name="footerInfo.order.title"
                          type="textarea"
                          label="Enter Order Tracking Title"
                          placeholder="Order Tracking" />
                      </div>
                      <div className={styles.grid}>
                        <FormikInput
                          variant="outlined"
                          name="footerInfo.order.subTitle"
                          type="textarea"
                          label="Enter Order Tracking Description"
                          placeholder="e.g. Delivery happens within 4-3 days " />
                      </div>
                      <div className={styles.buttonContainer}>
                        <Button
                          label="Save"
                          onClick={submitForm}
                          primary
                          size="large" />
                      </div>
                    </div>
                  </SideDrawer>
                </>
              )}
            </div>
          )}
        </Formik>
      </div>
    );
  }
  return (
    <Drawer title="Store Information" containerClass={styles.drawer} topBarClass={styles.drawer}>
      <Formik
        initialValues={getInitialValues(shop?.footerInfo || {})}
        onSubmit={onSubmit}
      >
        {({ values, setFieldValue, submitForm }) => (
          <div className={styles.mainContainer}>
            Information you add here will be shown in shop website you can enable and disable them here.
            <div className={styles.box}>
              {Object.entries(values?.footerInfo).map(([k, v]) => getContent(k, v?.enabled, v))}
            </div>
            <div className={styles.margin}>Store preview</div>
            <div className={styles.preview}>
              {values?.footerInfo?.store?.enabled
                && (
                  <div className={styles.info}>
                    <div className={styles.spacer}>Store Information</div>
                    {values?.footerInfo?.store?.email?.length > 0 && (
                      <div className={styles.flex}>
                        <img src={mailIcon} alt="" />
                        <div className={styles.tile}>{values?.footerInfo?.store?.email}</div>
                      </div>
                    )}
                    {values?.footerInfo?.store?.phone?.length > 0 && (
                      <div className={styles.flex}>
                        <img src={phoneIcon} alt="" />
                        <div className={styles.tile}>{values?.footerInfo?.store?.phone}</div>
                      </div>
                    )}
                    {values?.footerInfo?.store?.address?.length > 0 && (
                      <div className={styles.flex}>
                        <img src={addressIcon} alt="" />
                        <div
                          dangerouslySetInnerHTML={{ __html: values?.footerInfo?.store?.address }}
                          className={styles.tile}>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              <div className={styles.grey1}>
                {values?.footerInfo?.shipping?.enabled && (
                  <div className={styles.flex1}>
                    <img src={shippingIcon} alt="" />
                    <div className={styles.tile}>
                      <div className={styles.text}>{values?.footerInfo?.shipping?.title}</div>
                      <div className={styles.marginTop}>
                        {values?.footerInfo?.shipping?.subTitle?.length > 0 ? values?.footerInfo?.shipping?.subTitle
                          : 'Dummy Text Of The Printing ' }
                      </div>
                    </div>
                  </div>
                )}
                {values?.footerInfo?.payment?.enabled && (
                  <div className={styles.flex1}>
                    <img src={paymentIcon} alt="" />
                    <div className={styles.tile}>
                      <div className={styles.text}>{values?.footerInfo?.payment?.title}</div>
                      <div className={styles.marginTop}>
                        {values?.footerInfo?.payment?.subTitle?.length > 0 ? values?.footerInfo?.payment?.subTitle
                          : 'Dummy Text Of The Printing ' }
                      </div>
                    </div>
                  </div>
                )}
                {values?.footerInfo?.order?.enabled && (
                  <div className={styles.flex1}>
                    <img src={orderIcon} alt="" />
                    <div className={styles.tile}>
                      <div className={styles.text}>{values?.footerInfo?.order?.title}</div>
                      <div className={styles.marginTop}>
                        {values?.footerInfo?.order?.subTitle?.length > 0 ? values?.footerInfo?.order?.subTitle
                          : 'Dummy Text Of The Printing ' }
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {storeInformation && (
              <Drawer
                onClose={() => {
                  setFieldValue('footerInfo.store.enabled', true);
                  submitForm();
                  toggleStoreInformation(false);
                }}
                title="Add Store Information"
                closeButton
              >
                <div className={styles.drawer2}>
                  <div className={styles.grid}>
                    <FormikInput
                      variant="outlined"
                      name="footerInfo.store.email"
                      type="text"
                      label="Enter Email ID"
                      placeholder="e.g. julie.smith@xyz.com"
                    />
                  </div>
                  <div className={styles.grid}>
                    <FormikInput
                      variant="outlined"
                      name="footerInfo.store.phone"
                      type="number"
                      label="Enter Mobile Number"
                      placeholder="e.g. +91- 12345-67890"
                    />
                  </div>
                  <div className={styles.grid}>
                    <Editor
                      value={values.footerInfo.store.address}
                      apiKey="jk7y6v6dbe2h16qh13q5klle5sz76ddgevc6ph3v1sa4bgu1"
                      init={{
                        menubar: false,
                        toolbar: false,
                        height: '20vh',
                        width: '100%',
                        placeholder: 'Enter Store Address',
                        statusbar: false,
                        branding: false,
                        selector: 'textarea', // change this value according to your HTML
                        paste_data_images: true,
                        content_style: cssStyle,
                        plugins: [
                          'paste'
                        ],
                      }}
                      onEditorChange={(e) => {
                        setFieldValue('footerInfo.store.address', e);
                      }}
                    />
                  </div>
                  <FooterButton>
                    <Button
                      bordered={false}
                      label="Save"
                      onClick={() => {
                        setFieldValue('footerInfo.store.enabled', true);
                        submitForm();
                        toggleStoreInformation(false);
                      }}
                      primary
                      fullWidth
                      size="large"
                    />
                  </FooterButton>
                </div>
              </Drawer>
            )}
            {shippingInformation && (
              <Drawer
                onClose={() => {
                  submitForm();
                  toggleShippingInformation(false);
                }}
                title="Add Shipping Info"
                closeButton
              >
                <div className={styles.drawer2}>
                  <div className={styles.grid}>
                    <FormikInput
                      variant="outlined"
                      name="footerInfo.shipping.title"
                      type="textarea"
                      label="Enter Shipping Title"
                      placeholder="e.g. Fast Shipping"
                    />
                  </div>
                  <div className={styles.grid}>
                    <FormikInput
                      variant="outlined"
                      name="footerInfo.shipping.subTitle"
                      type="textarea"
                      label="Enter Shipping Description"
                      placeholder="e.g. Delivery happens within 4-3 days "
                    />
                  </div>
                  <FooterButton>
                    <Button
                      bordered={false}
                      label="Save"
                      onClick={() => {
                        submitForm();
                        toggleShippingInformation(false);
                      }}
                      primary
                      fullWidth
                      size="large"
                    />
                  </FooterButton>
                </div>
              </Drawer>
            )}
            {paymentInformation && (
              <Drawer
                onClose={() => {
                  submitForm();
                  togglePaymentInformation(false);
                }}
                title="Add Payments Info"
                closeButton
              >
                <div className={styles.drawer2}>
                  <div className={styles.grid}>
                    <FormikInput
                      variant="outlined"
                      name="footerInfo.payment.title"
                      type="textarea"
                      label="Enter Payment Title"
                      placeholder="e.g. Seamless Payments"
                    />
                  </div>
                  <div className={styles.grid}>
                    <FormikInput
                      variant="outlined"
                      name="footerInfo.payment.subTitle"
                      type="textarea"
                      label="Enter Payment Description"
                      placeholder="e.g. Dummy Text Of The Printing "
                    />
                  </div>
                  <FooterButton>
                    <Button
                      bordered={false}
                      label="Save"
                      onClick={() => {
                        submitForm();
                        togglePaymentInformation(false);
                      }}
                      primary
                      fullWidth
                      size="large"
                    />
                  </FooterButton>
                </div>
              </Drawer>
            )}
            {orderTracking && (
              <Drawer
                onClose={() => {
                  submitForm();
                  toggleOrderTracking(false);
                }}
                title="Add Order Tracking Info"
                closeButton
              >
                <div className={styles.drawer2}>
                  <div className={styles.grid}>
                    <FormikInput
                      variant="outlined"
                      name="footerInfo.order.title"
                      type="textarea"
                      label="Enter Order Tracking Title"
                      placeholder="Order Tracking"
                    />
                  </div>
                  <div className={styles.grid}>
                    <FormikInput
                      variant="outlined"
                      name="footerInfo.order.subTitle"
                      type="textarea"
                      label="Enter Order Tracking Description"
                      placeholder="e.g. Delivery happens within 4-3 days "
                    />
                  </div>
                  <FooterButton>
                    <Button
                      bordered={false}
                      label="Save"
                      onClick={() => {
                        submitForm();
                        toggleOrderTracking(false);
                      }}
                      primary
                      fullWidth
                      size="large"
                    />
                  </FooterButton>
                </div>
              </Drawer>
            )}
          </div>
        )}
      </Formik>
    </Drawer>
  );
}

StoreInfo.propTypes = {};

StoreInfo.defaultProps = {};
