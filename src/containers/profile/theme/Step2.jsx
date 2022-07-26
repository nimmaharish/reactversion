import React from 'react';
import { useQueryParams } from 'hooks';
import { useHistory } from 'react-router-dom';
import { Button } from 'phoenix-components';
import SwiperCore, { Navigation } from 'swiper';
import 'swiper/swiper-bundle.css';
import WebView from 'services/webview';
import { useShop } from 'contexts/userContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/components/navigation/navigation.min.css';
import { useDesktop } from 'contexts';
import { themes } from './utils';
import { desktopThemes } from './desktopUtils';
import styles from './Step2.module.css';

SwiperCore.use([Navigation]);

function Step2() {
  const params = useQueryParams();
  const theme = params.get('theme') || 'celosia';
  const history = useHistory();
  const isDesktop = useDesktop();
  const shop = useShop();
  const isIndia = shop?.country?.toLowerCase() === 'india';

  const items = isDesktop ? desktopThemes : themes;

  const themeData = items.find(x => x.name === theme);
  const media = themeData.images;

  return (
    <div className={styles.themesSection}>
      <div
        className={styles.viewBox}
        style={{ backgroundImage: `url(${themeData.background})` }}
      >
        <Swiper
          grabCursor={true}
          initialSlide={0}
          spaceBetween={30}
          watchOverflow={true}
          className={styles.swiper}
          centeredSlides={true}
          pagination={{ clickable: false }}
          navigation={isDesktop}
          slidesPerView="auto"
        >
          {media.map((el, i) => (
            <SwiperSlide
              key={i}
              className={styles.slide}
            >
              <div className={styles.head}>{el.head}</div>
              <div className={styles.body}>
                <img
                  className={styles.image}
                  src={el.url}
                  alt=""
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.buttons}>
        <Button
          primary={false}
          size="medium"
          onClick={() => {
            const url = `https://mywindo.shop/anabellawomen?themeName=${theme}`;
            const other = `https://mywindo.shop/kiarafashion?themeName=${theme}`;
            const urlToOpen = isIndia ? other : url;
            if (WebView.isWebView()) {
              WebView.openUrl(urlToOpen);
              return;
            }
            window.open(urlToOpen, '_blank');
          }}
          label="Preview"
          className={styles.button}
        />
        <Button
          size="medium"
          primary={true}
          onClick={() => {
            params.set('step', '3');
            params.set('theme', theme);
            history.push({
              search: params.toString(),
            });
          }}
          label="PICK COLOR"
          className={styles.button}
        />
      </div>
    </div>
  );
}

export default Step2;
