import React from 'react';
import { Grid } from '@material-ui/core';
import newIcon from 'assets/images/theme/new.svg';
import { Button } from 'phoenix-components';
import { useQueryParams } from 'hooks';
// import { useToggle } from 'hooks/common';
import { useHistory } from 'react-router-dom';
import { Becca } from 'api';
import cx from 'classnames';
import SnackBar from 'services/snackbar';
import { StatusSelectionBar } from 'components/shared/StatusSelectionBar';
import Loader from 'services/loader';
import { useDesktop, usePlan } from 'contexts';
import { useShop, useRefreshShop, useOpenPlans } from 'contexts';
import { useIsFreePlan } from 'contexts/userContext';
import appliedIcon from 'assets/themes/selected.svg';
import featureIcon from 'assets/v2/overview/feature.svg';
import Kbc from 'components/knowBaseCards/KnowBaseCards';
import { useLayoutConfig } from 'hooks/common';
import { themes } from './utils';
import Layout from './customThemes/Layout';
import { desktopThemes } from './desktopUtils';
import styles from './Step1.module.css';
import CustomTheme from './customThemes/List';

function Step1() {
  const history = useHistory();
  const params = useQueryParams();
  const shop = useShop();
  const refresh = useRefreshShop();
  const { config: { themeName = 'celosia' } } = shop;
  const isDesktop = useDesktop();
  const isFreePlan = useIsFreePlan();
  const isCustomTheme = params.get('customTheme');
  const currentPlan = usePlan();
  const isPremium = currentPlan.name === 'premium';
  const openPlans = useOpenPlans(true, 'generic', 'premium');
  const items = isDesktop ? desktopThemes : themes;
  const isActive = useLayoutConfig();

  const morph = () => {
    const appliedTheme = items.filter(x => x.name === themeName);
    const otherThemes = items.filter(x => x.name !== themeName);
    return appliedTheme.concat(otherThemes);
  };
  const type = params.has('tab') ? params.get('tab') : isActive ? 'themes' : 'layoutCustomization';

  const stateList = [
    {
      label: 'Themes',
      value: 'themes',
    },
    {
      label: 'Layout Customization',
      value: 'layoutCustomization',
    },
  ];

  const onStateChange = (val) => {
    params.set('tab', val);
    history.push({ search: params.toString() });
  };
  const isApplied = (name) => name === themeName;

  const onSave = async (themeName) => {
    const isFeatureTheme = items.find(x => x.name === themeName).feature;
    if (isFeatureTheme && isFreePlan) {
      params.set('openPlans', 'generic');
      history.push({
        search: params.toString(),
      });
      return;
    }
    Loader.show();
    try {
      await Becca.updateShop({
        config: {
          ...(shop.config || {}),
          themeName,
        }
      });
      refresh();
      SnackBar.show('Theme saved successfully!', 'success');
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  if (isCustomTheme) {
    return <CustomTheme />;
  }

  return (
    <div className={styles.themesSection}>
      <StatusSelectionBar
        seperator={true}
        active={type}
        tabClassName={styles.tabClassName}
        items={stateList}
        onChange={onStateChange}
      />
      {type === 'layoutCustomization' && <Layout />}
      {type === 'themes' && (
        <>
          <Grid container>
            {morph().map(x => (
              <Grid item xs={12} md={4}>
                <div
                  className={cx(styles.card, {
                    [styles.bgnCarnation]: x.title === 'Carnation',
                    [styles.bgnCelosia]: x.title === 'Celosia',
                    [styles.bgnDaffodil]: x.title === 'Daffodil',
                    [styles.bgnCalathea]: x.title === 'Calathea',
                    [styles.bgnLilac]: x.title === 'Lilac',
                    [styles.bgnOwnTheme]: x.title === 'Build Your Own Theme'
                  })}>
                  {x.new && (
                    <div className={styles.new}>
                      <img src={newIcon} alt="new" />
                    </div>
                  )}
                  {isApplied(x.name) && (<img src={appliedIcon} className={styles.icon1} alt="applied" />)}
                  {x.feature && isFreePlan && (<img src={featureIcon} className={styles.icon2} alt="applied" />)}
                  <div className={styles.name}>{x.title}</div>
                  <div className={styles.description}>{x.description}</div>
                  <div className={styles.image}>
                    <img src={x.image} alt={x.description} />
                  </div>
                </div>
                <div className={styles.buttons}>
                  <Button
                    primary={false}
                    size="medium"
                    onClick={() => {
                      if (x.name === 'custom') {
                        if (!isPremium) {
                          openPlans();
                          return;
                        }
                        params.set('customTheme', true);
                        history.push({
                          search: params.toString(),
                        });
                        return;
                      }
                      params.set('step', '2');
                      params.set('theme', x.name);
                      history.push({
                        search: params.toString(),
                      });
                    }}
                    label="Details"
                    className={styles.button}
                  />
                  <Button
                    size="medium"
                    primary={true}
                    onClick={() => {
                      if (x.name === 'custom') {
                        if (!isPremium) {
                          openPlans();
                          return;
                        }
                        params.set('customTheme', true);
                        history.push({
                          search: params.toString(),
                        });
                        return;
                      }
                      onSave(x.name);
                    }}
                    label={isApplied(x.name) ? 'CUSTOMIZE' : 'APPLY'}
                    className={styles.button}
                  />
                </div>
              </Grid>
            ))}
          </Grid>
          {isDesktop ? (
            <div className={styles.kbcDesk}>
              <Kbc type="shopThemeSettings" />
            </div>
          ) : (
            <div className={styles.kbc}>
              <Kbc type="shopThemeSettings" />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Step1;
