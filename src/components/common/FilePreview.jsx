import PropTypes from 'prop-types';
import isImage from 'is-image';
import { Clickable } from 'phoenix-components';
import closeIcon from 'assets/v2/common/closeBlack.svg';
import checkedIcon from 'assets/v2/products/coverChecked.svg';
import uncheckedIcon from 'assets/v2/products/coverUnchecked.svg';
import React from 'react';
import Player from 'components/shared/Player/Carousel';
import cx from 'classnames';
import featureIcon from 'assets/overview/feature.svg';
import { useOpenPlans, usePlan } from 'contexts';
import styles from './ImagePicker.module.css';

export function FilePreview({
  item,
  onDelete,
  index,
  onCoverClick,
  premium,
  videos,
}) {
  const plan = usePlan();
  const openPlans = useOpenPlans(true, 'generic', plan?.name === 'free' ? 'plus' : 'premium');

  const image = isImage(item.url);
  if (image) {
    return (
      <div className={styles.relative}>
        <div className={styles.block}>
          <img
            className={cx(styles.image, {
              [styles.blur]: premium,
            })}
            src={item.url}
            alt=""
          />
          {onCoverClick && (
            <Clickable className={styles.cover} onClick={() => onCoverClick(index)}>
              <img src={index === 0 ? checkedIcon : uncheckedIcon} alt="" />
              <div className={styles.coverText}> Cover image</div>
            </Clickable>
          )}
        </div>
        <Clickable onClick={() => onDelete(index)}>
          <img className={styles.close} src={closeIcon} alt="" />
        </Clickable>
        {premium && (
          <Clickable className={styles.premium} onClick={openPlans}>
            <img src={featureIcon} alt="" />
          </Clickable>
        )}
      </div>
    );
  }

  return (
    <div className={styles.relative}>
      <div
        className={cx(styles.block, {
          [styles.blur]: premium || !videos,
        })}
      >
        <Player item={item} className={styles.video} />
      </div>
      <Clickable onClick={() => onDelete(index)}>
        <img className={styles.close} src={closeIcon} alt="" />
      </Clickable>
      {(premium || !videos) && (
        <Clickable className={styles.premium} onClick={openPlans}>
          <img src={featureIcon} alt="" />
        </Clickable>
      )}
    </div>
  );
}

FilePreview.defaultProps = {
  onCoverClick: null,
  premium: false,
  videos: true,
};

FilePreview.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCoverClick: PropTypes.func,
  premium: PropTypes.bool,
  videos: PropTypes.bool,
};
