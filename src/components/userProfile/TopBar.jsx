import React from 'react';
import { InstaImport } from 'components/userProfile/InstaImport';
import importIcon from 'assets/images/insta.png';
import settingIcon from 'assets/v2/posts/setting.svg';
import PropTypes from 'prop-types';
import { Clickable } from 'phoenix-components';
import Loader from 'services/loader';
import { Nikon } from 'api';
import {
  useIsInstantSyncEnabled
} from 'contexts/userContext';
import SnackBar from 'services/snackbar';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import styles from './TopBar.module.css';

export function TopBar({
  profile,
  refresh
}) {
  const isInstantSyncEnabled = useIsInstantSyncEnabled();
  const history = useHistory();
  const params = useQueryParams();

  const syncNow = async () => {
    if (!isInstantSyncEnabled) {
      params.set('openPlans', 'generic');
      history.push({
        search: params.toString(),
      });
      return;
    }
    Loader.show();
    try {
      await Nikon.syncInstagramNow();
      SnackBar.show('Your posts will be synced with in next few minutes', 'success');
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.topMiddle}>
          <div id="post" className={styles.buttonContainer}>
            <Clickable
              className={styles.syncButton}
              onClick={syncNow}
            >
              <img src={importIcon} alt="" />
              Sync Posts Now
            </Clickable>
            <InstaImport
              profile={profile}
              onClose={refresh}
              page="posts"
              customButton={(
                <div>
                  <img className={styles.settingIcon} src={settingIcon} alt="" />
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

TopBar.propTypes = {
  profile: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
};
