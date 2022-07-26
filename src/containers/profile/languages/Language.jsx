import React, { useState } from 'react';
import {
  useDesktop, useLanguage, useRefreshShop, useSetLanguage, useShop
} from 'contexts';
import { useIsFreePlan, useOpenPlans } from 'contexts/userContext';
import { Drawer } from 'components/shared/Drawer';
import { SideDrawer } from 'components/shared/SideDrawer';
import { Button, Select } from 'phoenix-components';
import { Becca } from 'api';
import { useHistory } from 'react-router-dom';
import Loader from 'services/loader';
import { FooterButton } from 'components/common/FooterButton';
import SnackBar from 'services/snackbar';
import { ALL_LANGUAGES } from 'components/global/translateUtils';
import Kbc from 'components/knowBaseCards/KnowBaseCards';
import cookie from 'react-cookies';
import Info from 'components/info/Info';
import Accordion from './Accordion';
import styles from './Language.module.css';

const languages = ALL_LANGUAGES;

function Language() {
  const shop = useShop();
  const language = useLanguage();
  const setLanguage = useSetLanguage();
  const refreshShop = useRefreshShop();
  const isDesktop = useDesktop();
  const history = useHistory();
  const onBack = () => history.goBack();
  const [lang, setLang] = useState(shop?.config?.lang || 'en');
  const [storeLang, setStoreLang] = useState(language || 'en');
  const selectedLang = languages.find(x => x.value === lang);
  const storeSelected = ALL_LANGUAGES.find(x => x.value === storeLang);
  const [userComLang, setUserComLang] = useState(shop?.config?.userComLang || 'en');
  const [storeComLang, setStoreComLang] = useState(shop?.config?.storeComLang || 'en');
  const userComSelected = ALL_LANGUAGES.find(x => x.value === userComLang);
  const storeComSelected = ALL_LANGUAGES.find(x => x.value === storeComLang);
  const isFree = useIsFreePlan();
  const openPlans = useOpenPlans();

  const onSave = async () => {
    try {
      Loader.show();
      const config = shop.config || {};
      config.lang = lang;
      config.sellerLang = storeLang;
      config.userComLang = userComLang;
      config.storeComLang = storeComLang;
      await Becca.updateShop({ config });
      refreshShop();
      SnackBar.show('Language changed successfully!', 'success');
      history.goBack();
      if (storeLang !== lang) {
        const { host } = window.location;
        cookie.remove('googtrans', {
          domain: host.includes('windo.live')
            ? '.windo.live' : host.includes('mywindo.shop') ? '.mywindo.shop' : 'localhost',
        });
      }
      setLanguage(storeLang);
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const onComLanguageChange = (type) => ({ value }) => {
    if (isFree) {
      openPlans();
      return;
    }

    if (type === 'user') {
      setUserComLang(value);
      return;
    }
    if (type === 'store') {
      setStoreComLang(value);
    }
  };

  const Component = isDesktop ? SideDrawer : Drawer;

  return (

    <Component
      title="Shop Language"
      backButton
      onClose={onBack}
    >
      <>

        <div className={styles.container}>
          <div className={styles.heading}>
            Shop Website Language
          </div>
          <div translate="no">
            <Select
              options={languages}
              label="Select Language"
              onChange={(val) => setLang(val.value)}
              value={selectedLang}
            />
          </div>
          <div className={styles.hint}>
            Above language will be set as default for your shop's website
          </div>
          <div className={styles.heading}>
            WINDO App Language
          </div>
          <div translate="no">
            <Select
              options={ALL_LANGUAGES}
              label="Select Language"
              onChange={(val) => setStoreLang(val.value)}
              value={storeSelected}
            />
          </div>
          <br />
          <Info
            title="Note"
            text={`Please note that the app translation is powered by google translate and might not be accurate.
             The App is best used in English.`}
          />
          <Accordion
            label="Advanced Settings"
          >
            <div className={styles.heading}>
              Shop Communication Language
            </div>
            <div translate="no">
              <Select
                options={languages}
                label="Select Language"
                onChange={onComLanguageChange('user')}
                value={userComSelected}
              />
            </div>
            <div className={styles.hint}>
              Above language will be set as default for your customers e-mail communication
            </div>
            <div className={styles.heading}>
              App Communication Language
            </div>
            <div translate="no">
              <Select
                options={ALL_LANGUAGES}
                label="Select Language"
                onChange={onComLanguageChange('store')}
                value={storeComSelected}
              />
            </div>
            <div className={styles.hint}>
              Above language will be set as default for the e-mails you get from windo
            </div>
          </Accordion>
          {!isDesktop && (
            <div className={styles.kbc}>
              <Kbc type="langSetting" />
            </div>
          )}
          {isDesktop ? (
            <div>

              <div className="flexCenter fullWidth">
                <Kbc type="langSetting" />
              </div>
              <div className={styles.containerB}>
                <Button
                  size="large"
                  label="Save"
                  primary={true}
                  className={styles.button}
                  onClick={onSave}
                />
              </div>
            </div>
          ) : (
            <FooterButton>
              <Button
                fullWidth
                bordered={false}
                label="Save"
                primary={true}
                size="large"
                onClick={onSave}
              >
              </Button>
            </FooterButton>
          )}
        </div>
      </>
    </Component>
  );
}

export default Language;
