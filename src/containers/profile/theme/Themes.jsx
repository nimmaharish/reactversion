import React from 'react';
import { useQueryParams } from 'hooks';
import { Drawer } from 'components/shared/Drawer';
import { useDesktop } from 'contexts';
import { useHistory } from 'react-router-dom';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import Step1 from './Step1';
import Step2 from './Step2';
import ThemeSelection from './ThemeSelection';
import styles from './Themes.module.css';

function Themes() {
  const params = useQueryParams();
  const step = params.get('step') || '1';
  const isDesktop = useDesktop();
  const history = useHistory();

  const getTitle = () => {
    if (step === '1') {
      return 'Select Theme';
    }
    if (step === '2') {
      return 'Theme Details';
    }
    return 'Customize Theme';
  };

  const body = () => (
    <div className={styles.themesSection}>
      {step === '1' && <Step1 />}
      {step === '2' && <Step2 />}
      {step === '3' && <ThemeSelection />}
    </div>
  );

  if (!isDesktop) {
    return (
      <Drawer title={getTitle()}>
        {body()}
      </Drawer>
    );
  }

  return (
    <div className={styles.desktopContainer}>
      <div onClick={() => history.goBack()} className={styles.maintitle}>
        <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
        <div>&nbsp;</div>
        <div>&nbsp;</div>
        {getTitle()}
      </div>
      {body()}
    </div>
  );
}

export default Themes;
