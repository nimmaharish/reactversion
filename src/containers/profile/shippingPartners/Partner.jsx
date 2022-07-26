import React from 'react';
import { Drawer } from 'components/shared/Drawer';
import { Formik } from 'formik';
import { Becca } from 'api';
import PropTypes from 'prop-types';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import { useHistory, useLocation } from 'react-router-dom';
import { useToggle } from 'hooks/common';
import { FormikInput, Button, Clickable } from 'phoenix-components';
import { FooterButton } from 'components/common/FooterButton';
import {
  Switch
} from 'phoenix-components';
import closeIcon from 'assets/images/orders/list/close.svg';
import PencilIcon from 'assets/images/address/edit.svg';
import { usePartnersRefresh } from 'contexts';
import { useDesktop } from 'contexts';
import cx from 'classnames';
import { Dialog } from '@material-ui/core';
import EventManager from 'utils/events';
import { SideDrawer } from 'components/shared/SideDrawer';
import styles from './Partner.module.css';
import { KnowMoreDialog } from './KnowMoreDialog';
import { getInitialValues, schema, isEmptyPartner } from './utils';

function Partner({ name, partners }) {
  const history = useHistory();
  const location = useLocation();
  const [openForm, toggleForm] = useToggle(false);
  const refresh = usePartnersRefresh();
  const isDesktop = useDesktop();

  const onUnlive = async () => {
    try {
      Loader.show();
      await Becca.updateShippingPartner(name, { enabled: !partners[name].enabled });
      SnackBar.show('Partner updated successfully', 'success');
      if (location?.state?.redirectTo) {
        history.push(location.state.redirectTo);
        return;
      }
      refresh();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const onSubmit = async (values) => {
    try {
      Loader.show();
      await Becca.createShippingPartner(name, values);
      EventManager.emitEvent('shipping_partner_enabled', {
        name,
      });
      SnackBar.show('Partner added successfully', 'success');
      refresh();
      toggleForm();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const onDisconnect = async () => {
    try {
      Loader.show();
      await Becca.deleteShippingPartner(name);
      EventManager.emitEvent('shipping_partner_disabled', {
        name,
      });
      SnackBar.show('Partner disconnected successfully', 'success');
      refresh();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const getInitial = () => {
    const val = getInitialValues({ ...partners, name });
    return val;
  };

  const list = {
    shiprocket: [
      'Go to settings in shiprocket dashboard',
      'Go to configure under API',
      'Create API user',
      'Enter email and password used for creating API user in shiprocket',
    ],
    goshippo: [
      'Go to settings in shippo dashboard',
      'Go to API',
      'Click on generate token under live token',
      'Enter shippo token that you generated',
    ],
    pickrr: [
      'Contact Pickrr team to get Pickrr Token',
      'Enter Pickrr Token',
    ],
  };

  const isEnabled = partners[name]?.enabled;

  const showEmailConfig = name === 'shiprocket';

  const heading = {
    shiprocket: 'How to Integrate Shiprocket',
    pickrr: 'How to Integrate Pickrr',
    goshippo: 'How to Integrate Shippo'
  };

  const title = {
    shiprocket: 'Shiprocket',
    pickrr: 'Pickrr',
    goshippo: 'Shippo'
  };

  const drawerTitle = {
    shiprocket: 'Shiprocket Details',
    pickrr: 'Pickrr Details',
    goshippo: 'Shippo Details'
  };

  const url = {
    shiprocket: 'https://www.shiprocket.in/',
    pickrr: 'http://www.pickrr.com/',
    goshippo: 'https://goshippo.com/'
  };

  const onClose = () => history.goBack();

  const sideDrawerAction = () => {
    if (isEmptyPartner(name, partners)) {
      toggleForm();
    } else {
      onDisconnect();
    }
  };

  const body = () => (
    <div className={styles.mainContainer}>
      {isEmptyPartner(name, partners) && (
        <KnowMoreDialog
          onAction={toggleForm}
          list={list[name]}
          heading={heading[name]}
          url={url[name]}
          description={`To integrate third-party shipping partners into your windo account,
            please follow these steps`}
          title={title[name]}
          onBack={() => history.goBack()}
        />
      )}
      {!isEmptyPartner(name, partners) && (
        <div className={styles.partner}>
          <div className={styles.status}>
            <div className={styles.account}> Account Status </div>
            <div className={styles.switch}>
              <div className={isEnabled ? styles.alive : styles.na}>{isEnabled ? 'Live' : 'Unlive'}</div>
              <Switch active={partners[name].enabled} onChange={onUnlive} />
            </div>
          </div>
          <div className={styles.details}>
            <div className="fullWidth flexBetween">
              <div className={styles.account}> Account Details </div>
              <Clickable onClick={toggleForm}>
                <img src={PencilIcon} alt="" />
              </Clickable>
            </div>
            {showEmailConfig ? (
              <>
                <div className="fullWidth">
                  <div className={styles.key}> Email </div>
                  <div className={styles.value}>
                    {' '}
                    {partners[name].config.email}
                    {' '}
                  </div>
                </div>
                <div className="fullWidth">
                  <div className={styles.key}> Password </div>
                  <div className={styles.value}>
                    {' '}
                    {partners[name].config.password}
                    {' '}
                  </div>
                </div>
              </>
            ) : (
              <div className="fullWidth">
                <div className={styles.key}> Token </div>
                <div className={styles.value}>
                  {' '}
                  {partners[name].config.token}
                  {' '}
                </div>
              </div>
            )}
          </div>
          {!isDesktop && (
            <FooterButton>
              <Button
                fullWidth
                bordered={false}
                label="Disconnect"
                size="large"
                onClick={onDisconnect}
              >
              </Button>
            </FooterButton>
          )}
        </div>
      )}
      {openForm && !isDesktop && (
        <Drawer
          onClose={toggleForm}
          closeButton
          title={drawerTitle[name]}
        >
          <Formik
            validationSchema={schema}
            initialValues={getInitial()}
            onSubmit={onSubmit}
          >
            {({ submitForm, values }) => (
              <div className={styles.container}>
                <div className={styles.main}>
                  {showEmailConfig && (
                    <>
                      <div className={styles.input}>
                        <FormikInput
                          label="Enter Email"
                          placeholder="e.g. XYZ1234"
                          name="config.email"
                        />
                      </div>
                      <div className={styles.input}>
                        <FormikInput
                          label="Enter Password"
                          placeholder="e.g. XYZ1234"
                          name="config.password"
                        />
                      </div>
                    </>
                  )}
                  {!showEmailConfig && (
                    <>
                      <div className={styles.input}>
                        <FormikInput
                          label="Enter Token"
                          placeholder="e.g. XYZ1234"
                          name="config.token"
                        />
                      </div>
                    </>
                  )}
                  <FooterButton>
                    <Button
                      fullWidth
                      bordered={false}
                      label="Connect"
                      size="large"
                      onClick={() => submitForm(values, name)}
                    >
                    </Button>
                  </FooterButton>
                </div>
              </div>
            )}
          </Formik>
        </Drawer>
      )}
      {openForm && isDesktop && (
        <Dialog
          maxWidth="sm"
          open={openForm}
          onClose={toggleForm}
          fullWidth
        >
          <div className={cx('flexEnd', styles.padding)}>
            <Clickable
              onClick={toggleForm}>
              <img src={closeIcon} alt="" />
            </Clickable>
          </div>
          <div className={styles.title}>{drawerTitle[name]}</div>
          <Formik
            validationSchema={schema}
            initialValues={getInitial()}
            onSubmit={onSubmit}
          >
            {({ submitForm, values }) => (
              <div className={styles.container}>
                <div className={styles.main}>
                  {showEmailConfig && (
                    <>
                      <div className={styles.input}>
                        <FormikInput
                          label="Enter Email"
                          placeholder="e.g. XYZ1234"
                          name="config.email"
                        />
                      </div>
                      <div className={styles.input}>
                        <FormikInput
                          label="Enter Password"
                          placeholder="e.g. XYZ1234"
                          name="config.password"
                        />
                      </div>
                    </>
                  )}
                  {!showEmailConfig && (
                    <>
                      <div className={styles.input}>
                        <FormikInput
                          label="Enter Token"
                          placeholder="e.g. XYZ1234"
                          name="config.token"
                        />
                      </div>
                    </>
                  )}
                  <div className={styles.buttonD}>
                    <Button
                      label="Connect"
                      size="large"
                      onClick={() => submitForm(values, name)}
                    >
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Formik>
        </Dialog>
      )}
    </div>
  );

  return !isDesktop ? (
    <Drawer title={title[name]}>
      {body()}
    </Drawer>
  ) : (
    <SideDrawer
      backButton={true}
      onClick={sideDrawerAction}
      onClose={onClose}
      button={true}
      btnLabel={isEmptyPartner(name, partners) ? 'Connect' : 'Disconnect'}
      title={title[name]}
    >
      {body()}
    </SideDrawer>
  );
}

Partner.propTypes = {
  name: PropTypes.string.isRequired,
  partners: PropTypes.object.isRequired,
};

export default Partner;
