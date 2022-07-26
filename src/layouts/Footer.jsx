import React from 'react';
import { useShop } from 'contexts/userContext';
import Overview from 'assets/images/navbar/overview.svg';
import OverviewFilled from 'assets/images/navbar/overviewFilled.svg';
import Products from 'assets/images/navbar/products.svg';
import ProductsFilled from 'assets/images/navbar/productsFilled.svg';
import Orders from 'assets/images/navbar/orders.svg';
import OrdersFilled from 'assets/images/navbar/ordersFilled.svg';
import Payment from 'assets/images/navbar/payments.svg';
import PaymentFilled from 'assets/images/navbar/paymentsFilled.svg';
import Manage from 'assets/images/navbar/manage.svg';
import ManageFilled from 'assets/images/navbar/manageFilled.svg';
import { Button } from 'components/footer/Button';
import { isPayPalAllowed, isStripeAllowed } from 'utils/countries';
import { useRouteMatch } from 'react-router-dom';
import styles from './Footer.module.css';

function Footer() {
  const { country } = useShop();
  const stripeAllowed = isStripeAllowed(country);
  const payPalAllowed = isPayPalAllowed(country);
  const isSellerProfile = useRouteMatch('/sellerProfile');
  const isGallery = useRouteMatch('/products/profile');
  const isStoreTimings = useRouteMatch('/storeTimings');
  const isCreateProduct = useRouteMatch('/products/create');
  const isProductUpdate = useRouteMatch('/products/product/:id');
  const isCountryEnabled = stripeAllowed || payPalAllowed;
  const paymentsRoute = isCountryEnabled ? '/payments' : '/manage/paymentModes';
  const campaignRoute = useRouteMatch('/manage/campaign');

  if (isCreateProduct || isProductUpdate || isSellerProfile || isStoreTimings || isGallery || campaignRoute) {
    return null;
  }

  return (
    <div className={styles.footerSection}>
      <Button
        route="/overview"
        label="Dashboard"
        icon={Overview}
        iconFilled={OverviewFilled}
      />
      <Button
        id="orders"
        route="/orders"
        label="Orders"
        icon={Orders}
        iconFilled={OrdersFilled}
      />
      <Button
        id="products"
        route="/products"
        label="Products"
        icon={Products}
        iconFilled={ProductsFilled}
      />
      <Button
        id="payments"
        route={paymentsRoute}
        label="Payments"
        icon={Payment}
        iconFilled={PaymentFilled}
      />
      <Button
        route="/manage"
        label="Settings"
        id="settings"
        icon={Manage}
        iconFilled={ManageFilled}
      />
    </div>
  );
}

export default Footer;
