import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'components/shared/Drawer';
import { Button, Clickable } from 'phoenix-components';
import { ColorCheckBox } from 'components/common/ColorCheckBox';
import { ShopPreview } from 'components/common/ShopPreview';
import cx from 'classnames';
import { useQueryParams } from 'hooks';
import { PlusIcon } from 'icons/Plus';
import { useToggle } from 'hooks/common';
import { ColorDialog } from 'components/common/ColorDialog';
import {
  useOpenPlans, useRefreshShop, useShop, useIsPremiumThemeEnabled
} from 'contexts';
import { useIsFreePlan } from 'contexts/userContext';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import { Becca } from 'api';
import CONFIG from 'config';
import { useDesktop } from 'contexts';
import { useHistory } from 'react-router-dom';
import { themes } from './utils';
import { desktopThemes } from './desktopUtils';
import styles from './ThemeSelection.module.css';

function ThemeSelection({ isStart }) {
  const shop = useShop();
  const params = useQueryParams();
  const isIndia = shop?.country?.toLowerCase() === 'india';
  const isDesktop = useDesktop();
  const [color, setColor] = useState(isStart ? '#4B7BE5' : (shop?.config?.themeColor || '#4B7BE5'));
  const [openPicker, togglePicker] = useToggle(false);
  const premiumThemeEnabled = useIsPremiumThemeEnabled();
  const openPlans = useOpenPlans();
  const refreshShop = useRefreshShop();
  const history = useHistory();
  const isFreePlan = useIsFreePlan();
  const themeName = params.get('theme') || 'celosia';

  const items = isDesktop ? desktopThemes : themes;

  const getShopName = () => {
    if (isIndia) {
      return 'kiarafashion';
    }
    return 'anabellawomen';
  };

  const defaultColor = color || '#4B7BE5';

  const onColorChange = (clr) => {
    setColor(clr);
    togglePicker();
  };

  const onSelectTheme = () => {
    if (premiumThemeEnabled) {
      togglePicker();
      return;
    }
    openPlans();
  };

  const onSave = async () => {
    Loader.show();
    try {
      const isFeatureTheme = items.find(x => x.name === themeName).feature;
      if (isFeatureTheme && isFreePlan) {
        params.set('openPlans', 'generic');
        history.push({
          search: params.toString(),
        });
        return;
      }

      await Becca.updateShop({
        config: {
          ...(shop.config || {}),
          themeColor: color,
          themeName
        }
      });
      refreshShop();
      SnackBar.show('Theme saved successfully!', 'success');
      if (!isStart) {
        history.push('/manage/theme');
      }
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const shopName = isStart ? CONFIG.ENV === 'production' ? getShopName() : 'windo' : shop.slug;

  if (!isStart && isDesktop) {
    return (
      <div className={styles.container2}>
        <div className={styles.box}>
          <div className={styles.box2}>
            <div className={styles.left}>
              <div className={styles.subHeading}>
                Preset Color
              </div>
              <div className={styles.colorBar2}>
                <ColorCheckBox color="#4B7BE5" onSelect={setColor} value={color} />
                <ColorCheckBox color="#00B0A5" onSelect={setColor} value={color} />
                <ColorCheckBox color="#00B2FF" onSelect={setColor} value={color} />
                <ColorCheckBox color="#E8505B" onSelect={setColor} value={color} />
                <ColorCheckBox color="#2566AF" onSelect={setColor} value={color} />

              </div>
            </div>
            <div className={styles.middle}></div>
            <div className={styles.right}>
              <div className="fullWidth">
                {openPicker && (
                  <ColorDialog onChange={onColorChange} color={color} />
                )}
                <div className={styles.subHeading}>
                  Select Primary Color
                </div>
                <Clickable onClick={onSelectTheme} className={styles.colorPicker} style={{ color: defaultColor }}>
                  <PlusIcon color={defaultColor} width="18px" height="18px" />
                  Pick Color
                </Clickable>
              </div>
            </div>

            {isStart && (
              <div className={styles.info}>
                You can always change your shop theme later
              </div>
            )}
          </div>
        </div>
        <div className={styles.pick}>
          <div className={cx(styles.heading, styles.previewHeading)}>Your Shop Preview</div>
          <div className={styles.preview2} style={{ border: `1px solid ${defaultColor}` }}>
            <ShopPreview
              key={color}
              classes={{
                container: styles.previewShop,
                iframe: styles.previewShop
              }}
              name={`${shopName}?themeColor=${color.replace('#', '')}&themeName=${themeName}`}
            />
          </div>
          <div className={styles.footer}>
            <Button
              size="large"
              label="Save Changes"
              onClick={onSave}
            />
          </div>
        </div>

      </div>
    );
  }

  return (
    <>
      {!isDesktop && (
        <Drawer title={isStart ? '' : 'Customize Theme'} backButton={!isStart}>
          <div className={styles.container}>
            <div className={styles.container1}>
              <div>
                <div className={styles.heading}>Choose your shop theme</div>
                <div className={styles.subHeading}>
                  Top Picked Colors
                </div>
                <div className={styles.colorBar}>
                  <ColorCheckBox color="#4B7BE5" onSelect={setColor} value={color} />
                  <ColorCheckBox color="#00B0A5" onSelect={setColor} value={color} />
                  <ColorCheckBox color="#00B2FF" onSelect={setColor} value={color} />
                  <ColorCheckBox color="#E8505B" onSelect={setColor} value={color} />
                  <ColorCheckBox color="#2566AF" onSelect={setColor} value={color} />
                </div>
                {isStart && (
                  <div className={styles.info}>
                    You can always change your shop theme later
                  </div>
                )}
              </div>
              {!isStart && (
                <>
                  {openPicker && (
                    <ColorDialog onChange={onColorChange} color={color} />
                  )}
                  <div className={styles.orDivider}>
                    <div />
                    <span>Or</span>
                    <div />
                  </div>
                  <div className={styles.subHeading}>
                    Select Primary Color
                  </div>
                  <Clickable onClick={onSelectTheme} className={styles.colorPicker} style={{ color: defaultColor }}>
                    <PlusIcon color={defaultColor} width="18px" height="18px" />
                    Pick Color
                  </Clickable>
                </>
              )}
              <div className={cx(styles.heading, styles.previewHeading)}>Your Shop Preview</div>
              <div className={styles.preview} style={{ border: `1px solid ${defaultColor}` }}>
                <ShopPreview
                  key={color}
                  classes={{
                    container: styles.previewShop,
                    iframe: styles.previewShop
                  }}
                  name={`${shopName}?themeColor=${color.replace('#', '')}&themeName=${themeName}`}
                />
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <Button
                size="large"
                fullWidth
                bordered={false}
                label="Save Changes"
                onClick={onSave}
              />
            </div>
          </div>
        </Drawer>
      )}
      {isDesktop && (
        <Drawer title={isStart ? '' : 'Customize Theme'} backButton={!isStart}>
          <div className={styles.container}>
            <div className={styles.container1}>
              <div>
                <div className={styles.heading}>Choose your shop theme</div>
                <div className={styles.subHeading}>
                  Top Picked Colors
                </div>
                <div className={styles.colorBar}>
                  <ColorCheckBox color="#4B7BE5" onSelect={setColor} value={color} />
                  <ColorCheckBox color="#00B0A5" onSelect={setColor} value={color} />
                  <ColorCheckBox color="#00B2FF" onSelect={setColor} value={color} />
                  <ColorCheckBox color="#E8505B" onSelect={setColor} value={color} />
                  <ColorCheckBox color="#2566AF" onSelect={setColor} value={color} />
                </div>
                {isStart && (
                  <div className={styles.info}>
                    You can always change your shop theme later
                  </div>
                )}
              </div>
              {!isStart && (
                <>
                  {openPicker && (
                    <ColorDialog onChange={onColorChange} color={color} />
                  )}
                  <div className={styles.orDivider}>
                    <div />
                    <span>Or</span>
                    <div />
                  </div>
                  <div className={styles.subHeading}>
                    Select Primary Color
                  </div>
                  <Clickable onClick={onSelectTheme} className={styles.colorPicker} style={{ color: defaultColor }}>
                    <PlusIcon color={defaultColor} width="18px" height="18px" />
                    Pick Color
                  </Clickable>
                </>
              )}
              <div className={cx(styles.heading, styles.previewHeading)}>Your Shop Preview</div>
              <div className={styles.preview} style={{ border: `1px solid ${defaultColor}` }}>
                <ShopPreview
                  key={color}
                  classes={{
                    container: styles.previewShop,
                    iframe: styles.previewShop
                  }}
                  name={`${shopName}?themeColor=${color.replace('#', '')}&themeName=${themeName}`}
                />
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <Button
                size="large"
                label="Save Changes"
                onClick={onSave}
              />
            </div>
          </div>
        </Drawer>
      )}
    </>

  );
}

ThemeSelection.propTypes = {
  isStart: PropTypes.bool,
};

ThemeSelection.defaultProps = {
  isStart: false,
};

export default ThemeSelection;
