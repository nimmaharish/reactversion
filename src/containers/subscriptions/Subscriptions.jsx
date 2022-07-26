import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { Drawer } from 'components/shared/Drawer';
import { StatusSelectionBar } from 'components/shared/StatusSelectionBar';
import { usePlans } from 'hooks/plans';
import { Loading } from 'components/shared/Loading';
import {
  useIsFreeTrialSubscribed, useIsUserRated, usePlan, useRefreshShop
} from 'contexts/userContext';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { Becca } from 'api';
import URL from 'utils/url';
import moment from 'moment';
import { useQueryParams } from 'hooks';
import { useHistory } from 'react-router-dom';
import { PaymentSuccess } from 'containers/subscriptions/PaymentSuccess';
import _ from 'lodash';
import WebView from 'services/webview';
// import EventManager from 'utils/events';
import { useDesktop } from 'contexts';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import { Grid } from '@material-ui/core';
import { SubscriptionCard } from 'components/subscriptions/SubscriptionCard';
import { canTakeRating, setRatingShown } from 'utils/ratings';
import { RatingService } from 'services/ratings';
import Kbc from 'components/knowBaseCards/KnowBaseCards';
import Radios from './Radios';
import Alert from './Alert';
import styles from './Subscriptions.module.css';

function Subscriptions() {
  const [{
    plans,
    details,
    starFeatures
  }, loading, refresh] = usePlans();
  const [txId, setTxId] = useState(null);
  const currentPlan = usePlan();
  const reloadShop = useRefreshShop();
  // const shop = useShop();
  // const isIndia = shop?.country === 'india';
  const isFreePlan = currentPlan.name === 'free';
  const params = useQueryParams();
  const defaultPrice = plans.find(p => p.name === (isFreePlan ? 'plus' : currentPlan.name));
  const planParam = params.get('planName') || undefined;
  const [plan, setPlan] = useState(planParam ?? (isFreePlan ? 'plus' : currentPlan.name));
  const [price, setPriceRaw] = useState(_.get(defaultPrice, 'price[0].validity', null));
  const [alert, showAlert] = useState(false);
  const history = useHistory();
  const identifier = params.get('identifier');
  const isWebView = WebView.isWebView();
  const isDesktop = useDesktop();
  const isSubscribed = useIsFreeTrialSubscribed();
  const rated = useIsUserRated();

  const setPrice = (pr) => {
    setPriceRaw(pr?.validity);
  };

  const poll = async (id, interval) => {
    try {
      const { status } = await Becca.pollSubscriptionStatus(id);
      if (status === 'active') {
        if (interval) {
          clearInterval(interval);
        }
        setTxId(id);
        // EventManager.emitEvent('subscribed_to_plan');
        history.replace('/subscriptions/');
        return;
      }
      if (!(status === 'created' || status === 'processing')) {
        if (interval) {
          clearInterval(interval);
        }
        history.replace('/subscriptions/');
      }
    } catch (e) {
      if (e?.response?.status === 404) {
        history.replace('/subscriptions/');
      }
    } finally {
      Loader.hide();
    }
  };

  useEffect(() => {
    setPrice(_.get(defaultPrice, 'price[0]', null));
  }, [plans.length]);

  useEffect(() => {
    if (identifier) {
      if (params.has('cancel')) {
        history.replace('/subscriptions/');
      }
      const interval = setInterval(() => {
        poll(identifier, interval);
      }, 5000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [identifier]);

  useEffect(() => {
    if (!isSubscribed) {
      return;
    }
    if (rated) {
      return;
    }
    if (!canTakeRating()) {
      return;
    }
    RatingService.open();
    setRatingShown();
  }, [isSubscribed && !isFreePlan]);

  const onPaymentClose = async () => {
    if (!isWebView && !isDesktop) {
      document.location.href = 'https://seller.windo.live';
      return;
    }
    await reloadShop();
    await refresh();
    setTxId(null);
  };

  if (loading || plans.length === 0 || identifier) {
    return <Loading />;
  }

  const selectedPlan = plans.find(p => p.name === plan);
  const selectedPrice = (selectedPlan || [])?.price.find(x => x.validity === price) || selectedPlan?.price[0];

  const stateList = plans.map(p => ({
    label: p.description,
    value: p.name,
  }));

  const onStateChange = (val) => {
    setPlan(val);
    if (val !== 'free') {
      const planObj = plans.find(p => p.name === val);
      setPrice(planObj?.price[0]);
    } else {
      setPrice(null);
    }
  };

  const startFreeTrial = async () => {
    Loader.show();
    try {
      await Becca.startFreeTrail();
      // EventManager.emitEvent('free_trial_activated');
      showAlert(!alert);
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const redirectToPortal = async () => {
    Loader.show();
    try {
      const { url } = await Becca.getPortal(URL.getUrl('/subscriptions'));
      window.location.href = url;
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const getPlanText = () => {
    if (plan === 'free') {
      return 'A simple, transparent plan with no hidden charges';
    }
    if (plan === 'plus') {
      return 'An affordable plan with rich customizations';
    }
    if (plan === 'premium') {
      return 'A next-level plan with everything you need';
    }
  };

  const starSet = new Set(starFeatures || []);

  const Component = isDesktop ? 'div' : Drawer;

  const props = !isDesktop ? {
    title: 'Subscription Plan',
    onClose: () => {
      history.goBack();
    },
  } : {
    className: styles.desktopContainer,
  };

  const planText = getPlanText();

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Component {...props}>
      {isDesktop && (
        <div onClick={() => history.goBack()} className={styles.maintitle}>
          <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          Subscription Plan
        </div>
      )}
      {alert && (
        <Alert
          onClose={() => {
            reloadShop();
            showAlert(!alert);
          }}
          buttonTitle="Okay"
          title="Thank you for choosing the 14 days Free Trial."
          subTitle={`Your Free Trial Started at
           ${moment()
              .format('MMM Do')} Ends at ${moment()
                .add(14, 'days')
                .format('ll')}`}
        />
      )}
      {details?.status === 'processing' && (
        <Alert
          buttonTitle="Okay"
          subTitle="Subscription is currently being processed. Check status after few minutes"
          onClose={() => {
          }}
          title="Subscription"
        />
      )}
      <div
        className={cx({
          [styles.containerClass]: !isDesktop,
          [styles.containerClassForDesktop]: isDesktop,
        })}
      >
        {txId !== null && <PaymentSuccess onClose={onPaymentClose} id={txId} />}
        {!isDesktop && (
          <>
            <StatusSelectionBar
              className={styles.stateBar}
              activeClass={styles.activeClass}
              tabClassName={styles.tabClassName}
              itemClassName={styles.itemClassName}
              items={stateList}
              onChange={onStateChange}
              active={plan}
            />
            <div className={cx(styles.subHeading, 'fullWidth textCenter')}>
              {planText}
            </div>
          </>
        )}
        {isDesktop && (
          <>
            <div className={styles.desktopTitle}>
              Choose your subscription plan
            </div>
            <div className={styles.desktopSubtitle}>
              simple, transparent plans with no hidden charges.
            </div>
            <div className={styles.desktopRadios}>
              <Radios
                price={selectedPlan?.price}
                selected={selectedPrice?._id}
                setSelected={setPrice}
              />
            </div>
          </>
        )}
        {isDesktop ? (
          <Grid container spacing={6}>
            {plans.map(p => (
              <Grid item sm={4}>
                <SubscriptionCard
                  plans={plans}
                  plan={p}
                  setPrice={setPrice}
                  price={price}
                  redirectToPortal={redirectToPortal}
                  startFreeTrial={startFreeTrial}
                  details={details}
                  starSet={starSet}
                  poll={poll}
                />
              </Grid>
            ))}
            <div className={styles.kbc}>
              <Kbc type="subscriptions" />
            </div>
          </Grid>
        ) : (
          <SubscriptionCard
            plans={plans}
            plan={selectedPlan}
            setPrice={setPrice}
            price={price}
            redirectToPortal={redirectToPortal}
            startFreeTrial={startFreeTrial}
            details={details}
            starSet={starSet}
            poll={poll}
          />
        )}
      </div>
    </Component>
  );
}

Subscriptions.propTypes = {};

Subscriptions.defaultProps = {};

export default Subscriptions;
