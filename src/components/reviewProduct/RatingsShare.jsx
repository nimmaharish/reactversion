import React from 'react';
import PropTypes from 'prop-types';
import SnackBar from 'services/snackbar';
import { shareShop } from 'utils/share';
import { share } from 'utils';
import { LinkBar } from 'phoenix-components/lib/containers';
import { useCustomDomain, useIsOnCustomDomain } from 'contexts';
import { shareProduct } from 'utils/share';
import { generateSlug } from 'utils/slug';
import { useOpenPlans } from 'contexts';
import { useIsRatingsEnabled } from 'contexts';
import DeviceUtils from '../../utils/deviceUtils';
import styles from './RatingsShare.module.css';

export function RatingsShare({
  product,
  shop,
}) {
  const isCustomDomain = useIsOnCustomDomain();
  const domain = useCustomDomain();
  const openPlans = useOpenPlans(false, 'generic', 'premium');

  const isEnabledRatings = useIsRatingsEnabled();

  const productUrl = shareProduct(generateSlug(product.title, product._id), shop.slug, isCustomDomain, domain);
  const ratingUrl = `${productUrl}/rating`;

  const reDirect = () => {
    openPlans();
  };

  const copyToClipboard = (e) => {
    if (!isEnabledRatings) {
      reDirect();
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    DeviceUtils.copy(ratingUrl);
    SnackBar.show('Product rating URL Copied !!!');
  };

  const shareToUser = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isEnabledRatings) {
      reDirect();
      return;
    }
    share(`Hello

Product Name: ${product.title}
Price: ${shop.currency} ${product.discountedAmount}

You can rate for this product here ${ratingUrl}

P.S Please visit our WINDO Shop at
${shareShop(shop.slug, isCustomDomain, domain)} to see the complete catalog and buy our products.

Thank you
${shop.name}`);
  };

  return (
    <div className={styles.section}>
      <>
        <div className={styles.head}>Share this product rating link</div>
        <LinkBar url={ratingUrl} onCopy={copyToClipboard} onClick={shareToUser} />
      </>
    </div>
  );
}

RatingsShare.propTypes = {
  product: PropTypes.object.isRequired,
  shop: PropTypes.object.isRequired,
};
