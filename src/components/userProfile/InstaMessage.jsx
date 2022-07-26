import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent } from '@material-ui/core';
import { Button } from 'phoenix-components';
import instagramLinkIcon from 'assets/overview/instagramLink.svg';
import styles from './InstaMessage.module.css';

export function InstaMessage({
  closeSyncPopup
}) {
  return (
    <Dialog open={true} fullWidth onClose={closeSyncPopup}>
      <DialogContent className={styles.gridContent}>
        <div className={styles.syncIcon}>
          <img src={instagramLinkIcon} alt="" />
        </div>
        <div className={styles.instaSyncHeading}>
          Yay! Your Instagram is successfully linked to your WINDO shop.
        </div>
        <div className={styles.instaSyncSubHeading}>
          We'll notify you once your posts are imported.
        </div>
        <div className={styles.instaSyncBody}>
          You can then convert your posts as products instantly.
          This might take upto 5 min to complete the import
        </div>
        <div className="flexCenter">
          <Button
            className={styles.okButton}
            onClick={closeSyncPopup}
            label="OK"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

InstaMessage.propTypes = {
  closeSyncPopup: PropTypes.func.isRequired,
};
