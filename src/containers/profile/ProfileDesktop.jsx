import React from 'react';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import { Becca } from 'api/index';
import Snackbar from 'services/snackbar';
import Loader from 'services/loader';
import blacky from 'assets/images/shop.svg';
import {
  useUser, usePlan
} from 'contexts/userContext';
import chevUp from 'assets/v2/orders/chevUpPrimary.svg';
import chevDown from 'assets/v2/settings/paymentModes/chevDown.svg';
import upgradeIcon from 'assets/images/subscriptions/rocket.svg';
import { useToggle } from 'hooks/common';
import { useRefreshShop, useShop } from 'contexts';
import { startCase } from 'lodash';
import { share } from 'utils';
import { shareShop } from 'utils/share';
import Share from 'assets/overview/share.svg';
import { Button as Btn, Switch, Search } from 'phoenix-components';
import { Shop } from 'containers/lazy';
import SnackBar from 'services/snackbar';
import upload from 'assets/images/profile/upload.svg';
import { SnapMini } from '../../components/snapShot/SnapMini';
import styles from './ProfileDesktop.module.css';

function ProfileDesktop() {
  const history = useHistory();
  const shop = useShop();
  const refreshShop = useRefreshShop();
  const user = useUser();
  const plan = usePlan();
  const { description: subscriptionPlan, name: planName } = plan;
  const icon = shop?.icon && shop.icon[0] ? shop.icon[0] : blacky;
  const [openProfile, toggleOpenProfile] = useToggle(false);

  const shareToUser = e => {
    e.stopPropagation();
    e.preventDefault();
    share(`Hello

    We are now selling online. Please visit my WINDO Shop at
    ${shareShop(shop?.slug, true)} to buy my products.

    Thank you
    ${shop.name}`);
  };

  const updateStatus = async (value) => {
    try {
      Loader.show();
      await Becca.updateShopStatus({ status: value });
      refreshShop();
      Loader.hide();
    } catch (e) {
      Snackbar.show('something went wrong', 'error');
      Loader.hide();
    }
  };

  const updateImage = async (url) => {
    try {
      Loader.show();
      await Becca.updateShop({ status: shop?.status, icon: url, name: shop?.name });
      refreshShop();
      Loader.hide();
    } catch (e) {
      Snackbar.show('something went wrong', 'error');
      Loader.hide();
    }
  };

  const handleSwitchChange = async (event, val) => {
    let status = 'unlive';
    if (val) {
      status = 'live';
    }
    updateStatus(status);
  };

  const uploadAsset = async (e) => {
    try {
      Loader.show();
      const files = e?.target?.files;
      const file = files && files[0];
      const payload = new FormData();
      payload.append('name', file.name);
      payload.append('purpose', 'shop');
      payload.append('type', 'image');
      payload.append('file', file);
      const { url } = await Becca.uploadAsset(payload);
      updateImage(url);
      SnackBar.show('upload success');
      Loader.hide();
    } catch (e) {
      SnackBar.show('upload failed', 'error');
      Loader.hide();
    }
  };

  return (
    <div className={styles.container}>
      <div onClick={() => history.goBack()} className={styles.maintitle}>
        <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        Profile
      </div>
      <div className={styles.body}>
        <div className={styles.profile}>
          <div className={styles.planContainer}>
            <span className={styles.planText}>Current Plan :</span>
            &nbsp;
            {planName !== 'premium' ? (
              <span className={styles.planNameText}>
                {subscriptionPlan}
                {' '}
                &nbsp;
              </span>
            ) : null}
            <Btn
              className={styles.planBtn}
              primary={false}
              size="small"
              label={planName !== 'premium' ? 'Upgrade' : subscriptionPlan}
              endIcon={planName !== 'premium' ? upgradeIcon : null}
              onClick={planName !== 'premium' ? () => history.push('/subscriptions') : null}
            />
          </div>
          <div className={styles.box}>
            <div className={cx('flexCenter')}>
              <div className={cx('textCenter flexCenter relative')}>
                <input
                  accept="image/*"
                  hidden
                  id="icon-button-file"
                  type="file"
                  onChange={(e) => {
                    uploadAsset(e);
                  }} />
                <label htmlFor="icon-button-file">
                  <img src={icon} className={cx(styles.avatar)} alt="shop icon" />
                  <img
                    alt=""
                    className={styles.upload}
                    src={upload}
                  />
                </label>
              </div>
              <div className={cx('fullWidth marginSTopBottom', styles.title)}>
                <div translate="no">
                  {shop?.name}
                  <div className={styles.marginL}>
                    <span
                      className={cx(styles.statusDot, styles[shop?.status === 'created' ? 'live' : shop?.status])}
                    >
                      <span
                        className={cx(styles.dot1, styles[shop?.status === 'created' ? 'live' : shop?.status])}
                      >
                      </span>
                      {shop?.status === 'created' ? 'Live' : startCase(shop?.status)}
                    </span>
                    <img
                      className={styles.chevIcon}
                      src={openProfile ? chevUp : chevDown}
                      alt=""
                      onClick={() => toggleOpenProfile()} />
                  </div>
                </div>
                {user?.sellerId && (
                  <div className={styles.sellerIDContainer}>
                    <div>
                      Seller ID :
                      {' '}
                      {user.sellerId.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {openProfile
              && (
                <>
                  <div className={styles.line} />
                  <div
                    className={shop?.status === 'created' || shop?.status === 'live'
                      ? styles.status : styles.unliveStatus}
                  >
                    <div className={cx(styles.primary, styles[shop?.status === 'created' ? 'live' : shop?.status])}>
                      <span className={shop?.status === 'live' ? styles.liveText : styles.unLiveText}>
                        Shop status
                      </span>
                      <div className={styles.toggleSwitch}>
                        <Switch
                          active={shop?.status === 'live' || shop?.status === 'created'}
                          onChange={handleSwitchChange}
                        />
                      </div>
                    </div>
                    <div className={styles.secondary}>Make your shop live & unlive here.</div>
                    <div>
                    </div>
                  </div>
                  <div className={styles.line} />
                  <div className={cx('flexEnd')}>
                    <Btn
                      className={cx(styles.liveText, styles.shareShopBtn)}
                      primary={false}
                      startIcon={Share}
                      label="Share Shop"
                      onClick={shareToUser}
                    />
                  </div>
                </>
              )}
          </div>
        </div>
        <div className={styles.snapContainer}>
          <SnapMini />
        </div>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputContainer}>
            <Search
              value=""
              placeholder="Search"
              onClick={() => history.push('/settings/profile/search')}
            />
          </div>
          <Btn
            className={styles.searchBtn}
            primary={true}
            label="Search"
            onClick={() => history.push('/settings/profile/search')}
          />
        </div>
        <Shop isStart={false} />
      </div>
    </div>
  );
}

export default ProfileDesktop;
