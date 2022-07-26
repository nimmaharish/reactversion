import React from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'components/shared/Drawer';
import { SideDrawer } from 'components/shared/SideDrawer';
import { useDesktop, useLanguage, useSetLanguage } from 'contexts';
import { ALL_LANGUAGES } from 'components/global/translateUtils';
import { Select } from 'phoenix-components';
import styles from './LanguageDrawer.module.css';

export function LanguageDrawer({
  onBack
}) {
  const isDesktop = useDesktop();
  const language = useLanguage();
  const storeSelected = ALL_LANGUAGES.find(x => x.value === language);
  const setLanguage = useSetLanguage();

  const setLang = ({ value }) => {
    setLanguage(value);
    onBack();
  };

  return (
    <>
      {!isDesktop
        && (
          <Drawer title="Select Language" onClose={onBack}>
            <div translate="no" className={styles.drawer}>
              <div>
                <Select
                  options={ALL_LANGUAGES}
                  label="Select Language"
                  onChange={setLang}
                  value={storeSelected}
                />
                <div className={styles.helperTextD}>
                  You can always change your language later in settings
                </div>
              </div>
            </div>
          </Drawer>
        )}
      {isDesktop
        && (
          <SideDrawer
            onClose={onBack}
            closeButton={true}
          >
            <div className={styles.drawer}>
              <div>
                <Select
                  options={ALL_LANGUAGES}
                  label="Select Language"
                  onChange={setLang}
                  value={storeSelected}
                />
                <div className={styles.helperTextD}>
                  You can always change your language later in settings
                </div>
              </div>
            </div>
          </SideDrawer>
        )}
    </>
  );
}

LanguageDrawer.propTypes = {
  onBack: PropTypes.func.isRequired,
};
