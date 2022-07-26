import React from 'react';
import { Carousel } from 'phoenix-components';
import createShop from 'assets/v2/login/slider/createShop.svg';
import getDiscovered from 'assets/v2/login/slider/getDiscovered.svg';
import onlinePayment from 'assets/v2/login/slider/onlinePayment.svg';
import delivery from 'assets/v2/login/slider/delivery.svg';
import privacy from 'assets/v2/login/slider/privacy.svg';
import createShopDeskIcon from 'assets/v2/login/slider/createShopDesk.svg';
import getDiscoveredDeskIcon from 'assets/v2/login/slider/getDiscoveredDesk.svg';
import onlinePaymentDeskIcon from 'assets/v2/login/slider/onlinePaymentDesk.svg';
import deliveryDeskIcon from 'assets/v2/login/slider/deliveryDesk.svg';
import privacyDeskIcon from 'assets/v2/login/slider/privacyDesk.svg';
import { useDesktop } from 'contexts';
import styles from './Slider.module.css';

const slides = [
  {
    image: createShop,
    content: 'Online Shop in Minutes',
  },
  {
    image: getDiscovered,
    content: 'Easy Order Management',
  },
  {
    image: onlinePayment,
    content: 'Online Payments',
  },
  {
    image: delivery,
    content: 'Tailored Delivery Support',
  },
  {
    image: privacy,
    content: 'Safe & Secure',
  }
];

const desktopSlides = [
  {
    image: createShopDeskIcon,
    content: 'Online Shop in Minutes',
  },
  {
    image: getDiscoveredDeskIcon,
    content: 'Easy Order Management',
  },
  {
    image: onlinePaymentDeskIcon,
    content: 'Online Payment',
  },
  {
    image: deliveryDeskIcon,
    content: 'Tailored Delivery Support',
  },
  {
    image: privacyDeskIcon,
    content: 'Safe & Secure',
  }
];

export function Slider() {
  const isDesktop = useDesktop();

  const items = isDesktop ? desktopSlides : slides;

  return (
    <Carousel
      // className={isDesktop ? styles.deskCarousel : styles.defaultCarousel}
      showStatus={false}
      showArrows={false}
      autoPlay={true}
      interval={2000}
      infiniteLoop={true}
      showIndicators={true}
      showThumbs={false}
      swipeable={true}
    >
      {items.map(((slide, idx) => (
        <div key={idx} className={styles.item}>
          <img className={styles.image} src={slide.image} alt="" />
          <div className={styles.content}>{slide.content}</div>
        </div>
      )))}
    </Carousel>
  );
}

Slider.propTypes = {};

Slider.defaultProps = {};
