import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import moment from 'moment';
import { useShop } from 'contexts/userContext';
import crIcon from 'assets/images/payments/chevRight.svg';
import { useOpenPlans } from 'contexts';
import { Clickable } from 'phoenix-components';
import cx from 'classnames';
import styles from './CartCard.module.css';

export function CartCard({
  cart,
  showAlert = false,
  noPadding,
  showBorder,
}) {
  const history = useHistory();
  const shop = useShop();
  const image = _.get(cart, 'products[0].images[0].url', '');
  const queryParams = useQueryParams();
  const openPlans = useOpenPlans(false, 'abandonCart');
  const isMultiItem = cart?.products?.length > 1;

  const onClick = () => {
    if (showAlert) {
      openPlans();
      return;
    }
    queryParams.set('id', cart._id);
    history.push({
      pathname: `/carts/${cart._id}`,
    });
  };

  return (
    <>
      <Clickable
        onClick={onClick}
        className={cx(styles.root, {
          [styles.noPadding]: noPadding,
          [styles.border]: showBorder,
          [styles.noBorder]: !showBorder
        })}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.left}>
              <img src={image} alt="" />
            </div>
            <div className={styles.column}>
              <div className={styles.row}>
                <div className={styles.title} translate="no">
                  {cart?.products[0]?.title}
                </div>
              </div>
              <div className={styles.row}>
                {moment(cart?.updatedAt)
                  .format('ll')}
              </div>
              <div className={styles.row}>
                <div className={styles.price}>
                  {shop.currency}
                  {' '}
                  {cart?.products[0]?.total?.toFixed(2)}
                </div>
                {!isMultiItem && cart?.products[0]?.variant?.value?.length > 0
                && cart?.products[0]?.variant?.name?.length > 0 && (
                  <div className={styles.price}>
                    <span>
                      {cart?.products[0]?.variant?.value || ''}
                      {' '}
                      {cart?.products[0]?.variant?.name || ''}
                    </span>
                  </div>
                )}
                {!isMultiItem && (
                  <div className={styles.price}>
                    {cart?.products[0]?.quantity}
                    {' '}
                    Qty
                  </div>
                )}
                <img className={styles.view} src={crIcon} alt="" />
              </div>
            </div>
          </div>
        </div>
      </Clickable>
    </>
  );
}

CartCard.defaultProps = {
  showAlert: false,
  noPadding: false,
  showBorder: false,
};

CartCard.propTypes = {
  cart: PropTypes.object.isRequired,
  showAlert: PropTypes.bool,
  noPadding: PropTypes.bool,
  showBorder: PropTypes.bool,
};

CartCard.defaultProps = {};
