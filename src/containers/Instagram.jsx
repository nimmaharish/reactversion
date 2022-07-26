import React, { useEffect, useState } from 'react';
import { Loading } from 'components/shared/Loading';
import Loader from 'services/loader';
import EventManager from 'utils/events';
import { Nikon } from 'api';
import SnackBar from 'services/snackbar';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import { Dialog, DialogContent } from '@material-ui/core';
import instagramLinkIcon from 'assets/overview/instagramLink.svg';
import { Button } from 'phoenix-components';
import styles from './Instagram.module.css';

function Instagram() {
  const history = useHistory();
  const [openPopup, setOpenPopup] = useState(false);
  const params = useQueryParams();

  const syncCode = async code => {
    try {
      Loader.show();
      EventManager.emitEvent('instagram_account_synced');
      await Nikon.syncInstagramProfile(code, `${document.location.protocol}//${document.location.host}/instagram`);
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

  const closeSyncPopup = () => {
    setOpenPopup(false);
    history.replace('/overview');
  };

  if (openPopup) {
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

  return (
    <Loading />
  );
}

Instagram.propTypes = {};

Instagram.defaultProps = {};

export default Instagram;
