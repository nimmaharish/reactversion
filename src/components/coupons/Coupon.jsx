import React from 'react';
import PropTypes from 'prop-types';
import penIcon from 'assets/images/coupons/pen.svg';
import expiry from 'assets/images/coupons/expiry.svg';
import radioOff from 'assets/images/coupons/radioOff.svg';
import radioOn from 'assets/images/coupons/radioOnYellow.svg';
import shareIcon from 'assets/images/coupons/share.svg';
import copyIcon from 'assets/images/coupons/copy.svg';
import DeviceUtils from 'utils/deviceUtils';
import { CouponLevel, CouponStatus, DiscountType } from 'constants/coupon';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import { share } from 'utils';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { Snitch } from 'api';
import { shareProduct, shareShop } from 'utils/share';
import { useCustomDomain, useIsOnCustomDomain, useShop } from 'contexts/userContext';
import moment from 'moment';
import { generateSlug } from 'utils/slug';
// import { useDesktop } from 'contexts';
// import { SideDrawer } from 'components/shared/SideDrawer';
import styles from './Coupon.module.css';

export function Coupon({
  coupon,
  refresh
}) {
  const history = useHistory();
  const shop = useShop();
  const params = useQueryParams();
  // const isDesktop = useDesktop();

  const isCustomDomain = useIsOnCustomDomain();
  const domain = useCustomDomain();

  const switchStatus = async (e) => {
    e.stopPropagation();
    try {
      Loader.show();
      const status = coupon.status === CouponStatus.ACTIVE ? CouponStatus.INACTIVE : CouponStatus.ACTIVE;
      await Snitch.updateCouponStatus(coupon._id, status);
      refresh();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const editCoupon = async () => {
    params.set('coupon', coupon._id);
    history.push({
      search: params.toString(),
    });
  };

  const shareCoupon = (type) => (e) => {
    e.stopPropagation();
    const func = type === 'share' ? share : DeviceUtils.copy;
    const discountText = coupon.type === DiscountType.FLAT
      ? `flat ${shop.currency}${coupon.value} off`
      : `${coupon.value}% off upto ${shop.currency}${coupon.maxValue}`;

    if (coupon.level === CouponLevel.PRODUCT) {
      func(`Hello

Use coupon code ${coupon.code} and get ${discountText}.

You can place the order for this product here ${
  shareProduct(generateSlug('product', coupon.products[0]), shop.slug, isCustomDomain, domain)
}

You can chat with us on the same link if you need any help with this order

P.S Please visit my Shop at
${shareShop(shop.slug, isCustomDomain, domain)} to see the complete catalog and buy my products.

Thank you
${shop.name}`);
    }

    if (coupon.level === CouponLevel.SHOP) {
      func(`Hello

Use coupon code ${coupon.code} and get ${discountText} on all products of my shop.

Please visit my Shop at ${shareShop(shop.slug, isCustomDomain, domain)} to buy my products.

Thank you
${shop.name}`);
    }
    if (type === 'copy') {
      SnackBar.show('Copied to clipboard', 'success');
    }
  };

  return (
    <div className={styles.main} onClick={editCoupon}>
      <div className={styles.container}>
        <div className={styles.leftTitle}>
          {coupon.level === CouponLevel.PRODUCT ? 'Products' : 'Shop'}
          <div className={styles.ball1}></div>
        </div>
        <div className={styles.right}>
          <div className={styles.top}>
            <div className={styles.money}>
              {coupon.type === DiscountType.FLAT ? `${shop.currency} ${coupon.value}` : `${coupon.value}%`}
            </div>
            <div className={styles.code}>{coupon.code}</div>
            <div className={styles.radio}>
              <img src={coupon.status === CouponStatus.ACTIVE ? radioOn : radioOff} alt="" onClick={switchStatus} />
            </div>
          </div>
          <div className={styles.dashedBorder} />
          <div className={styles.bottom}>
            <img src={expiry} alt="" />
            <div className={styles.expiry}>
              <span>Validity</span>
              <div className={styles.expiredText}>
                {`${moment(coupon.createdAt).format('ll')} to 
                ${moment(coupon.expiresAt).format('LL')} | ${moment(coupon.expiresAt).format('LT')}`}
              </div>
            </div>
          </div>
          <div className={styles.shareContainer}>
            <div className={styles.share}>
              <div onClick={shareCoupon('share')}>
                <img src={shareIcon} className={styles.shareIcon} alt="" />
                <div className={styles.sharetext}>
                  Share Coupon
                </div>
              </div>
              <div onClick={shareCoupon('copy')}>
                <img src={copyIcon} className={styles.copyIcon} alt="" />
                <div className={styles.copytext}>
                  Copy
                </div>
              </div>
            </div>
            <div className={styles.bottomRight}>
              <div>
                <img className={styles.pen} src={penIcon} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Coupon.propTypes = {
  coupon: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
};

Coupon.defaultProps = {};
