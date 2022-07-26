/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Drawer } from 'components/shared/Drawer';
import { PixelCard } from 'components/profile/marketingPixels/PixelCard';
import { getInitialValues } from 'components/profile/marketingPixels/utils';
import fbIcon from 'assets/v2/settings/marketingPixels/fb.svg';
import gaIcon from 'assets/v2/settings/marketingPixels/ga.svg';
import { Formik } from 'formik';
import {
  useIsMarketingPixelEnabled, useOpenPlans, useRefreshShop, useShop
} from 'contexts/userContext';
import { IDBottomDrawer } from 'components/profile/marketingPixels/IDBottomDrawer';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { Becca } from 'api';
import { useDesktop } from 'contexts';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import { useHistory } from 'react-router-dom';
import { SideDrawer } from 'components/shared/SideDrawer';
import Kbc from 'components/knowBaseCards/KnowBaseCards';
import styles from './MarketingPixels.module.css';

function MarketingPixels() {
  const shop = useShop();
  const isEnabled = useIsMarketingPixelEnabled();
  const openPlans = useOpenPlans();
  const refreshShop = useRefreshShop();
  const [idDraw, setIdDraw] = useState(null);
  const isDesktop = useDesktop();
  const history = useHistory();

  const onSubmit = async (values) => {
    if (!isEnabled) {
      openPlans();
      return;
    }
    try {
      Loader.show();
      const { config = {} } = shop;
      config.pixels = values;
      await Becca.updateShop({
        config,
      });
      refreshShop();
      SnackBar.show('Pixel changes saved successfully!', 'success');
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  if (isDesktop) {
    return (
      <div className={styles.desktopContainer}>
        <div onClick={() => history.goBack()} className={styles.maintitle}>
          <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          Marketing Plugins
        </div>
        <Formik
          initialValues={getInitialValues(shop?.config?.pixels || {})}
          onSubmit={onSubmit}
        >
          <div className={styles.cards}>
            <PixelCard
              icon={fbIcon}
              title="Facebook Pixel"
              description={`Facebook Pixel is an analytics tool that helps you measure the effectiveness of your 
              advertising efforts by understanding how people behave, and what actions they take on your website`}
              name="fb"
              color="rgba(59, 89, 152, 0.1)"
              onConnect={() => setIdDraw('fb')}
            />
            <PixelCard
              icon={gaIcon}
              title="Google Analytics"
              description={`It is an analytics tool that allows you to measure the effectiveness of your 
            advertising by understanding the actions people take on  your website`}
              name="ga"
              color="rgba(249, 171, 0, 0.1)"
              onConnect={() => setIdDraw('ga')}
            />
            {idDraw && (
              <SideDrawer
                backButton={true}
                title={idDraw === 'fb' ? 'Facebook Pixel' : 'Google Analytics'}
                onClose={() => setIdDraw(null)}
                button={false}
              >
                <IDBottomDrawer onClose={() => setIdDraw(null)} name={idDraw} />
              </SideDrawer>
            )}
          </div>
        </Formik>
        <div className="flexCenter fullWidth">
          <Kbc type="marketingPixel" />
        </div>
      </div>
    );
  }
  return (
    <Drawer title="Marketing Plugins" backButton={true}>
      <Formik
        initialValues={getInitialValues(shop?.config?.pixels || {})}
        onSubmit={onSubmit}
      >
        <div className={styles.cards}>
          <PixelCard
            icon={fbIcon}
            title="Facebook Pixel"
            description={`Facebook Pixel is an analytics tool that helps you measure the effectiveness of your
             advertising efforts  by understanding how people behave, and what actions they take on your website`}
            name="fb"
            color="rgba(59, 89, 152, 0.1)"
            onConnect={() => setIdDraw('fb')}
          />
          <PixelCard
            icon={gaIcon}
            title="Google Analytics"
            description={`It is an analytics tool that allows you to measure the effectiveness of your 
            advertising by understanding the actions people take on  your website`}
            name="ga"
            color="rgba(249, 171, 0, 0.1)"
            onConnect={() => setIdDraw('ga')}
          />
          {idDraw && (
            <IDBottomDrawer onClose={() => setIdDraw(null)} name={idDraw} />
          )}
        </div>
      </Formik>
      <div className={styles.kbc}>
        <Kbc type="marketingPixel" />
      </div>
    </Drawer>
  );
}

MarketingPixels.propTypes = {};

MarketingPixels.defaultProps = {};

export default MarketingPixels;
