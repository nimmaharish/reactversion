import React from 'react';
import { Drawer } from 'components/shared/Drawer';
import { useCartDetails } from 'hooks/cart';
import { Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import {
  useDesktop
} from 'contexts';
import { FooterButton } from 'components/common/FooterButton';
import { Button, Clickable } from 'phoenix-components';
import whatsAppIcon from 'assets/images/orders/details/whatsapp.svg';
import emailIcon from 'assets/images/orders/details/emailC.svg';
import phoneIcon from 'assets/images/orders/details/phone.svg';
import { useShop } from 'contexts/userContext';
import { KeyValue } from 'components/orders/v2/KeyValue';
import moment from 'moment';
import _ from 'lodash';
import WebView from 'services/webview';
import { Loading } from 'components/shared/Loading';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import CartProduct from './CartProduct';
import styles from './CartDetails.module.css';
import cmStyles from './Common.module.css';

function CartDetails() {
  const history = useHistory();
  const shop = useShop();
  const isDesktop = useDesktop();
  const { id } = useParams();
  const [cart] = useCartDetails(id);
  const phone = cart?.userData?.phone;
  const name = cart?.userData?.isGuest ? 'Guest' : cart?.userData?.name;
  const email = cart?.userData?.email;
  const totalQuantity = _.sumBy(cart?.cartData?.products, 'quantity');
  const totalAmount = _.sumBy(cart?.cartData?.products, 'total');
  const openWhatsapp = () => {
    if (!phone) {
      return;
    }
    const url = `https://wa.me/${phone.replace(/\s/g, '')}`;
    if (WebView.isWebView()) {
      WebView.openUrl(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const openPhone = () => {
    if (!phone) {
      return;
    }
    const url = `tel:${phone.replace(/\s/g, '')}`;
    if (WebView.isWebView()) {
      WebView.openUrl(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const openEmail = () => {
    if (!email) {
      return;
    }
    const url = `mailto:${email}`;
    if (WebView.isWebView()) {
      WebView.openUrl(url);
    } else {
      window.open(url, '_blank');
    }
  };
  if (!cart) {
    return (
      <Loading />
    );
  }

  const body = () => (
    <div className={styles.container}>
      <div>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <div className={cmStyles.heading}>
              Cart Details
            </div>
          </Grid>
          <KeyValue
            valueClass={styles.value}
            titleClass={styles.keyTitle}
            title="Date"
            value={moment(cart.cartData.createdAt)
              .format('DD MMM, YYYY')} />
          <KeyValue
            valueClass={styles.value}
            titleClass={styles.keyTitle}
            title="Cart Total"
            value={`${shop.currency} ${totalAmount}`}
          />
          <div className={cmStyles.borderBottom} />
        </Grid>
      </div>
      <div>
        {!isDesktop && (
          <div className={cmStyles.heading}>
            Item List
          </div>
        )}
        <div className={styles.infoContainer}>
          <div className={styles.info}>
            <span>
              Total Products
            </span>
            <span>:</span>
            <span>
              {cart.cartData.products.length}
            </span>
          </div>
          <div className={styles.info}>
            <span>
              Total Quantity
            </span>
            <span>:</span>
            <span>
              {totalQuantity}
            </span>
          </div>
        </div>
        {/* //productcard// */}
        {cart.cartData.products.map((product) => (
          <CartProduct product={product} />
        ))}
        {/* //customercard// */}
        <>
          <div className={styles.containerC}>
            <div className={isDesktop ? styles.desktopBox : null}>
              <div className={styles.rowC}>
                <div className={styles.titleC}>Customer Details</div>
                <div>
                  {phone && (
                    <Clickable onClick={openWhatsapp}>
                      <img src={whatsAppIcon} className={styles.img} alt="" />
                    </Clickable>
                  )}
                  {email && (
                    <Clickable onClick={openEmail}>
                      <img src={emailIcon} className={styles.img} alt="" />
                    </Clickable>
                  )}
                  {phone && (
                    <Clickable onClick={openPhone}>
                      <img src={phoneIcon} className={styles.img} alt="" />
                    </Clickable>
                  )}
                </div>
              </div>
            </div>
            <Grid container spacing={2} className={styles.gridDesk}>
              {name && (
                <>
                  <Grid item xs={6}>
                    Name
                  </Grid>
                  <Grid item xs={6}>
                    {name}
                  </Grid>
                </>
              )}
              {email && (
                <>
                  <Grid item xs={6}>
                    Email
                  </Grid>
                  <Grid item xs={6}>
                    {email}
                  </Grid>
                </>
              )}
              {phone && (
                <>
                  <Grid item xs={6}>
                    phone
                  </Grid>
                  <Grid item xs={6}>
                    {phone}
                  </Grid>
                </>
              )}
            </Grid>
          </div>
        </>
      </div>
      {isDesktop ? (
        <Button
          fullWidth
          bordered={true}
          label="Send Email"
          size="large"
          onClick={openEmail}
        />
      ) : (
        <FooterButton>
          <Button
            fullWidth
            bordered={false}
            label="Send Email"
            size="large"
            // style={styles.button}
            onClick={openEmail}
          />
        </FooterButton>
      )}

    </div>
  );

  if (isDesktop) {
    return (
      <div className={styles.desktopContainer}>
        <div onClick={() => history.push('/carts')} className={styles.maintitle}>
          <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          Cart
        </div>
        {body()}
      </div>
    );
  }

  return (
    <Drawer
      title="Product Details"
    >
      {body()}
    </Drawer>
  );
}

export default CartDetails;
