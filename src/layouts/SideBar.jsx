import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { shareShop } from 'utils/share';
import WebView from 'services/webview';
import chevron from 'assets/desktop/chevron.svg';
import { Clickable } from 'phoenix-components';
import wLogo from 'assets/desktop/wLogo.svg';
import windoLogo from 'assets/desktop/windoLogo.svg';
import chevronDown from 'assets/desktop/chevronDown.svg';
import plans from 'assets/desktop/plans.svg';
import viewShop from 'assets/desktop/viewShop.svg';
import community from 'assets/desktop/community.svg';
import playStore from 'assets/desktop/playstore.svg';
import appStore from 'assets/desktop/appstore.svg';
import {
  useIsBannersEnabled
} from 'contexts/userContext';
import { useCustomDomain, useIsOnCustomDomain } from 'contexts';
import { useShop } from 'contexts';
import styles from './SideBar.module.css';
import MENU from './menu';

function toggle(index, setOpen, setIndex, open) {
  setIndex(index);
  setOpen(open);
}

function getMenuItems() {
  return MENU.map(menu => {
    const updatedMenus = {};
    const { title, items, icon } = menu;
    updatedMenus.title = title;
    updatedMenus.items = items;
    updatedMenus.icon = icon;
    return updatedMenus;
  });
}

function SideBar() {
  const [index, setIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const classes = open ? styles.show : '';
  const { pathname } = useLocation();
  const isBannerConfig = useIsBannersEnabled();
  const isCustomDomain = useIsOnCustomDomain();
  const domain = useCustomDomain();
  const { slug } = useShop();
  const url = shareShop(slug, isCustomDomain, domain);
  const communityLink = 'https://www.facebook.com/groups/901392637394533/';

  const joinCommunity = (e) => {
    if (WebView.isWebView()) {
      e.preventDefault();
      WebView.openUrl(communityLink);
      return;
    }
    window.open(communityLink);
  };

  const openShop = (e) => {
    if (WebView.isWebView()) {
      e.preventDefault();
      WebView.openUrl(url);
      return;
    }
    window.open(url);
  };

  useEffect(() => {
    const dashBoardItems = ['/', '/overview/analytics'];
    const orderItems = ['/orders'];
    const productItems = [
      '/products', '/product/create', '/product/collections', '/product/gallary', '/product/bulk/upload'
    ];
    const paymentItems = ['/payments/overview', '/payments/payments'];
    // const settingItems = ['/settings/profile', '/settings/shopSettings', '/settings/myAccount',
    //   'settings/shopWebsite', '/settings/offers', '/coupons', '/manage/announcementsBanners',
    //   '/manage/hellobar'];
    if (dashBoardItems.includes(pathname)) {
      setIndex(0);
      setOpen(true);
      return;
    }
    if (pathname.indexOf('/orders') > -1 || orderItems.includes(pathname)) {
      setIndex(1);
      setOpen(true);
      return;
    }
    if (pathname.indexOf('/products') > -1 || productItems.includes(pathname)) {
      setIndex(2);
      setOpen(true);
      return;
    }
    if (paymentItems.includes(pathname)) {
      setIndex(3);
      setOpen(true);
      return;
    }
    if (pathname.indexOf('/settings')
      || pathname.indexOf('/manage')
      || pathname.indexOf('/about/seller')
    ) {
      setIndex(4);
      setOpen(true);
    }
  }, [pathname]);

  const history = useHistory();

  const upgradePopUpList = ['/overview/analytics', '/product/bulk/upload', '/reviews', '/carts'];

  const idsToAdd = ['products', 'orders', 'payments', 'settings'];

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <a href="https://www.getwindo.shop" target="_blank" rel="noreferrer">
          <img className={styles.wLogo} src={wLogo} alt="" />
          <img className={styles.windoLogo} src={windoLogo} alt="" />
        </a>
      </div>
      <div className={styles.line}></div>
      {getMenuItems().map((menu, idx) => (
        <>
          <div key={idx} className={styles.menu}>
            <div className={styles.flex}>
              <img
                id={idsToAdd.includes(menu.title.toLowerCase()) ? menu.title.toLowerCase() : null}
                className={styles.icon}
                src={menu.icon}
                alt="" />
              <div
                role="button"
                tabIndex="0"
                className={styles.mainTitle}
                onClick={() => toggle(idx, setOpen, setIndex, index !== idx || !open)}
                onKeyPress={() => { }}
              >
                {menu.title}
              </div>
              <div className={styles.chevron}>
                {(index === idx && open) ? (
                  <img
                    src={chevronDown}
                    onClick={() => toggle(idx, setOpen, setIndex, index !== idx || !open)}
                    alt="" />
                ) : (
                  <img
                    src={chevron}
                    onClick={() => toggle(idx, setOpen, setIndex, index !== idx || !open)}
                    alt="" />
                )}
              </div>
            </div>
            <div className={classNames(styles.subMenu, (index === idx && open) && classes)}>
              {menu.items.map((item, idx) => (
                <Link
                  key={idx}
                  to={(!isBannerConfig && upgradePopUpList.includes(item.route))
                    ? '?openPlans=generic' : { pathname: item.route, search: item.search }}
                  className={classNames(styles.link, {
                    [styles.primary]: item?.nestedRoutes?.includes(pathname),
                    [styles.active]: item.title.toLowerCase() !== 'dashboard' && pathname.indexOf(item.route) > -1
                  })}
                >
                  <span>{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      ))}
      <>
        <div className={styles.line}></div>
        <Clickable
          className={styles.flex}
          onClick={() => history.push('/subscriptions')}
        >
          <img className={styles.icon} src={plans} alt="" />
          <div
            className={styles.mainTitle}
          >
            View Plans
          </div>
        </Clickable>
        <Clickable
          className={styles.flex}
          onClick={openShop}
        >
          <img className={styles.icon} src={viewShop} alt="" />
          <div
            className={styles.mainTitle}
          >
            View Shop
          </div>
        </Clickable>
        <div className={styles.line}></div>
        <Clickable
          className={styles.flex}
          onClick={joinCommunity}
        >
          <img className={styles.icon} src={community} alt="" />
          <div
            className={styles.mainTitle}
          >
            Join community
          </div>
        </Clickable>
      </>

      <div className={styles.app}>
        <div className={styles.line}></div>
        <div className={styles.mainTitle1}>
          DOWNLOAD APP
          <a href="https://play.google.com/store/apps/details?id=live.windo.seller" target="_blank" rel="noreferrer">
            <img className={styles.store} src={playStore} alt="" />
          </a>
          <a href="https://apps.apple.com/in/app/windo-seller/id1559110127" target="_blank" rel="noreferrer">
            <img className={styles.store} src={appStore} alt="" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
