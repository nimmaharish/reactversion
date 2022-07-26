import React, { useState } from 'react';
import { Drawer } from 'components/shared/Drawer';
import { useIsHelloBarEnabled, useRefreshShop, useShop } from 'contexts/userContext';
import { useDesktop, useOpenPlans } from 'contexts';
import { Button, Clickable } from 'phoenix-components';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import cx from 'classnames';
import { Becca } from 'api';
import { ShopPreview } from 'components/common/ShopPreview';
import { Formik } from 'formik';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import { useHistory } from 'react-router-dom';
import { FooterButton } from 'components/common/FooterButton';
import { getInitialValues, marshall, schema } from 'components/profile/helloBarUtils';
import { Details } from 'components/profile/helloBar/Details';
import { ActionButton } from 'components/profile/helloBar/ActionButton';
import { Visibility } from 'components/profile/helloBar/Visibility';
import Kbc from 'components/knowBaseCards/KnowBaseCards';
import styles from './HelloBar.module.css';

const TABS = [
  {
    label: 'Details',
    value: 'details',
  },
  {
    label: 'Action Button',
    value: 'actionButton',
  },
  {
    label: 'Visibility',
    value: 'visibility',
  },
];

export default function HelloBar() {
  const isDesktop = useDesktop();
  const history = useHistory();
  const shop = useShop();
  const refreshShop = useRefreshShop();
  const openPlans = useOpenPlans(true, 'helloBar');
  const isHelloBarEnabled = useIsHelloBarEnabled();
  const [tab, setTab] = useState('details');

  const save = async (values) => {
    if (!isHelloBarEnabled) {
      openPlans();
      return;
    }
    Loader.show();
    try {
      await Becca.updateShop({
        helloBar: marshall(values || {}),
      });
      refreshShop();
      SnackBar.show('Hello Bar saved successfully', 'success');
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const Component = isDesktop ? 'div' : Drawer;

  const props = isDesktop ? { className: styles.containerD } : {
    title: 'Hello Bar'
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Component {...props}>
      {isDesktop && (
        <div onClick={() => history.goBack()} className={styles.maintitle}>
          <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          Hello Bar
        </div>
      )}
      <Formik initialValues={getInitialValues(shop?.helloBar)} validationSchema={schema} onSubmit={save}>
        {({ submitForm }) => (
          <>
            <div className={styles.preview}>
              <ShopPreview
                classes={{
                  container: styles.previewShop,
                  iframe: styles.previewShop
                }}
                name={`${shop.slug}`}
                from="announcements"
                text="&nbsp;"
              />
            </div>
            <div className={styles.margin}>
              <div className="flexCenter">
                <div className={styles.tabs}>
                  {TABS.map(t => (
                    <Clickable
                      onClick={() => setTab(t.value)}
                      className={cx(styles.tabContainer, { [styles.active]: t.value === tab })}
                    >
                      <div className={styles.tab}>
                        {t.label}
                      </div>
                    </Clickable>
                  ))}
                </div>
              </div>
              {tab === 'details' && (<Details />)}
              {tab === 'actionButton' && (<ActionButton />)}
              {tab === 'visibility' && (<Visibility />)}
            </div>
            <div className={styles.kbc}>
              <Kbc type="helloBar" />
            </div>
            {isDesktop ? (
              <div className={styles.btnDesk}>
                <div>
                  <Button
                    onClick={submitForm}
                    bordered={true}
                    className={styles.dBtn}
                    label="save"
                    size="large"
                  />
                </div>
              </div>
            ) : (
              <FooterButton>
                <Button
                  onClick={submitForm}
                  fullWidth
                  bordered={false}
                  label="save"
                  size="large"
                />
              </FooterButton>
            )}
          </>
        )}
      </Formik>
    </Component>
  );
}

HelloBar.propTypes = {};

HelloBar.defaultProps = {};
