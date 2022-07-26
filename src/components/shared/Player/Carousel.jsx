/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Hls from 'hls.js';
import styles from './Carousel.module.css';

function Carousel({ item, className, isPreview }) {
  const videoRef = useRef();

  const isHls = item?.url?.includes('.m3u8');

  useEffect(() => {
    if (isHls) {
      const hls = new Hls({
        autoStartLoad: true,
        maxBufferLength: 10,
        startFragPrefetch: true,
      });
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(item.url);
      });
    }
  }, [JSON.stringify(item)]);

  const handleClick = () => {
    const item = videoRef.current;
    if (item.paused) {
      item.play();
    } else {
      item.pause();
    }
  };

  return (
    <video
      ref={videoRef}
      className={cx(styles.fullWidth, className)}
      src={isHls ? '' : item.url}
      controls={isPreview}
      onClick={handleClick}
      playsInline={true}
      muted={false}
      preload="auto"
    />
  );
}

Carousel.propTypes = {
  item: PropTypes.object.isRequired,
  className: PropTypes.string,
  isPreview: PropTypes.bool,
};

Carousel.defaultProps = {
  className: '',
  isPreview: true,
};

export default Carousel;
