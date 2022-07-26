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
import {
  Switch
} from 'phoenix-components';
import {
  useRefreshShop,
} from 'contexts/userContext';
import PencilIcon from 'assets/images/address/edit.svg';
import { useDesktop } from 'contexts';
import { SideDrawer } from 'components/shared/SideDrawer';
import { usePartner } from './hooks.js';
import styles from './Partner.module.css';
import { KnowMoreDialog } from './KnowMoreDialog';
import {
  getInitialValues,
  schema,
  isEmptyPartner,
  replaceString,
  steps,
  heading,
  title,
  drawerTitle,
  url
} from './utils';

function Partner({ name, partners }) {
  const history = useHistory();
  const location = useLocation();
  const [openForm, toggleForm] = useToggle(false);
  const refreshShop = useRefreshShop();
  const isDesktop = useDesktop();
  const [partnerData] = usePartner(name);
  const isCashFree = name === 'cashfree';

  const onUnlive = async () => {
    try {
      Loader.show();
      const value = partners.find(x => x.name === name)?.enabled;
      await Becca.toggleAccount(name, { enabled: !value });
      SnackBar.show('Partner updated successfully', 'success');
      if (location?.state?.redirectTo) {
        history.push(location.state.redirectTo);
        return;
      }
      refreshShop();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const onSubmit = async (values) => {
    try {
      Loader.show();
      if (!isEmptyPartner(name, partners)) {
        // eslint-disable-next-line no-debugger
        await Becca.updateAccount(name, values);
        SnackBar.show('Partner updated successfully', 'success');
        refreshShop();
        toggleForm();
        return;
      }
      await Becca.addAccount(name, values);
      SnackBar.show('Partner added successfully', 'success');
      refreshShop();
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
      await Becca.deleteAccount(name);
      SnackBar.show('Partner disconnected successfully', 'success');
      refreshShop();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const getInitial = () => {
    const val = getInitialValues({ ...partnerData, name });
    return val;
  };

  const isEnabled = partners.find(x => x.name === name)?.enabled;

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
          onAction={() => {
            toggleForm();
          }}
          list={steps[name]}
          heading={heading[name]}
          url={url[name]}
          description={`To integrate ${name} into your windo account, please follow these steps`}
          title={title[name]}
          onBack={() => history.goBack()}
          name={name}
        />
      )}
      {!isEmptyPartner(name, partners) && (
        <div className={styles.partner}>
          <div className={styles.status}>
            <div className={styles.account}> Account Status </div>
            <div className={styles.switch}>
              <div className={isEnabled ? styles.alive : styles.na}>{isEnabled ? 'Live' : 'Unlive'}</div>
              <Switch active={partners.find(x => x.name === name)?.enabled} onChange={onUnlive} />
            </div>
          </div>
          <div className={styles.details}>
            <div className="fullWidth flexBetween">
              <div className={styles.account}> Account Details </div>
              <Clickable onClick={toggleForm}>
                <img src={PencilIcon} alt="" />
              </Clickable>
            </div>
            <div className="fullWidth">
              <div className={styles.key}> key id </div>
              <div className={styles.value}>
                {' '}
                {replaceString(partnerData?.config?.keyId)}
                {' '}
              </div>
            </div>
            <div className="fullWidth">
              <div className={styles.key}> key secret </div>
              <div className={styles.value}>
                {' '}
                {replaceString(partnerData?.config?.keySecret)}
                {' '}
              </div>
            </div>
          </div>
          {!isDesktop && (
            <div className={styles.button}>
              <Button
                label="Disconnect"
                size="large"
                bordered={false}
                fullWidth
                onClick={onDisconnect}
              >
              </Button>
            </div>
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
                  <div className={styles.input}>
                    <FormikInput
                      label={!isCashFree ? 'Enter Key ID' : 'Enter App ID'}
                      placeholder="e.g. XYZ1234"
                      name="keyId"
                    />
                  </div>
                  <div className={styles.input}>
                    <FormikInput
                      label="Enter Key Secret"
                      placeholder="e.g. XYZ1234"
                      name="keySecret"
                    />
                  </div>
                  <div className={styles.button}>
                    <Button
                      fullWidth
                      bordered={false}
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
        </Drawer>
      )}
      {openForm && isDesktop && (
        <>
          <Formik
            validationSchema={schema}
            initialValues={getInitial()}
            onSubmit={onSubmit}
          >
            {({ submitForm, values }) => (
              <div className={styles.container}>
                <SideDrawer
                  backButton={true}
                  onClick={() => {
                    if (isEmptyPartner(name, partners)) {
                      submitForm(values, name);
                      return;
                    }
                    sideDrawerAction();
                  }}
                  onClose={toggleForm}
                  title={drawerTitle[name]}
                >
                  <div className={styles.main}>
                    <div className={styles.input}>
                      <FormikInput
                        label="Enter Key ID"
                        placeholder="e.g. XYZ1234"
                        name="keyId"
                      />
                    </div>
                    <div className={styles.input}>
                      <FormikInput
                        label="Enter Key Secret"
                        placeholder="e.g. XYZ1234"
                        name="keySecret"
                      />
                    </div>
                    <div className={styles.buttonD}>
                      <Button
                        label="Connect"
                        size="large"
                        className={styles.buttonI}
                        onClick={() => submitForm(values, name)}
                      >
                      </Button>
                    </div>
                  </div>
                </SideDrawer>
              </div>
            )}
          </Formik>
        </>
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
      button={!isEmptyPartner(name, partners)}
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
