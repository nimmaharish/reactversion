import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { getFeatures, getPlanImg } from 'containers/subscriptions/utils';
import cx from 'classnames';
import check from 'assets/images/subscriptions/check.svg';
import starIcon from 'assets/v2/subscriptions/star.svg';
import infoIcon from 'assets/v2/subscriptions/info.svg';
import uncheck from 'assets/images/subscriptions/uncheck.svg';
import moment from 'moment';
import { Clickable } from 'phoenix-components';
import {
  useDesktop,
  useIsFreeTrialEnabled,
  useIsFreeTrialSubscribed,
  useIsOnFreeTrial,
  usePlan,
  useRefreshShop,
  useShop
} from 'contexts';
import getSymbolFromCurrency from 'currency-symbol-map';
import { getPreFeatures } from 'components/subscriptions/utils';
import greenTick from 'assets/v2/subscriptions/greenTick.svg';
import WebView from 'services/webview';
import URL from 'utils/url';
import Loader from 'services/loader';
import { Becca } from 'api';
import Stripe from 'services/stripe';
import SnackBar from 'services/snackbar';
import Alert from 'containers/subscriptions/Alert';
import { useToggle } from 'hooks/common';
import Radios from 'containers/subscriptions/Radios';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import bestChoice from 'assets/v2/subscriptions/bestChoice.svg';
import { useGooglePlaySupported } from 'hooks/webview';
import googleIcon from 'assets/v2/subscriptions/google.svg';
import Kbc from 'components/knowBaseCards/KnowBaseCards';
import styles from './SubscriptionCard.module.css';

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: 'rgba(255, 255, 255)',
    color: 'rgba(33, 33, 33, 0.6)',
    boxShadow: theme.shadows[1],
    fontSize: 10,
  },
}))(Tooltip);

export function SubscriptionCard({
  plan,
  setPrice,
  price: priceValidity,
  details,
  plans,
  starSet,
  startFreeTrial,
  redirectToPortal,
  poll,
}) {
  const shop = useShop();
  const currentPlan = usePlan();
  const subscribedInTrial = useIsFreeTrialSubscribed();
  const freeTrialEnabled = useIsFreeTrialEnabled();
  const isOnFreeTrial = useIsOnFreeTrial();
  const isIndia = shop?.country === 'india';
  const [openWebPopUp, toggleWebPopUp] = useToggle();
  const [upgradeAlert, showUpgradeAlert] = useState(false);
  const isWebView = WebView.isWebView();
  const isDesktop = useDesktop();
  const [tooltipIsOpen, setTooltipIsOpen] = useState(false);
  const mainLogoRef = useRef();
  const imgRef = useRef();
  const [height, setHeight] = useState(300);
  const isPlaySupported = useGooglePlaySupported();

  const reloadShop = useRefreshShop();

  const priceEnabled = !(plan.name === 'free' || currentPlan.name === plan.name || details?.status === 'processing');

  const price = plan?.price.find(p => p.validity === priceValidity);

  const endDate = moment(details?.endsAt);
  const validityLeftInDays = endDate.diff(moment().format(), 'days');

  const isLTD = !!details?.ltd;

  const isPlayEnabled = isPlaySupported && price?.googlePlayPriceId && (details?.status !== 'active' || (
    details?.status === 'active' && isOnFreeTrial && !subscribedInTrial));

  const buyWithPlay = async () => {
    try {
      Loader.show();
      const { id } = await Becca.subscribePlan(
        plan._id, price._id,
        URL.getUrl('/subscriptions'),
        URL.getUrl('/subscriptions'),
        'googlePlay'
      );
      const { token } = await WebView.subscribe(price.googlePlayPriceId);
      await Becca.activatePlan(id, token);
      const interval = setInterval(() => {
        poll(id, interval);
      }, 3000);
    } catch (e) {
      SnackBar.showError(e?.error || e);
      Loader.hide();
    }
  };

  const onBuy = async () => {
    if (isWebView) {
      WebView.openUrl(URL.generateWebSubscriptionUrl(plan._id, price._id));
      toggleWebPopUp();
      return;
    }
    Loader.show();
    try {
      const { id } = await Becca.subscribePlan(
        plan._id, price._id,
        URL.getUrl('/subscriptions'),
        URL.getUrl('/subscriptions'),
      );

      await Stripe.redirectToCheckout(id);
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const getPriceString = () => {
    if (plan.name === 'free') {
      return '0';
    }
    if (!priceEnabled) {
      if (details?.status === 'active') {
        return `${price?.discountedPricePerMonth}`;
      }
      return `${price?.discountedPricePerMonth}`;
    }
    return `${price?.discountedPricePerMonth}`;
  };

  const getPretext = () => {
    if (plan.name === 'free') {
      return 'Free trial';
    }
    if (isOnFreeTrial && !subscribedInTrial) {
      return 'Free trial';
    }
    return `${plan.description} Plan`;
  };

  const renderButton = () => {
    if (freeTrialEnabled && plan?.name === 'plus' && details?.status !== 'active') {
      return (
        <>
          <div className={cx(styles.freeTrailSection, 'flexColumn')}>
            <div className={styles.trialButtons}>
              <Clickable
                className={styles.back_button}
                onClick={startFreeTrial}
              >
                Start 14-day free trial
              </Clickable>
            </div>
            <div className={styles.freeTrailSubText}>
              (No credit card required)
            </div>
          </div>
        </>
      );
    }
  };
  const renderBottomButton = () => {
    const updatedPlan = plan.name;
    if ((plan.name === 'free' && (currentPlan.name === 'free' || details?.status !== 'active'))
    || (plan.name === 'plus' && currentPlan.name === 'plus' && details?.status === 'active' && subscribedInTrial)
    || (plan.name === 'premium' && currentPlan.name === 'premium' && details?.status === 'active')) {
      return (isIndia && validityLeftInDays < 6 && details?.provider === 'stripe'
        && (plan.name === currentPlan.name) && details?.status === 'active' && !isOnFreeTrial) ? (
          <Clickable className={cx(styles.bottomButton, styles.flex)} onClick={() => onBuy()}>
            <div className={cx(styles.width50, styles.renew)}>
              RENEW NOW
            </div>
            <div className={styles.width50}>
              <div className={cx(styles.currPlanContainer2)}>
                <div className={styles.currPlan2}>
                  YOUR CURRENT PLAN
                  <img className={styles.paddingLeft} src={greenTick} alt="" />
                </div>
                {plan.name !== 'free' && isIndia && !isLTD && (
                  <div className={styles.autoRenews}>
                    Expires on
                    {' '}
                    {moment(details?.endsAt)
                      .format('ll')}
                  </div>
                )}
              </div>
            </div>
          </Clickable>
        )
        : (
          <div className={styles.bottomButton}>
            <div className={cx(styles.currPlanContainer, { [styles.paddingTop]: !isIndia && plan.name !== 'free' })}>
              <div className={styles.currPlan}>
                YOUR CURRENT PLAN
                <img className={styles.paddingLeft} src={greenTick} alt="" />
              </div>
              {plan.name !== 'free' && (!isIndia || details?.provider !== 'stripe') && (!isLTD) && (
                <div className={styles.autoRenews}>
                  Auto renews on
                  {' '}
                  {moment(details?.endsAt)
                    .format('ll')}
                </div>
              )}
            </div>
          </div>
        );
    }

    if ((updatedPlan === 'free' && (currentPlan.name !== 'free'))
      || (updatedPlan === 'plus' && currentPlan.name === 'premium')) {
      return (
        <div className={styles.bottomButton}>
          <div className={styles.currPlanContainer}>
            <div className={styles.currPlan}>
              UPGRADED
              <img className={styles.paddingLeft} src={greenTick} alt="" />
            </div>
          </div>
        </div>
      );
    }
    if ((plan.name === 'plus' && (isOnFreeTrial || details?.status !== 'active'))
      || ((details?.status !== 'active' || currentPlan.name !== 'premium') && plan.name === 'premium')) {
      return (
        <div className={styles.bottomButton}>
          {isPlayEnabled && (
            <Clickable className={styles.gPay} onClick={buyWithPlay}>
              PAY WITH
              <img src={googleIcon} alt="" />
              <span>
                PAY
              </span>
            </Clickable>
          )}
          <div className={cx(styles.currPlanContainer, styles.primary)}>
            <div
              onClick={() => {
                if (details?.provider === 'googlePlay' && currentPlan.name === 'plus' && !isOnFreeTrial) {
                  showUpgradeAlert(true);
                  return;
                }
                if (isLTD) {
                  showUpgradeAlert(true);
                  return;
                }
                if (isIndia && plan.name !== 'plus' && currentPlan.name !== 'free') {
                  showUpgradeAlert(true);
                } else {
                  if (subscribedInTrial && currentPlan.name !== 'free' && !isIndia) {
                    redirectToPortal();
                    return;
                  }
                  onBuy();
                }
              }}
              className={cx(styles.currPlan, styles.white)}>
              {isPlayEnabled ? 'PAY WITH CARD' : 'UPGRADE'}
            </div>
          </div>
        </div>
      );
    }
  };

  const priceString = getPriceString();

  const validityString = '/month';

  const preFeatures = getPreFeatures(plan.name);

  const features = getFeatures(plan, plans) || [];

  const preText = getPretext();

  const onload = (e) => {
    const { target } = e;
    const ht = target.clientHeight + 175;
    setHeight(ht);
  };

  return (
    <div className={styles.containerClass}>
      <div ref={mainLogoRef} className={styles.mainLogo}>
        <img onLoad={(e) => onload(e)} ref={imgRef} className={styles.logo} src={getPlanImg(plan.name)} alt="" />
        <div
          translate="no"
          className={styles.planTitleText}>
          {plan?.description}
        </div>
        {plan.name === 'plus' && <img className={styles.bestchoicetag} src={bestChoice} alt="" />}
      </div>
      <div className={styles.head}>
        <div className={styles.main}>
          <span className={styles.currency} translate="no">
            {plan.name === 'free' ? (isIndia ? '₹' : '$')
              : getSymbolFromCurrency(price?.currency)}

          </span>
          <span translate="no" className={styles.priceString}>{priceString}</span>
          <span className={styles.sub}>{validityString}</span>
        </div>
        {plan.name === 'free' && (
          <div className={cx(styles.sub1, styles.marginBottom)}>
            Free Forever
          </div>
        )}
        {plan.name !== 'free' && (
          <div className={styles.sub1}>
            {price?.validity <= 31 ? 'Billed Monthly' : 'Billed Annually'}
          </div>
        )}
        {plan.name !== 'free' && !isDesktop && (
          <Radios
            price={plan?.price}
            selected={price?._id}
            setSelected={setPrice}
          />
        )}
      </div>
      <div
        style={isDesktop ? { height: `calc(100% - ${height}px)` } : {}}
        className={cx(styles.content, styles[plan.name?.toLowerCase()])}
      >
        <div className={styles.card}>
          <div className={styles.body}>
            {preFeatures.map((x) => {
              if (plan.name === 'free') {
                if (details?.status !== 'active') {
                  return (
                    <div key={x} className={styles.activity1}>
                      <span className={styles.name1}>{x}</span>
                      <img className={styles.tick} src={check} alt="" />
                    </div>
                  );
                }
                return (
                  <div key={x} className={styles.marginBottom} />
                );
              }
              return (
                <div key={x} className={styles.activity1}>
                  <span className={styles.name1}>{x}</span>
                  <img className={styles.tick} src={check} alt="" />
                </div>
              );
            })}
            {features?.map((x, i) => (
              <div key={x.name} className={styles.activity}>
                <span className={styles.name}>
                  <span>{x.name}</span>
                  {plan.name === 'plus' && starSet.has(x.identifier) && (
                    <span><img className={styles.starIcon} src={starIcon} alt="" /></span>
                  )}
                  {isDesktop ? (
                    <LightTooltip
                      title={x.description}
                      placement="top"
                      arrow>
                      <span onClick={() => { setTooltipIsOpen(i); }}>
                        <img className={styles.infoIcon} src={infoIcon} alt="" />
                      </span>
                    </LightTooltip>
                  ) : (
                    <LightTooltip
                      open={i === tooltipIsOpen}
                      title={x.description}
                      placement="top"
                      onClose={() => setTooltipIsOpen(null)}
                      leaveTouchDelay={5000}
                      arrow>
                      <span
                        onClick={() => {
                          if (tooltipIsOpen === i) { setTooltipIsOpen(null); } else { setTooltipIsOpen(i); }
                        }}>
                        <img className={styles.infoIcon} src={infoIcon} alt="" />
                      </span>
                    </LightTooltip>
                  )}
                </span>
                <img className={styles.tick} src={x.enabled ? check : uncheck} alt="" />
              </div>
            ))}
            {plan.name === 'plus' && (
              <div className={styles.starNote}>
                <img src={starIcon} alt="" />
                Not included in the free trial
              </div>
            )}
            <div className={styles.hiddenCharges}>Cancel anytime. No hidden charges.</div>
            {isPlayEnabled && (
              <div className="flexCenter">
                <Clickable onClick={onBuy} className={styles.couponCode}>
                  Have coupon code?
                </Clickable>
              </div>
            )}
            {renderButton()}
            {currentPlan.name === plan.name && (!isLTD) && (
              <>
                {validityLeftInDays > 6 && plan.name !== 'free' && details?.status === 'active'
                && (
                  <div className={styles.planTimer}>
                    <div>
                      Your
                      {' '}
                      {preText}
                      {' '}
                      ends on
                      {' '}
                      {moment(details?.endsAt)
                        .format('ll')}
                    </div>
                  </div>
                )}
                {details?.status === 'active' && (!isOnFreeTrial || (isOnFreeTrial && subscribedInTrial)) && (
                  <div className={cx('flexCenter')}>
                    {(!isIndia || details?.provider !== 'stripe') && (!isLTD) && (
                      <Clickable
                        className={styles.manageSubscription}
                        onClick={redirectToPortal}
                      >
                        Manage your subscription
                      </Clickable>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
          {!isDesktop
          && (
            <div className={styles.kbc}>
              <Kbc type="subscriptions" />
            </div>
          )}
        </div>
      </div>
      {renderBottomButton()}
      {openWebPopUp && (
        <Alert
          title={'Whee! You\'ve chosen to upgrade your plan. We hope you enjoy your next-level shop experience!'}
          subTitle="Tap Refresh to update your subscription status"
          buttonTitle="Refresh"
          onClose={() => {
            reloadShop();
            toggleWebPopUp();
          }}
        />
      )}
      {upgradeAlert && (
        <Alert
          onClose={() => {
            showUpgradeAlert(!upgradeAlert);
          }}
          buttonTitle="Okay"
          title="Please drop an email to team@windo.live for this request."
          subTitle=""
        />
      )}
    </div>
  );
}

SubscriptionCard.propTypes = {
  plan: PropTypes.object.isRequired,
  setPrice: PropTypes.func.isRequired,
  price: PropTypes.number.isRequired,
  details: PropTypes.object,
  plans: PropTypes.array.isRequired,
  starSet: PropTypes.any.isRequired,
  redirectToPortal: PropTypes.func.isRequired,
  startFreeTrial: PropTypes.func.isRequired,
  poll: PropTypes.func.isRequired,
};

SubscriptionCard.defaultProps = {
  details: {},
};
