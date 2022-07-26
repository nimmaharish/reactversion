import React from 'react';
import { useHistory } from 'react-router-dom';
import bannerIcon from 'assets/v2/settings/banner.svg';
import { Clickable } from 'phoenix-components';
import { useQueryParams } from 'hooks';
import HelloBar from 'components/profile/HelloBar';
import { Drawer } from 'components/shared/Drawer';
// import { useDesktop } from 'contexts';
import styles from './Profile.module.css';

function AnnouncementsBanners() {
  const history = useHistory();
  const params = useQueryParams();
  const openHelloBar = params.has('openHelloBar');
  // const isDesktop = useDesktop();

  // eslint-disable-next-line react/no-multi-comp
  const getTile = (primary, icon, param, to,) => (
    <Clickable
      className={styles.tile}
      onClick={() => {
        if (param) {
          params.set(param, 'true');
          history.push({
            search: params.toString(),
          });
          return;
        }
        history.push(to);
      }}
    >
      <div classes={{ root: styles.minW }}>
        <img
          alt=""
          src={icon}
        />
      </div>
      <div
        className={styles.tileText2}
      >
        {primary}
      </div>
    </Clickable>
  );

  // if (isDesktop) {
  //   return (
  //     <div className={styles.desktopContainer}>
  //       {openHelloBar && <HelloBar />}
  //       <div id="scroll" className={styles.sdContent}>
  //         <div className={styles.shopSetting}>
  //           {getTile('Banners', bannerIcon, null, '/manage/marketingBanners')}
  //           {getTile('Hello Bar', announcementsIcon, 'openHelloBar')}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <Drawer
      className={styles.section}
      title="Announcements & Promos"
    >
      {openHelloBar && <HelloBar />}
      <div id="scroll" className={styles.sdContent}>
        <div className={styles.shopSetting}>
          {getTile('Banners', bannerIcon, null, '/manage/marketingBanners')}

        </div>
      </div>
    </Drawer>

  );
}
export default AnnouncementsBanners;
