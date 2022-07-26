import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Player from 'components/shared/Player/Carousel';
import { useMedia } from 'contexts/orderContext';
import styles from './Previews.module.css';

export function Previews() {
  const { images, videos } = useMedia();

  const media = [
    ...images.map(url => ({
      url,
      type: 'image'
    })),
    ...videos.map(url => ({
      url,
      type: 'video'
    }))
  ];

  return (
    <Swiper
      grabCursor={true}
      initialSlide={0}
      spaceBetween={30}
      watchOverflow={true}
      className={styles.swiper}
      centeredSlides={true}
      pagination={{ clickable: false }}
      slidesPerView="auto"
    >
      {media.map((el, i) => (
        <SwiperSlide
          key={i}
          className={styles.slide}
        >
          {el.type === 'image' ? (
            <img
              className={styles.image}
              src={el.url}
              alt=""
            />
          ) : (
            <div>
              <Player item={el} className={styles.video} />
            </div>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

Previews.propTypes = {
};
Previews.defaultProps = {
};
