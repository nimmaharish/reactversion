import React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik } from 'formik';

import { SideDrawer } from 'components/shared/SideDrawer';
import { Drawer } from 'components/shared/Drawer';
import { Loading } from 'components/shared/Loading';
import StatusSwitch from 'components/common/StatusSwitch';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';

import { useChatSettings } from 'hooks/common';

import { useDesktop } from 'contexts';

import { Becca } from 'api';

import { getInitialValues } from './utils';

import styles from './ChatSettings.module.css';

function ChatSettings() {
  const [chat, loading, refresh] = useChatSettings();
  const history = useHistory();
  const isDesktop = useDesktop();

  const Component = isDesktop ? SideDrawer : Drawer;

  const submitForm = async (values) => {
    try {
      Loader.show();
      await Becca.updateUiConfig('chat', values);
      refresh();
      SnackBar.show('chat settings updated successfully', 'success');
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Component
      title="Live Chat Settings"
      backButton
      onClose={() => history.goBack()}
    >
      <Formik
        initialValues={getInitialValues(chat)}
        onSubmit={submitForm}
      >
        <div className={styles.container}>
          <StatusSwitch
            name="enabled"
            title="Enable Live Chat for Logged-In User"
          />
          <StatusSwitch
            name="guestEnabled"
            title="Enable Live Chat for Guest User"
          />
        </div>
      </Formik>
    </Component>
  );
}

export default ChatSettings;
