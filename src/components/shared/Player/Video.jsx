/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './Video.module.css';

function Carousel({ item }) {
  const videoRef = useRef();

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
      className={styles.fullWidth}
      src={item.url}
      controls
      onClick={handleClick}
      playsInline={true}
      muted="false"
      preload="auto"
    />
  );
}

Carousel.propTypes = {
  item: PropTypes.object.isRequired
};

export default Carousel;
