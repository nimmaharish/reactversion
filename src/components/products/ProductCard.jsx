import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import { Becca } from 'api';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { shareProduct, shareShop } from 'utils/share';
import { useCustomDomain, useIsOnCustomDomain, useShop } from 'contexts/userContext';
import { share } from 'utils';
import CONFIG from 'config';
import { generateSlug } from 'utils/slug';
import { Button, Clickable, Switch } from 'phoenix-components';
import eyeIcon from 'assets/v2/products/eye.svg';
import shareIcon from 'assets/v2/products/share.svg';
import deleteIcon from 'assets/images/address/delete.svg';
import WebView from 'services/webview';
import { useToggle } from 'hooks/common';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import { OptionsDrawer } from 'components/products';
import styles from './ProductCard.module.css';

export function ProductCard({ product, showBorder }) {
  const history = useHistory();
  const shop = useShop();
  const image = _.get(product, 'images[0].url', '');
  const [status, setStatus] = useState(product?.status);
  const enableCheckBox = status === 'live'
    || status === 'created' || status === 'unlive'
    || status === 'out of stock';
  const [checked, setChecked] = useState(status === 'live' || status === 'created');
  const isCustomDomain = useIsOnCustomDomain();
  const domain = useCustomDomain();
  const [openModal, toggleModal] = useToggle(false);
  const [openDelete, toggleDelete] = useToggle(false);
  const [openRedirect, toggleRedirect] = useToggle(false);

  const onClick = () => {
    history.push(`/products/product/${product._id}`);
  };

  const getStatus = () => {
    if (status === 'live' || status === 'created') {
      return 'Live';
    }
    if (status === 'deleted') {
      return 'Deleted';
    }
    if (status === 'draft') {
      return 'Draft';
    }
    if (status === 'out of stock') {
      return 'Out Of Stock';
    }
    if (status === 'unlive') {
      return 'Hidden';
    }
  };

  const onShare = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const productUrl = shareProduct(generateSlug(product.title, product._id), shop.slug, isCustomDomain, domain);
    share(`Hello

Product Name: ${product.title}
Price: ${shop.currency} ${product.discountedAmount}

You can place the order for this product here ${productUrl}

You can chat with us on the same link if you need any help with this order

P.S Please visit my WINDO Shop at
${shareShop(shop.slug, isCustomDomain, domain)} to see the complete catalog and buy my products.

Thank you
${shop.name}`);
  };

  const toggle = async status => {
    try {
      Loader.show();
      await Becca.updateProductStatus(product._id, { status });
      setChecked(!checked);
      setStatus(status);
      if (checked) {
        toggleModal();
      }
    } catch (e) {
      SnackBar.show('please try again later', 'error');
      console.error(e);
    } finally {
      Loader.hide();
    }
  };

  const openStatusModal = (e) => {
    e.stopPropagation();
    if (checked) {
      toggleModal();
      return;
    }
    if (!product.available) {
      toggleRedirect();
      return;
    }
    toggle('live');
  };

  const previewUrl = () => {
    if (CONFIG.ENV === 'staging') {
      return `https://staging.mywindo.shop/${shop.slug}/${generateSlug(product.title, product._id)}`;
    }
    return `https://mywindo.shop/${shop.slug}/${generateSlug(product.title, product._id)}`;
  };

  const openProduct = (e) => {
    e.stopPropagation();
    const url = previewUrl();
    if (WebView.isWebView()) {
      e.preventDefault();
      WebView.openUrl(url);
      return;
    }
    window.open(url);
  };

  const variations = product.variations?.values ? product.variations?.values.join(', ') : '';
  const { colors = [] } = product;

  const { amount, discountedAmount } = product;

  const isOOS = status === 'out of stock';

  const discount = (((amount - discountedAmount) / amount) * 100).toFixed(0);

  return (
    <>
      <Clickable
        className={cx(styles.root, {
          [styles.border]: showBorder,
          [styles.border1]: !showBorder
        })}
        onClick={() => { onClick(); }}
      >
        <div className={styles.container}>
          <div className={styles.left}>
            {!isOOS && <img src={image} alt="" />}
            {isOOS && (
              <div className={styles.oosSec}>
                <img src={image} alt="" />
                <div className={styles.oos}>
                  <div> Out of stock </div>
                </div>
              </div>
            )}
          </div>
          <div className={styles.column}>
            <div className={styles.row1}>
              <div className={styles.title} translate="no">
                {product.title}
              </div>
              {enableCheckBox && (
                <div className={styles.relative}>
                  <Switch
                    active={checked}
                    size="small"
                    onChange={openStatusModal}
                  />
                  <div className={cx(styles.statusRel)}>
                    <div className={cx(styles.status, styles[checked ? 'live' : 'unlive'])}>
                      <span className={cx(styles.dot, styles[checked ? 'live' : 'unlive'])} />
                      {' '}
                      <span>{getStatus()}</span>
                    </div>
                  </div>
                </div>
              )}
              {!enableCheckBox && (
                <div className={styles.relative}>
                  {status === 'draft' && (
                    <img
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleDelete();
                      }}
                      src={deleteIcon}
                      alt="" />
                  )}
                  <div
                    className={cx(styles.statusRel, {
                      [styles.statusRelDel]: status !== 'draft',
                      [styles.statusRel1]: status === 'draft'
                    })}>
                    <div
                      className={cx(styles.status,
                        {
                          [styles.oos]: status === 'out of stock',
                          [styles.deleted]: status === 'deleted' || status === 'draft'
                        })}>
                      <span className={cx(styles.dot, styles.unlive)} />
                      {' '}
                      <span>{getStatus()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {product.variations && (
              <div className={cx(styles.row)}>
                <div className={styles.variations}>
                  <div className={styles.nameSection}>
                    {variations.slice(0, 24)}
                    {variations.length > 24 ? '...' : ''}
                  </div>
                  <div className={styles.colorsSection}>
                    {colors.map(x => (
                      <div>
                        <div className={styles.colorBox} style={{ background: x.hex }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className={cx(styles.row, styles.noMar)}>
              <div
                className={cx(styles.price, {
                  [styles.noBorder]: product.variantCount === 1 && product.amount === product.discountedAmount,
                })}
              >
                {`${shop.currency} ${(product?.discountedAmount || 0).toFixed(2)}`}
              </div>
              <div
                className={styles.variantCount}
              >
                {product.amount !== product.discountedAmount && (
                  <>
                    <span className={styles.amount}>
                      {`${shop.currency} ${product.amount?.toFixed(2)}`}
                    </span>
                    <span className={styles.discount}>
                      {discount}
                      % OFF
                    </span>
                  </>
                )}
              </div>
            </div>
            {status !== 'draft' && (
              <div className={cx(styles.row, styles.shareContainer)}>
                <Button
                  primary={false}
                  size="small"
                  startIcon={eyeIcon}
                  label="Preview"
                  className={styles.shareButton}
                  onClick={openProduct}
                />
                <Button
                  primary={false}
                  size="small"
                  startIcon={shareIcon}
                  label="Share Product"
                  className={styles.shareButton}
                  onClick={onShare}
                />
              </div>
            )}
          </div>
        </div>
      </Clickable>
      {openRedirect && (
        <DeleteAlert
          title={'Uh-oh! Looks like all the units have been sold out for this product. '
            + ' Add inventory for this product to make it Live again.'}
          onCancel={toggleRedirect}
          onDelete={onClick}
          primary="Yes"
          secondary="Cancel"
        />
      )}
      {openDelete && (
        <DeleteAlert
          title="Are you sure you want to delete this product from drafts?"
          onCancel={toggleDelete}
          onDelete={() => {
            toggle('deleted');
            toggleDelete();
          }}
          primary="Yes"
          secondary="Cancel"
        />
      )}
      {openModal && <OptionsDrawer onClose={toggleModal} onApply={toggle} />}
    </>
  );
}

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  showBorder: PropTypes.bool,
};

ProductCard.defaultProps = {
  showBorder: false,
};
