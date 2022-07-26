import React, { createRef, useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { CircularProgress } from '@material-ui/core';
import CONFIG from 'config';
import styles from './ShopPreview.module.css';

export function ShopPreview({
  name,
  classes,
  from,
  text
}) {
  const isAnnouncements = from === 'announcements';
  const ref = createRef();
  const [loading, setLoading] = useState(true);
  const url = CONFIG.ENV === 'production' ? `https://mywindo.shop/${name}`
    : `https://staging.mywindo.shop/${name}`;

  const path = !isAnnouncements ? url : `${url}?helloBarText=${encodeURIComponent(text || 'Your HelloBar')}`;

  return (
    <div
      className={cx(styles.container, classes?.container, {
        [styles.loading]: loading,
      })}
    >
      <iframe
        ref={ref}
        onLoad={() => setLoading(false)}
        className={cx(styles.iframe, classes?.iframe)}
        src={path}
        frameBorder="0"
        title="Shop Preview"
      />
      <div className={styles.cover}>
        {loading && (
          <>
            <CircularProgress variant="indeterminate" />
            <div className={styles.heading}>
              Generating Preview
            </div>
          </>
        )}
      </div>
    </div>
  );
}

ShopPreview.propTypes = {
  name: PropTypes.string.isRequired,
  classes: PropTypes.object,
  from: PropTypes.string,
  text: PropTypes.string,
};

ShopPreview.defaultProps = {
  classes: {},
  from: 'theme',
  text: ''
};
