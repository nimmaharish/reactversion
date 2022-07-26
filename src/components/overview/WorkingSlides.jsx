/* eslint-disable max-len */
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import cx from 'classnames';
import SwiperCore, {
  Navigation
} from 'swiper';
import 'swiper/swiper.min.css';
// import on from 'assets/images/workingslides/1.svg';
import tw from 'assets/images/workingslides/2.svg';
import th from 'assets/images/workingslides/3.svg';
import si from 'assets/images/workingslides/6.svg';
import se from 'assets/images/workingslides/7.svg';
import ni from 'assets/images/workingslides/9.svg';
import { useDesktop } from 'contexts';
import styles from './WorkingSlides.module.css';

SwiperCore.use([Navigation]);

export function WorkingSlides() {
  const isDesktop = useDesktop();
  const items = [{
    url: tw,
    head: 'Add Products',
    subHead: 'Add your products, curate your catalogs to bring life to your website.',
    color: '#4DD0E1'
  },
  {
    url: si,
    head: 'Promote your shop',
    subHead: 'Share your shop URL far and wide, with friends, family, and followers.',
    color: '#E5A271'
  }, {
    url: ni,
    head: 'Accept your Order',
    subHead: 'Go ahead and accept your order on finalizing the product details and customizations.',
    color: '#4FC3F7'
  }, {
    url: se,
    head: 'Ship Your Order',
    subHead: 'Update shipping status by self-shipping or via shipping partners and track it easily.',
    color: '#81C784'
  }, {
    url: th,
    head: 'Collect Payments',
    subHead: 'Collect Payments online or cash or through custom payment modes and track your revenue.',
    color: '#AED581'
  },
  {
    url: tw,
    head: 'Customize Your Shop',
    subHead: 'Customize your shop website with beautiful themes, banners, loads of content and more to attract more customers.',
    color: '#4DD0E1'
  },
  ];

  return (
    <>
      {isDesktop && (
        <div className={styles.section}>
          <Swiper
            grabCursor={true}
            initialSlide={0}
            spaceBetween={30}
            navigation={true}
            className={styles.minheight}
            slidesPerView="auto"
          >
            {items.map((el, i) => (
              <SwiperSlide
                key={i}
                style={{ background: el.color }}
                className={styles.card}
              >
                <div className={styles.relative}>
                  <div className={cx(styles.head)}>
                    {el.head}
                  </div>
                  <div className={cx(styles.title)}>
                    {el.subHead}
                  </div>
                  <div className={cx(styles.bottom)}>
                    <div className={cx(styles.step)}>{`Step ${i + 1}`}</div>
                    <img src={el.url} alt="" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
      {!isDesktop && (
        <div className={styles.section}>
          <Swiper
            grabCursor={true}
            initialSlide={0}
            spaceBetween={30}
            className={styles.minheight}
            slidesPerView="auto"
          >
            {items.map((el, i) => (
              <SwiperSlide
                key={i}
                style={{ background: el.color }}
                className={styles.card}
              >
                <div className={styles.relative}>
                  <div className={cx(styles.head)}>
                    {el.head}
                  </div>
                  <div className={cx(styles.title)}>
                    {el.subHead}
                  </div>
                  <div className={cx(styles.bottom)}>
                    <div className={cx(styles.step)}>{`Step ${i + 1}`}</div>
                    <img src={el.url} alt="" />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </>

  );
}
