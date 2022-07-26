import React from 'react';
import { useHistory } from 'react-router-dom';
import termsIcon from 'assets/overview/shopPolicy.svg';
import aboutShopIcon from 'assets/overview/aboutShop.svg';
import storeInfoIcon from 'assets/overview/shopInfo.svg';
import storeTimeIcon from 'assets/overview/shopTimings.svg';
import legalPpIcon from 'assets/overview/legalPp.svg';
import legalTncIcon from 'assets/overview/legalTnc.svg';

import termsIcon1 from 'assets/desktop/footer/shopPolicy.svg';
import aboutShopIcon1 from 'assets/desktop/footer/aboutShop.svg';
import storeInfoIcon1 from 'assets/desktop/footer/shopInfo.svg';
import storeTimeIcon1 from 'assets/desktop/footer/shopTimings.svg';
import legalPpIcon1 from 'assets/desktop/footer/legalPp.svg';
import legalTncIcon1 from 'assets/desktop/footer/legalTnc.svg';

import { Clickable } from 'phoenix-components';
import { useQueryParams } from 'hooks';
import {
  Grid
} from '@material-ui/core';
import { Drawer } from 'components/shared/Drawer';
import {
  useIsAboutAdded,
  useIsTermsAdded,
} from 'contexts/userContext';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import {
  useDesktop,
} from 'contexts';
import styles from './ShopFooter.module.css';

function ShopFooter() {
  const history = useHistory();
  const params = useQueryParams();
  const IsAboutAdded = useIsAboutAdded();
  const IsTermsAdded = useIsTermsAdded();
  const isDesktop = useDesktop();

  // eslint-disable-next-line react/no-multi-comp
  const getTile = (primary, icon, param, to,) => (
    <Grid item xs={4} className="flexCenter">
      <Clickable
        className={styles.tile}
        onClick={() => {
          if (param === 'openDC') {
            params.set(param, 'true');
            history.push({
              pathname: '/manage',
              search: 'openDC=true',
            });
            return;
          }
          if (param) {
            params.set(param, 'true');
            history.push({
              search: params.toString(),
            });
            return;
          }
          history.push(to);
        }}
      >
        <div classes={{ root: styles.minW }}>
          <img
            alt=""
            src={icon}
          />
        </div>
        <div
          className={styles.tileText1}
        >
          {primary}
        </div>
      </Clickable>
    </Grid>
  );

  const body = () => (
    <div id="scroll" className={styles.sdContent}>
      <div className={styles.shopSetting}>
        <Grid container spacing={1}>
          <Grid item xs={12} className={styles.grid}>
            {getTile('About Shop',
              isDesktop ? aboutShopIcon1 : aboutShopIcon, null, '/about/seller', null, !IsAboutAdded)}
            {getTile('Shop Policies',
              isDesktop ? termsIcon1 : termsIcon, null, '/manage/terms&policies', null, !IsTermsAdded)}
            {getTile('Shop Info', isDesktop ? storeInfoIcon1 : storeInfoIcon, null, '/manage/storeInfo')}

          </Grid>
          <Grid item xs={12} className={styles.grid}>
            {getTile('Terms & Conditions (Legal)',
              isDesktop ? legalTncIcon1 : legalTncIcon, null, '/about/seller?type=lt')}
            {getTile('Privacy Policy (Legal)', isDesktop ? legalPpIcon1 : legalPpIcon, null, '/about/seller?type=lp')}
            {getTile('Store Timings', isDesktop ? storeTimeIcon1 : storeTimeIcon, null, '/storeTimings')}
          </Grid>
        </Grid>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <div className={styles.desktopContainer}>
        <div onClick={history.goBack} className={styles.maintitle}>
          <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          Shop Content
        </div>
        {body()}
      </div>
    );
  }

  return (
    <Drawer
      className={styles.section}
      title="Shop Content"
    >
      {/* <div className={styles.navBar} onClick={() => { history.goBack(); }}>
        <img className={styles.icon3} src={backButtonIcon} alt="" />
      </div> */}
      {body()}
    </Drawer>
  );
}
export default ShopFooter;
