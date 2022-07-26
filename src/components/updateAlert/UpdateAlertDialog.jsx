import React from 'react';
import { Dialog, DialogContent } from '@material-ui/core';
import logo from 'assets/images/windo.svg';
import ButtonComponent from 'containers/profile/ButtonComponent';
import PropTypes from 'prop-types';
import WebView from 'services/webview';
import { updateWebApp } from 'utils/app';
import { useDesktop } from 'contexts';
import styles from './UpdateAlertDialog.module.css';

export function UpdateAlertDialog({ onClose, type }) {
  const isDesktop = useDesktop();

  const onUpdate = async () => {
    if (type === 'web') {
      await updateWebApp();
      return;
    }
    try {
      await WebView.doUpdate();
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('coachmarks');
      onClose();
    }
  };

  return (
    <Dialog
      open={false}
      maxWidth="md"
      fullWidth
      onClose={onClose}
      disableBackdropClick={true}
      disableEscapeKeyDown={true}
    >
      <DialogContent>
        <div className={styles.heading}>New version available</div>
        <div className={styles.middle}>
          <div className={styles.logoContainer}>
            <img
              role="none"
              src={logo}
              className={styles.logo}
              alt=""
            />
          </div>
          {type === 'web' ? (
            <>
              {isDesktop ? (
                <div className={styles.text}>
                  Your WINDO web version has been updated, please click on REFRESH to update to the latest version.
                </div>
              ) : (
                <div className={styles.text}>
                  Your WINDO app version has been updated, please click on UPDATE to update to the latest version.
                </div>
              )}
            </>
          ) : (
            <div className={styles.text}>
              Please update your WINDO app to the latest version to get the new features,
              now! Click on UPDATE button below.
            </div>
          )}

        </div>
        <div className={styles.buttonContainer}>
          {isDesktop ? (
            <ButtonComponent
              style={styles.button}
              onclick={onUpdate}
              text="Refresh"
            />
          ) : (
            <ButtonComponent
              style={styles.button}
              onclick={onUpdate}
              text="Update"
            />
          )}

        </div>
      </DialogContent>
    </Dialog>
  );
}

UpdateAlertDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  type: PropTypes.string,
};

UpdateAlertDialog.defaultProps = {
  type: 'web',
};
