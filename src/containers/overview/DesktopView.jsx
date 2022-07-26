import React, { memo } from 'react';
import { Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import LazyLoad from 'react-lazy-load';
import { useInfiniteOrders, useProducts, useShopOverview, } from 'hooks';
import { OverviewTile, StatusButton } from 'components/overview';
import { ShopShareDesktop } from 'components/overview/ShopShareDesktop';
import { OrderCard } from 'components/orders';
import VerticalLinearStepper from 'components/overview/Stepper';
import { ProductCard } from 'components/products';
import boxIcon from 'assets/overview/box.svg';
import cartIcon from 'assets/overview/cart.svg';
import currencyIcon from 'assets/overview/currency.svg';
import listIcon from 'assets/overview/list.svg';
import WebView from 'services/webview';
import { useIsPaymentsEnabled } from 'contexts/userContext';
import { WorkingSlides } from 'components/overview/WorkingSlides';
import { Loading } from 'components/shared/Loading';
import tourIconDesk from 'assets/v2/overview/tourDesk.svg';
import {
  useIsFreePlan, useIsOnFreeTrial, useShop, useIsFreeTrialSubscribed, useIsFreeTrialEnabled
} from 'contexts/userContext';
import moment from 'moment';
import { UpgradeButton } from 'components/overview/UpgradeButton';
import fullReportIcon from 'assets/images/analytics/fullReport.svg';
import { Button, Clickable } from 'phoenix-components';
import { SummaryDesktop } from 'components/analytics/SummaryDesktop';
import cx from 'classnames';
import styles from './DesktopView.module.css';
import Youtube from '../../components/overview/Youtube';

function View() {
  const freePlan = useIsFreePlan();
  const isFreeTrailEnabled = useIsOnFreeTrial();
  const [activeOrders, , , , refreshOrders] = useInfiniteOrders({}, {
    createdAt: -1,
  });
  const [overview] = useShopOverview();
  const shop = useShop();
  const history = useHistory();
  const endsAt = moment(shop?.settings?.freeTrial?.endsAt).diff(moment(), 'days');
  const subscribedInTrial = useIsFreeTrialSubscribed();
  const canFreeTrialEnabled = useIsFreeTrialEnabled();
  const url = 'https://www.youtube.com/playlist?list=PLDtQW8umhwA_jRrKb_MUA9LKdZM929uVy';
  const isIndia = shop?.country?.toLowerCase() === 'india';
  const [products] = useProducts(0, {
    status: {
      $in: ['live', 'created']
    }
  }, { createdAt: -1 });
  const isEmptyroducts = products?.length === 0;

  const isFilledProducts = !isEmptyroducts;

  const bankPending = useIsPaymentsEnabled();

  const showStepper = !isFilledProducts || !bankPending;

  const isEmptyData = shop === null
    || overview === null || activeOrders === null || products === null;

  if (isEmptyData) {
    return <Loading />;
  }

  const status = shop?.status ?? 'created';

  const getCurrency = (number) => (`${(number || 0)}`);

  const getStatus = () => {
    if (status === 'created') {
      return 'pending';
    }
    return status;
  };

  return (
    <div className={styles.container}>
      <div className={styles.padding}>
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
        <Grid container spacing={2} className={styles.overviewContainer}>
          <Grid item xs={3}>
            <OverviewTile
              route="/orders"
              subTitle="New Orders"
              title={overview?.orders?.newOrders ?? 0}
              icon={boxIcon}
              bgColor="#4B7BE5"
            />
          </Grid>
          <Grid item xs={3}>
            <OverviewTile
              route="/orders"
              subTitle="Total Orders"
              title={overview?.orders?.total ?? 0}
              icon={cartIcon}
              bgColor="#7E9FE9"
            />
          </Grid>
          <Grid item xs={3}>
            <OverviewTile
              route="/products"
              subTitle="Total Products"
              title={overview?.products?.total ?? 0}
              icon={listIcon}
              bgColor="#80D0C7"
            />
          </Grid>
          <Grid item xs={3}>
            <OverviewTile
              route="/orders"
              subTitle="Total Billing"
              title={`${getCurrency(overview?.orders?.billing || 0)}`}
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
            <div className={styles.tourContainer}>
              <div className={styles.dummyDesk}></div>
              <div className={styles.tourContent}>
                <div className={styles.see}>See Example</div>
                <div className={styles.take}>Take a tour of a shop on Windo</div>
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
                    primary={false} />
                </div>
              </div>
              <div>
                <img src={tourIconDesk} alt="" className={styles.tourImage} />
              </div>
            </div>
          </div>

        </>
      )}
      <div className={styles.padding}>
        {!showStepper && (
          <>
            <>
              <div className={cx(styles.row)}>
                <div className={styles.noContentHeading}>Share your shop</div>
                <div className="spacer" />
                <div>
                  {(freePlan || isFreeTrailEnabled) && <UpgradeButton />}
                </div>
              </div>
              <div className={styles.paddingTop} />
              <ShopShareDesktop slug={shop.slug} name={shop?.name ?? ''} />
              {/* {activeOrders?.length > 3 && (
                <div className={styles.paddingTop}>
                  <div className={cx(styles.row)}>
                    <div className={styles.noContentHeading}>Active Orders</div>
                    <div className="spacer" />
                    <div className={styles.buttonContainer1}>
                      <Clickable
                        className={styles.button1}
                        onClick={() => {
                        }}
                      >
                        View All
                        <img src={fullReportIcon} alt="" />
                      </Clickable>
                    </div>
                  </div>
                  <Grid container spacing={2} className={styles.productsContainer}>
                    <Grid item xs={5}>
                      {activeOrders?.slice(0, 2)
                        .map(o => (
                          <div key={o._id} className={styles.cardSpacer}>
                            <OrderCard refresh={refreshOrders} order={o} noPadding={true} />
                          </div>
                        ))}
                    </Grid>
                    <div className={styles.line}></div>
                    <Grid item xs={5}>
                      <div className={styles.noContentHeading}></div>
                      {activeOrders?.slice(2, 4)
                        .map(o => (
                          <div key={o._id} className={styles.cardSpacer}>
                            <OrderCard refresh={refreshOrders} order={o} noPadding={true} />
                          </div>
                        ))}
                    </Grid>
                  </Grid>
                </div>
              )} */}
              {activeOrders?.length > 0 && (
                <div className={styles.paddingTop}>
                  <div className={cx(styles.row)}>
                    <div className={styles.noContentHeading}>Recent Orders</div>
                    <div className="spacer" />
                    <div className={styles.buttonContainer1}>
                      <Clickable
                        className={styles.button1}
                        onClick={() => history.push('/orders')}
                      >
                        View All
                        <img src={fullReportIcon} alt="" />
                      </Clickable>
                    </div>
                  </div>
                  <Grid container spacing={2} className={styles.productsContainer1}>
                    {activeOrders?.slice(0, 6)
                      .map(o => (
                        <Grid item xs={4}>
                          <div key={o._id} className={styles.cardSpacer}>
                            <OrderCard refresh={refreshOrders} order={o} noPadding={true} />
                          </div>
                        </Grid>
                      ))}
                  </Grid>
                </div>
              )}
              {products?.length > 2 && (
                <div className={styles.paddingTop}>
                  <div className={cx(styles.row)}>
                    <div className={styles.noContentHeading}>Recently Added Products</div>
                    <div className="spacer" />
                    <div className={styles.buttonContainer1}>
                      <Clickable
                        className={styles.button1}
                        onClick={() => history.push('/products')}
                      >
                        View All
                        <img src={fullReportIcon} alt="" />
                      </Clickable>
                    </div>
                  </div>
                  <Grid container spacing={2} className={styles.productsContainer}>
                    <Grid item xs={5}>
                      {products?.slice(0, 2)
                        .map(p => (
                          <div key={p._id} className={styles.cardSpacer}>
                            <ProductCard product={p} />
                          </div>
                        ))}
                    </Grid>
                    <div className={styles.line}></div>
                    <Grid item xs={5}>
                      <div className={styles.noContentHeading}></div>
                      {products?.slice(2, 4)
                        .map(p => (
                          <div key={p._id} className={styles.cardSpacer}>
                            <ProductCard product={p} />
                          </div>
                        ))}
                    </Grid>
                  </Grid>
                </div>
              )}
              {products?.length === 1 && (
                <div className={styles.paddingTop}>
                  <div className={cx(styles.row)}>
                    <div className={styles.noContentHeading}>Recently Added Products</div>
                    <div className="spacer" />
                    <div className={styles.buttonContainer1}>
                    </div>
                  </div>
                  <Grid container spacing={2} className={styles.productsContainer}>
                    <Grid item xs={5}>
                      {products?.slice(0, 2)
                        .map(p => (
                          <div key={p._id} className={styles.cardSpacer}>
                            <ProductCard product={p} />
                          </div>
                        ))}
                    </Grid>
                    <div className={styles.line2}></div>
                    <Grid item xs={5}>
                    </Grid>
                  </Grid>
                </div>
              )}
              {products?.length === 2 && (
                <div className={styles.paddingTop}>
                  <div className={cx(styles.row)}>
                    <div className={styles.noContentHeading}>Recently Added Products</div>
                    <div className="spacer" />
                    <div className={styles.buttonContainer1}>
                    </div>
                  </div>
                  <LazyLoad>
                    <Grid container spacing={2} className={styles.productsContainer}>
                      <Grid item xs={5}>
                        {products?.slice(0, 1)
                          .map(p => (
                            <div key={p._id} className={styles.cardSpacer}>
                              <ProductCard product={p} />
                            </div>
                          ))}
                      </Grid>
                      <div className={styles.line1}></div>
                      <Grid item xs={5}>
                        <div className={styles.noContentHeading}></div>
                        {products?.slice(1, 2)
                          .map(p => (
                            <div key={p._id} className={styles.cardSpacer}>
                              <ProductCard product={p} />
                            </div>
                          ))}
                      </Grid>
                    </Grid>
                  </LazyLoad>
                </div>
              )}
              <div className={styles.paddingTop} />
              <div className={styles.paddingTop} />
              <LazyLoad>
                <>
                  <div className={cx(styles.noContentHeading, styles.paddingTop)}>
                    Analytics Report
                  </div>
                  <SummaryDesktop />
                </>
              </LazyLoad>
            </>
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
            <div className={cx(styles.row)}>
              <div className={styles.noContentHeading}>Watch The Process</div>
              <div className="spacer" />
            </div>
            <Youtube />
            <div className={styles.buttonSecond}>
              <Button
                label="View All Tutorials"
                primary={false}
                onClick={() => {
                  if (WebView.isWebView()) {
                    WebView.openUrl(url);
                    return;
                  }
                  window.open(url, '_blank');
                }} />
            </div>
          </>
        </LazyLoad>
        <div className={styles.spacing} />
        <div className={styles.spacing} />
        <div className={styles.spacing} />
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
        {!isFreeTrailEnabled && !subscribedInTrial && !canFreeTrialEnabled && (
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
        {canFreeTrialEnabled && (
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
      </div>
    </div>
  );
}

export default memo(View);
