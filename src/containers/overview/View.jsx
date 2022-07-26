import React, { memo } from 'react';
import { Grid } from '@material-ui/core';
import LazyLoad from 'react-lazy-load';
import { useInfiniteOrders, useProducts, useShopOverview, } from 'hooks';
import {
  HelpLine, OverviewTile, ShopShare, StatusButton,
} from 'components/overview';

import { OrderCard } from 'components/orders';
import { ProductCard } from 'components/products';
import { useHistory } from 'react-router-dom';
import boxIcon from 'assets/overview/box.svg';
import cartIcon from 'assets/overview/cart.svg';
import currencyIcon from 'assets/overview/currency.svg';
import listIcon from 'assets/overview/list.svg';
import { Loading } from 'components/shared/Loading';
import { Button, Clickable } from 'phoenix-components';
import {
  useIsFreePlan, useIsOnFreeTrial, useShop, useIsFreeTrialSubscribed, useIsFreeTrialEnabled
} from 'contexts/userContext';
import moment from 'moment';
import { UpgradeButton } from 'components/overview/UpgradeButton';
import Faq from 'components/faq/Custom';
import { Summary } from 'components/analytics/Summary';
import VerticalLinearStepper from 'components/overview/Stepper';
import { WorkingSlides } from 'components/overview/WorkingSlides';
import cx from 'classnames';
import { useDesktop } from 'contexts';
import { useIsPaymentsEnabled } from 'contexts/userContext';
import WebView from 'services/webview';
import tourIcon from 'assets/v2/overview/tours.svg';
import wIcon from 'assets/v2/overview/shop.svg';
import { ChatDrawer } from 'components/chat/ChatDrawer';
import DesktopView from './DesktopView.jsx';
import styles from './View.module.css';
import Youtube from '../../components/overview/Youtube.jsx';

function View() {
  const isDesktop = useDesktop();
  const freePlan = useIsFreePlan();
  const isFreeTrailEnabled = useIsOnFreeTrial();
  const [activeOrders, , , , refreshOrders] = useInfiniteOrders({}, {
    createdAt: -1,
  });
  const [overview] = useShopOverview();
  const shop = useShop();
  const isIndia = shop?.country?.toLowerCase() === 'india';
  const history = useHistory();
  const youtube = 'https://www.youtube.com/playlist?list=PLDtQW8umhwA_jRrKb_MUA9LKdZM929uVy';
  const [products] = useProducts(0, {
    status: {
      $in: ['live', 'created']
    }
  }, { createdAt: -1 });
  const isEmptyroducts = products?.length === 0;
  const endsAt = moment(shop?.settings?.freeTrial?.endsAt).diff(moment(), 'days');
  const subscribedInTrial = useIsFreeTrialSubscribed();
  const canFreeTrialEnabled = useIsFreeTrialEnabled();

  const isFilledProducts = !isEmptyroducts;

  const bankPending = useIsPaymentsEnabled();

  const showStepper = !isFilledProducts || !bankPending;

  const isEmptyData = shop === null
    || overview === null || activeOrders === null || products === null;

  const status = shop?.status ?? 'created';

  const getStatus = () => {
    if (status === 'created') {
      return 'pending';
    }
    return status;
  };

  if (isEmptyData) {
    return <Loading />;
  }

  return (
    <>
      {isDesktop && <DesktopView />}
      {!isDesktop && (
        <>
          <div className={styles.container}>
            <div className={styles.padding}>
              <div className={styles.topBar}>
                <Clickable
                  onClick={() => history.push('/manage/shop')}
                >
                  <img
                    role="none"
                    src={shop?.icon && shop.icon[0] ? shop.icon[0] : wIcon}
                    className={styles.logo_icon}
                    alt="" />
                </Clickable>
                <div translate="no" className={styles.shopName}>{shop?.name ?? ''}</div>
                <Faq />
                <ChatDrawer isFixed={false} />
              </div>
              <HelpLine isFloating={true} />
              <div className={styles.row}>
                <div className={styles.noContentHeading}>
                  Overview
                </div>
                <div className="spacer" />
                <div className={styles.shopStatusBar}>
                  <div className={styles.shopStatusText}>Shop status</div>
                  <StatusButton status={getStatus()} />
                </div>
              </div>
              <Grid container spacing={1} className={styles.overviewContainer}>
                <Grid item xs={6}>
                  <OverviewTile
                    route="/orders"
                    subTitle="New Orders"
                    title={overview?.orders?.newOrders ?? 0}
                    icon={boxIcon}
                    bgColor="#4B7BE5"
                  />
                </Grid>
                <Grid item xs={6}>
                  <OverviewTile
                    route="/orders"
                    subTitle="Total Orders"
                    title={overview?.orders?.total ?? 0}
                    icon={listIcon}
                    bgColor="#7E9FE9"
                  />
                </Grid>
                <Grid item xs={6}>
                  <OverviewTile
                    route="/products"
                    subTitle="Total Products"
                    title={overview?.products?.total ?? 0}
                    icon={cartIcon}
                    bgColor="#80D0C7"
                  />
                </Grid>
                <Grid item xs={6}>
                  <OverviewTile
                    route="/orders"
                    subTitle="Total Billing"
                    title={overview?.orders?.billing?.toFixed(2)}
                    icon={currencyIcon}
                    bgColor="#DFB751"
                  />
                </Grid>
              </Grid>
            </div>
            {showStepper && (
              <>
                <div className={styles.stepper}>
                  <VerticalLinearStepper />
                </div>
                <div className={styles.tour}>
                  <div className="flexBetween">
                    <div>
                      <div className={styles.see}>See Example</div>
                      <div className={styles.take}>Take a tour of a shop on Windo</div>
                    </div>
                    <div>
                      <img src={tourIcon} alt="" />
                    </div>
                  </div>
                  <div className="flexCenter">
                    <Button
                      size="medium"
                      label="Take a Tour"
                      onClick={() => {
                        const url = 'https://mywindo.shop/anabellawomen';
                        const other = 'https://mywindo.shop/kiarafashion';
                        const urlToOpen = isIndia ? other : url;
                        if (WebView.isWebView()) {
                          WebView.openUrl(urlToOpen);
                          return;
                        }
                        window.open(urlToOpen, '_blank');
                      }}
                    />
                  </div>
                </div>
              </>
            )}
            <div className={styles.padding}>
              {!showStepper && (
                <>
                  <div className={cx(styles.row)}>
                    <div className={styles.noContentHeading}>Share your shop</div>
                    <div className="spacer" />
                    <div>
                      {(freePlan || isFreeTrailEnabled) && <UpgradeButton />}
                    </div>
                  </div>
                  <div className={styles.paddingTop} />
                  <ShopShare slug={shop.slug} name={shop?.name ?? ''} />
                  {activeOrders?.length > 0 && (
                    <div className={styles.paddingTop}>
                      <div className={styles.noContentHeading}>Recent Orders</div>
                      {activeOrders?.slice(0, 4)
                        .map(o => (
                          <div key={o._id} className={styles.cardSpacer}>
                            <OrderCard refresh={refreshOrders} order={o} noPadding={true} />
                          </div>
                        ))}
                    </div>
                  )}
                  <LazyLoad>
                    {products?.length > 0 && (
                      <div className={styles.paddingTop}>
                        <div className={styles.noContentHeading}>Recently added products</div>
                        {products?.slice(0, 4)
                          .map(p => (
                            <div key={p._id} className={styles.cardSpacer}>
                              <ProductCard product={p} />
                            </div>
                          ))}
                      </div>
                    )}
                  </LazyLoad>
                  <div className={styles.paddingTop} />
                  <div className={styles.paddingTop} />
                  <LazyLoad>
                    <>
                      <div className={cx(styles.noContentHeading, styles.paddingTop)}>
                        Analytics Report
                      </div>
                      <Summary />
                    </>
                  </LazyLoad>
                </>
              )}
              <LazyLoad>
                <>
                  <div className={cx(styles.noContentHeading, styles.paddingTop)}>
                    How it works
                  </div>
                  <WorkingSlides />
                </>
              </LazyLoad>
              <LazyLoad>
                <>
                  <div className={cx(styles.noContentHeading, styles.paddingTop)}>
                    Watch Quick Tutorial
                  </div>
                  <Youtube />
                  <div className={styles.buttonSecond}>
                    <Button
                      label="View All Tutorials"
                      onClick={() => {
                        if (WebView.isWebView()) {
                          WebView.openUrl(youtube);
                          return;
                        }
                        window.open(youtube, '_blank');
                      }} />
                  </div>
                </>
              </LazyLoad>
              <div className={styles.spacing} />
              <div className={styles.spacing} />
              <div className={styles.spacing} />
            </div>
          </div>
          {isFreeTrailEnabled && !subscribedInTrial && (
            <div className={styles.expiryMain}>
              You have
              {' '}
              {endsAt}
              {' '}
              days left in your Free Trial.
              <Button
                className={styles.subscribe}
                primary={false}
                onClick={() => history.push('/subscriptions')}
                size="small"
                label="Subscribe"
              />
            </div>
          )}
          {!isFreeTrailEnabled && !subscribedInTrial && canFreeTrialEnabled && (
            <div className={styles.expiryMain}>
              Your Free Trial has ended.
              {' '}
              <Button
                className={styles.subscribe}
                primary={false}
                onClick={() => history.push('/subscriptions')}
                size="small"
                label="Subscribe"
              />
            </div>
          )}
          {!canFreeTrialEnabled && !subscribedInTrial && (
            <div className={styles.expiryMain}>
              Upgrade now to unlock Premium Features
              <Button
                className={styles.subscribe}
                primary={false}
                onClick={() => history.push('/subscriptions')}
                size="small"
                label="Upgrade"
              />
            </div>
          )}
        </>
      )}
    </>
  );
}

export default memo(View);
