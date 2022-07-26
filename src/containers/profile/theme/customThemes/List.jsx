import React, { useEffect, useState } from 'react';
import { Button, Clickable, Switch } from 'phoenix-components';
import checked from 'assets/images/shippingModes/checked.svg';
import unchecked from 'assets/images/shippingModes/unChecked.svg';
import { useThemeConfig, useToggle } from 'hooks/common';
import { useDesktop, useRefreshShop, useShop } from 'contexts';
import { useQueryParams } from 'hooks';
import { useHistory } from 'react-router-dom';
import { StatusSelectionBar } from 'components/shared/StatusSelectionBar';
import Loader from 'services/loader';
import cx from 'classnames';
import SnackBar from 'services/snackbar';
import { Becca } from 'api';
import { Loading } from 'components/shared/Loading';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import Layout from './Layout';
import { getDefaultValues } from './utils';
import styles from './List.module.css';

function List() {
  const history = useHistory();
  const shop = useShop();
  const refreshShop = useRefreshShop();
  const params = useQueryParams();
  const [initialValues, setInitialValues, loading, refresh] = useThemeConfig();
  const componentType = params.get('type') || '';
  const isDesktop = useDesktop();
  const isType = params.has('type');
  const [componentValue, setComponentValue] = useState(initialValues[componentType]?.name || null);
  const [key, setKey] = useState(null);

  useEffect(() => {
    if (componentType) {
      setComponentValue(initialValues[componentType]?.name || null);
    }
  }, [componentType]);

  if (loading) {
    return <Loading />;
  }

  const morph = (componentType, isDesktop) => {
    const actualValues = getDefaultValues(componentType, null, isDesktop);
    const appliedTheme = actualValues?.styles?.filter(x => x.title === initialValues[componentType]?.name);
    const otherThemes = actualValues?.styles?.filter(x => x.title !== initialValues[componentType]?.name);
    actualValues.styles = appliedTheme.concat(otherThemes);
    return actualValues;
  };

  const onSave = async () => {
    Loader.show();
    try {
      await Becca.updateShop({
        config: {
          ...(shop.config || {}),
          themeName: 'custom',
        }
      });
      if (componentType) {
        initialValues[componentType].name = componentValue || null;
        setInitialValues({ ...initialValues });
      }
      await Becca.updateUiConfig('themeConfig', initialValues);
      refresh();
      SnackBar.show('Theme saved successfully!', 'success');
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      if (isType) {
        history.goBack();
      }
      refreshShop();
      Loader.hide();
    }
  };

  const onEnable = (name) => {
    initialValues[name || key].enabled = !initialValues[key || name].enabled;
    setInitialValues({ ...initialValues });
    setKey(null);
    setTimeout(() => {
      onSave();
    }, 100);
  };

  const onOpenAlert = key => {
    if (initialValues[key]?.enabled) {
      setKey(key);
      return;
    }
    onEnable(key);
  };

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
  const [openLayout, toogleOpenLayout] = useToggle(false);
  const onStateChange = (val) => {
    if (val === 'layoutCustomization') {
      toogleOpenLayout();
    }
  };

  return (
    <div className={styles.themesSection}>
      <StatusSelectionBar
        tabClassName={styles.tabClassName1}
        items={stateList}
        seperator={true}
        onChange={onStateChange}
        active="themes"
      />
      {openLayout && <Layout />}
      <div className={styles.themes}>
        {key && (
          <DeleteAlert
            title="By switching this off, this section will not be visible in your shop website."
            onCancel={() => setKey(null)}
            onDelete={() => onEnable()}
            primary="CONFIRM"
          />
        )}
        {componentType?.length === 0 && Object.values(getDefaultValues(null, 'celosia', isDesktop))
          ?.map(obj => (
            <>
              <div className={cx(styles.title, styles.flexBetween)}>
                {obj?.title}
                {(obj.key !== 'productCard' && obj.key !== 'header' && obj.key !== 'footer') && (
                  <Switch active={initialValues[obj?.key]?.enabled} onChange={() => onOpenAlert(obj.key)} />
                )}
              </div>

              <div className={styles.box}>
                {(obj?.key !== 'header' && obj?.key !== 'footer') ? (
                  <>
                    <div className={styles.center}>Current Style</div>
                    <div className={cx(styles.spacer, styles.w100)}>
                      <img
                        alt="Current Style"
                        className={cx(styles.img, styles[`${initialValues[obj?.key]?.name}${obj?.key}`])}
                        src={getDefaultValues(obj?.key, initialValues[obj?.key]?.name, isDesktop)?.styles[0]?.image}
                      />
                    </div>
                    <Clickable
                      className={styles.selectStyle}
                      onClick={
                        () => {
                          params.set('type', obj?.key);
                          history.push({ search: params.toString() });
                        }
                      }>
                      {'Select Style >'}
                    </Clickable>
                  </>
                ) : (
                  <Clickable
                    className={styles.comingSoon}>
                    Coming Soon...
                  </Clickable>
                )}
              </div>
            </>
          ))}
        {componentType?.length > 0 && Object.entries(morph(componentType, isDesktop))
          ?.map(([key, value]) => (
            <>
              {key === 'title' && <div className={styles.title}>{value}</div>}
              {key === 'styles' && value?.filter(s => s.title !== 'celosia')
                ?.map(obj => (
                  <div className={styles.box}>
                    <Clickable
                      className={cx(styles.selectStyle, styles.mb)}
                      onClick={() => setComponentValue(obj.title)}>
                      {obj?.title === componentValue ? 'Selected' : 'Select Style'}
                      <img
                        alt="radio"
                        src={obj?.title === componentValue ? checked : unchecked}
                        className={styles.radio}
                      />
                    </Clickable>
                    <div className={styles.w100}>
                      <img
                        alt="radio"
                        className={cx(styles.img, styles[`${obj.title}${componentType}`])}
                        src={obj.image}
                      />
                    </div>
                  </div>
                ))}
            </>
          ))}
      </div>
      <div className={styles.buttonContainer}>
        <Button
          size="large"
          label="Save Changes"
          bordered={false}
          className={styles.button}
          onClick={onSave}
        />
      </div>
    </div>
  );
}

export default List;
