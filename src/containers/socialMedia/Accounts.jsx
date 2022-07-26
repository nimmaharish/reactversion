import React from 'react';
// import Header from 'containers/products/Header';
import { Drawer } from 'components/shared/Drawer';
import { useHistory } from 'react-router-dom';
import socialMediaIcon from 'assets/images/socialMedia/socialMedia.svg';
import fbIcon from 'assets/images/socialMedia/fb.svg';
import waIcon from 'assets/images/socialMedia/wa.svg';
import piIcon from 'assets/images/socialMedia/pi.svg';
import twIcon from 'assets/images/socialMedia/tw.svg';
import ytIcon from 'assets/images/socialMedia/yt.svg';
import igIcon from 'assets/images/socialMedia/ig.svg';
import fbDesktopIcon from 'assets/desktop/socialMedia/facebook.svg';
import instagramDesktopIcon from 'assets/desktop/socialMedia/instagram.png';
import whatsappDesktopIcon from 'assets/desktop/socialMedia/whatsapp.svg';
import pinterestDesktopIcon from 'assets/desktop/socialMedia/pinterest.svg';
import twitterDesktopIcon from 'assets/desktop/socialMedia/twitter.svg';
import youtubeDesktopIcon from 'assets/desktop/socialMedia/youtube.svg';
import { useShop, useRefreshShop } from 'contexts/userContext';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import { difference } from 'lodash';
import { useDesktop } from 'contexts';
import Form from './Form';
import styles from './Accounts.module.css';

function Accounts() {
  const history = useHistory();
  const isDesktop = useDesktop();
  const items = [{
    name: 'facebook',
    icon: isDesktop ? fbDesktopIcon : fbIcon
  },
  {
    name: 'instagram',
    icon: isDesktop ? instagramDesktopIcon : igIcon
  },
  {
    name: 'whatsapp',
    icon: isDesktop ? whatsappDesktopIcon : waIcon
  },
  {
    name: 'youtube',
    icon: isDesktop ? youtubeDesktopIcon : ytIcon
  },
  {
    name: 'pinterest',
    icon: isDesktop ? pinterestDesktopIcon : piIcon
  },
  {
    name: 'twitter',
    icon: isDesktop ? twitterDesktopIcon : twIcon
  }];

  const shop = useShop();
  const refresh = useRefreshShop();

  const linkedAccounts = shop?.linkedAccounts?.filter(x => !!x.name) || [];
  const notLinkedAccounts = difference(items.map(x => x.name), linkedAccounts.map(x => x.name));

  // eslint-disable-next-line react/no-multi-comp
  const getForm = (item, isNew = false) => {
    let icon = items.find(x => x.name === item.name)?.icon;
    if (isNew) {
      icon = items.find(x => x.name === item)?.icon;
    }
    return <Form refresh={refresh} isNew={isNew} item={item} icon={icon} />;
  };

  if (isDesktop) {
    return (
      <div className={styles.container}>
        <div onClick={() => history.goBack()} className={styles.maintitle}>
          <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          Social Media
        </div>
        <div className={styles.addDesktop}>
          {linkedAccounts.length > 0 && (<div className={styles.heading}>Linked Accounts</div>)}
          {linkedAccounts.length > 0 && linkedAccounts.map(x => getForm(x))}
          {linkedAccounts.length === 0 && (
            <div className={styles.heading}>
              <div className={styles.head1}>
                <div>
                  <img src={socialMediaIcon} alt="" />
                </div>
                <div className={styles.headText}>
                  You haven’t linked your social media account yet!
                </div>
              </div>
            </div>
          )}
          {notLinkedAccounts.length > 0 && (
            <div className={styles.heading}>
              Link Accounts
            </div>
          )}
          {notLinkedAccounts.length > 0 && notLinkedAccounts.map(x => getForm(x, true))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Drawer onBack={() => history.goBack()} title="Social Media">
        <div className={styles.add}>
          {linkedAccounts.length > 0 && (<div className={styles.heading}>Linked Accounts</div>)}
          {linkedAccounts.length > 0 && linkedAccounts.map(x => getForm(x))}
          {linkedAccounts.length === 0 && (
            <div className={styles.heading}>
              <div className={styles.head1}>
                <div>
                  <img src={socialMediaIcon} alt="" />
                </div>
                <div className={styles.headText}>
                  You haven’t linked your social media account yet!
                </div>
              </div>
            </div>
          )}
          {notLinkedAccounts.length > 0 && (
            <div className={styles.heading}>
              Link Accounts
            </div>
          )}
          {notLinkedAccounts.length > 0 && notLinkedAccounts.map(x => getForm(x, true))}
        </div>
      </Drawer>
    </div>
  );
}
Accounts.propTypes = {
};

export default Accounts;
