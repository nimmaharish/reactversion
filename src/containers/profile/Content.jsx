import React from 'react';
import { useHistory } from 'react-router-dom';
import aboutSellerIcon from 'assets/overview/aboutSeller.svg';
import socialMediaIcon from 'assets/overview/socialMediaIcon.svg';
import { Clickable } from 'phoenix-components';
import { useQueryParams } from 'hooks';
import { Drawer } from 'components/shared/Drawer';
import styles from './Profile.module.css';

function Content() {
  const history = useHistory();
  const params = useQueryParams();

  // eslint-disable-next-line react/no-multi-comp
  const getTile = (primary, secondary, icon, param, to,) => (
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
        className={styles.tileText}
      >
        {primary}
      </div>
      <div
        className={styles.tiletext2}
      >
        {secondary}
      </div>
    </Clickable>
  );

  return (
    <Drawer
      className={styles.section}
      title="Content"
    >
      <div id="scroll" className={styles.sdContent}>
        <div className={styles.shopSetting}>
          {getTile('About seller', 'Add or edit about seller', aboutSellerIcon, null, '/about/seller')}
          {getTile('Social Media', 'Link your social media account', socialMediaIcon, null, '/accounts')}
        </div>
      </div>
    </Drawer>

  );
}
export default Content;
