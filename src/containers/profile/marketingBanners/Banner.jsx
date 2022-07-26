import React from 'react';
import { Drawer } from 'components/shared/Drawer';
import { TemplateGallery } from 'components/profile/marketingBanners/TemplateGallery';
import { Preview } from 'components/profile/marketingBanners/Preview';
import { Saved } from 'components/profile/marketingBanners/Saved';
import { useDesktop } from 'contexts';
import { useHistory } from 'react-router-dom';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import Kbc from 'components/knowBaseCards/KnowBaseCards';
import styles from './Banner.module.css';

function Banner() {
  const isDesktop = useDesktop();
  const history = useHistory();

  if (isDesktop) {
    return (
      <div className={styles.container}>
        <div onClick={() => history.goBack()} className={styles.maintitle}>
          <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          Marketing Banners
        </div>
        <Preview />
        <Saved />
        <TemplateGallery />
        <div className="flexCenter fullWidth">
          <Kbc type="marketingBanners" />
        </div>
      </div>
    );
  }
  return (
    <Drawer title="Marketing Banner">
      <div className={styles.container}>
        <Preview />
        <Saved />
        <TemplateGallery />
        <div className="marginLLeftRight">
          <Kbc type="marketingBanners" />
        </div>

      </div>
    </Drawer>
  );
}

Banner.propTypes = {};

Banner.defaultProps = {};

export default Banner;
