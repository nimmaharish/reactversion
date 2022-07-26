// import star from 'assets/images/ratings/star-white.svg';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import star from 'assets/images/products/star.svg';
import {
  Switch, Button
} from 'phoenix-components';
import Loader from 'services/loader';
import { get } from 'lodash';
import emptyuser from 'assets/images/products/emptyuser.svg';
import moment from 'moment';
import { useDesktop } from 'contexts';
import ShowMoreText from 'react-show-more-text';
import { useHistory } from 'react-router-dom';
import styles from './RatingCard.module.css';
import Factory from '../../api/factory';

export function RatingCard({
  rating, i, showBorder, showProduct, measure, showReviewsLink, refresh
}) {
  const [status, setStatus] = useState(rating.status);
  const history = useHistory();
  const [more, setMore] = useState(false);
  const isDesktop = useDesktop();
  const width = isDesktop ? window.screen.width - 400 : window.screen.width - 32;

  const userPic = rating?.picture || '';
  const image = get(rating, 'product.images[0].url', 'https://becca-cdn.windo.live/misc/no_image.png');

  const executeOnClick = (value) => {
    setMore(value);
  };

  const onUnlive = async () => {
    Loader.show();
    const newStatus = status === 'live' ? 'unlive' : 'live';
    await Factory.updateRating(rating.identifier, { status: newStatus });
    setStatus(newStatus);
    refresh();
    Loader.hide();
  };

  const handleClick = () => {
    history.push(`/products/rating/${rating.entityId}`);
  };

  return (
    <div
      key={i}
      className={cx(
        styles.ratingBox,
        {
          [styles.noPadding]: !showBorder,
          [styles.noBorder]: !showBorder,
          [styles.border]: showBorder,
        }
      )}
    >
      <div className={styles.user}>
        <div className={styles.left}>
          {!userPic ? (
            <div className={styles.empty}>
              <img src={emptyuser} alt="" />
            </div>
          ) : (
            <div className={styles.userPic}>
              <img src={userPic} alt="" />
            </div>
          )}
          <div className={styles.ratingBoxRight}>
            <div className={styles.ratingBoxName}>
              {rating.name || rating.userName || 'Anonymous'}
            </div>
            {rating.order && (
              <div className={styles.ratingBoxDate}>{moment(rating.order.orderedOn).format('DD MMMM YYYY, h:mm')}</div>
            )}
          </div>
        </div>
      </div>
      {showProduct && (
        <div className={cx(styles.left, styles.bottom)}>
          <div className={styles.productIcon}>
            <img src={image} alt="" />
          </div>
          <div className={styles.ratingBoxRight}>
            <div className={styles.ratingBoxName}>
              {rating?.product?.title}
            </div>
            {rating?.order?.orderedOn && (
              <div className={styles.ratingBoxDate}>
                {`Ordered on ${moment(rating.order.orderedOn).format('DD MMMM YYYY')}`}
              </div>
            )}
          </div>
        </div>
      )}
      <div className={styles.flex}>
        <div className={styles.reviewHead}>
          Rating
          <div className={styles.ratingView}>
            <div>{rating?.rating}</div>
            <img src={star} alt="" />
          </div>
        </div>
        <Switch active={status === 'live'} onChange={onUnlive} />
      </div>
      {rating.title && (
        <div className={styles.title}>
          {rating.title}
        </div>
      )}
      <div className={styles.twoLines}>
        <ShowMoreText
          /* Default options */
          lines={2}
          more="More"
          less="Less"
          anchorClass={styles.more}
          onClick={(e) => {
            executeOnClick(e);
            measure();
          }}
          expanded={more}
          width={width}
        >
          <div
            measure={measure}
            className={cx('fs12', styles.ratingBoxReview)}
          >
            {rating.review}
          </div>
        </ShowMoreText>
      </div>
      {showReviewsLink && (
        <>
          <div className={styles.footer}>
            <Button
              size="small"
              label="View all reviews"
              onClick={handleClick}
            />
          </div>
        </>
      )}
    </div>
  );
}

RatingCard.propTypes = {
  rating: PropTypes.object.isRequired,
  showBorder: PropTypes.bool,
  showProduct: PropTypes.bool,
  i: PropTypes.any.isRequired,
  measure: PropTypes.any.isRequired,
  showReviewsLink: PropTypes.bool,
  refresh: PropTypes.func.isRequired,
};

RatingCard.defaultProps = {
  showBorder: true,
  showProduct: false,
  showReviewsLink: false,
};
