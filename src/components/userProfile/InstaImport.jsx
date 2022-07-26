/* eslint-disable no-unreachable */
/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import importIcon from 'assets/images/insta.png';
import tipIcon from 'assets/images/tipIcon.svg';
import { Dialog, DialogContent } from '@material-ui/core';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { Nikon } from 'api';
import PropTypes from 'prop-types';
import WebView from 'services/webview';
import { useQueryParams } from 'hooks';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import { Button, Clickable } from 'phoenix-components';
// import closeIcon from 'assets/images/common/close.svg';
import { useToggle } from 'hooks/common';
import { UnlinkInstagram } from 'components/userProfile/UnlinkInstagram';
import {
  useIsInstantSyncEnabled
} from 'contexts/userContext';
import EventManager from 'utils/events';
import styles from './InstaImport.module.css';
import { InstaMessage } from './InstaMessage';

const getInstaUrl = () => {
  const url = new URL('https://api.instagram.com/oauth/authorize');
  url.searchParams.set('client_id', '1129552074233709');
  url.searchParams.set('redirect_uri', `${document.location.protocol}//${document.location.host}/instagram`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'user_profile,user_media');
  url.searchParams.set('force_authentication', '1');
  return url.toString();
};

export function InstaImport({
  onClose,
  profile,
  page,
  customButton,
}) {
  const [openPopup, setOpenPopup] = useState(false);
  const [account, setAccount] = useState(null);
  const [openUnlink, toggleUnlink] = useToggle(false);
  const history = useHistory();

  const params = useQueryParams();
  const enabled = profile?.importImages ?? true;
  const loginRequired = profile?.loginRequired ?? false;
  const posts = profile?.posts ?? 100;
  const isInstantSyncEnabled = useIsInstantSyncEnabled();

  const closeSyncPopup = () => {
    setOpenPopup(false);
    onClose();
    history.replace('/overview');
  };

  const syncCode = async code => {
    try {
      Loader.show();
      EventManager.emitEvent('instagram_account_synced');
      await Nikon.syncInstagramProfile(code, `${document.location.href}`);
      setOpenPopup(true);
    } catch (e) {
      SnackBar.showError(e);
      history.replace('/overview');
    } finally {
      Loader.hide();
    }
  };

  useEffect(() => {
    if (params.has('code')) {
      syncCode(params.get('code'));
    }
  }, [params.has('code')]);

  const importInstagram = async (e) => {
    e.stopPropagation();
    try {
      const acc = await Nikon.getInstagramAccount();
      if (!acc?.loginRequired) {
        setAccount(acc);
        return;
      }
      if (!WebView.isWebView()) {
        window.location.href = getInstaUrl();
        return;
      }
      Loader.show();
      const { code } = await WebView.instagramLogin();
      EventManager.emitEvent('instagram_account_synced');
      await Nikon.syncInstagramProfile(code, 'https://seller.windo.live/instagram');
      setOpenPopup(true);
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

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

  const onUnlinkSubmit = () => {
    setOpenPopup(false);
    setAccount(null);
    toggleUnlink();
    onClose();
  };

  if (openUnlink) {
    return (
      <UnlinkInstagram onSubmit={onUnlinkSubmit} onClose={toggleUnlink} />
    );
  }

  if (enabled && !loginRequired && page === 'overview') {
    return null;
  }

  return (
    <>
      {openPopup && <InstaMessage closeSyncPopup={closeSyncPopup} />}
      {(page === 'settings' || page === 'posts') && customButton ? (
        <div onClick={importInstagram} className={styles.shopSetting}>
          {customButton}
        </div>
      ) : (
        <>
          {posts === 0 && (
            <>
              {enabled ? (
                <div id="import" className={styles.button}>
                  <Clickable
                    className={styles.syncButton}
                    onClick={importInstagram}
                  >
                    <img src={importIcon} alt="" />
                    Import Instagram
                  </Clickable>
                </div>
              ) : (
                <div className={styles.disabledButton}>
                  Importing ...
                </div>
              )}
            </>
          )}
        </>
      )}
      {account !== null && (
        <Dialog
          open={true}
          fullWidth
          onClick={() => {
            setAccount(null);
          }}
        >
          <DialogContent>
            <div className={styles.contentGrid}>
              <div className={styles.gridLeft}>User Name :</div>
              <div className={styles.gridRight}>{account.userName || ''}</div>
            </div>
            <div className={styles.contentGrid}>
              <div className={styles.gridLeft}>Posts Imported :</div>
              <div className={styles.gridRight}>{account.posts || 0}</div>
            </div>
            {account.lastSync && (
              <>
                <div className={styles.contentGrid}>
                  <div className={styles.gridLeft}>Last Sync</div>
                  <div className={styles.lastSync}>
                    {moment(account.lastSync)
                      .format('lll')}
                  </div>
                </div>
              </>
            )}

            <div className={styles.instaSyncTip}>
              <img src={tipIcon} alt="" />
              <div className={styles.tipText}> Pro Tip</div>
            </div>
            <div className={styles.instaTipBody}>
              Your instagram account is synced once everyday. It automatically imports new posts once in a day
            </div>
            <div className={styles.buttonContainer}>
              <Button
                onClick={syncNow}
                label="Sync Now"
              />
            </div>
            <div className={styles.unlinkButtonText}>
              Do you want to unlink your Instagram account?
              <Clickable onClick={toggleUnlink} style={{ color: 'var(--primary)' }}> Unlink</Clickable>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

InstaImport.propTypes = {
  onClose: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  page: PropTypes.string.isRequired,
  customButton: PropTypes.any,
};

InstaImport.defaultProps = {
  customButton: null,
};
