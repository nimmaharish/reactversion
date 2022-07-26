import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogContent, FormControl, FormControlLabel, Radio
} from '@material-ui/core';
import ButtonComponent from 'containers/profile/ButtonComponent';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import { Nikon } from 'api';
import cx from 'classnames';
import instagramUnlinkIcon from 'assets/overview/instagramUnlink.svg';
import checkedIcon from 'assets/overview/checkedIcon.svg';
import styles from './UnlinkInstagram.module.css';

export function UnlinkInstagram({
  onClose,
  onSubmit
}) {
  const [selected, setSelected] = useState('unlink');
  const [openUnlink, toggleUnlink] = useState(null);

  const onUnlink = (del) => async () => {
    try {
      Loader.show();
      await Nikon.unlinkInstagram(del);
      if (del) {
        toggleUnlink('delete');
      } else {
        toggleUnlink('unlink');
      }
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const onSubmitClose = () => {
    toggleUnlink(null);
    onSubmit();
  };

  if (openUnlink) {
    return (
      <Dialog open={true} fullWidth>
        <DialogContent className={styles.unlinkContent}>
          <div className={styles.unlinkIcon}>
            <img src={openUnlink === 'unlink' ? instagramUnlinkIcon : checkedIcon} alt="" />
          </div>
          <br />
          {openUnlink === 'unlink' && (
            <div className={styles.unlinkSuccessText}>
              You’ve successfully unlinked your instagram account.
            </div>
          )}
          {openUnlink === 'delete' && (
            <div className={styles.unlinkSuccessText}>
              Your instagram account is unlinked and all your posts will be deleted automatically, shortly.
            </div>
          )}
          <div className={styles.buttonContainer}>
            <ButtonComponent
              style={styles.okButton}
              onclick={onSubmitClose}
              text="OK"
              fullwidth={false}
            />
          </div>

        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} fullWidth onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.radios}>
          <FormControl className={styles.form}>
            <FormControlLabel
              className={cx(styles.radioLabel, { [styles.active]: selected === 'unlink' })}
              control={(
                <Radio
                  className={styles.radio}
                  checked={selected === 'unlink'}
                  color="primary"
                  onChange={() => setSelected('unlink')}
                />
              )}
              label="Unlink but keep Posts"
            />
          </FormControl>
          <FormControl>
            <FormControlLabel
              control={(
                <Radio
                  checked={selected === 'delete'}
                  color="primary"
                  onChange={() => setSelected('delete')}
                  control={<radioLabel color="primary" />}
                />
              )}
              className={cx(styles.radioLabel, { [styles.active]: selected === 'delete' })}
              label="Unlink & Delete Posts"
            />
          </FormControl>
        </div>
        <div className={styles.unlinkText}>
          {selected === 'unlink'
            ? 'Are you sure you want to unlink your instagram account from WINDO?'
            : 'Are you sure you want to unlink your instagram account and delete all your posts from WINDO?'}
        </div>
        <div className={styles.unlinkButtons}>
          <ButtonComponent
            style={styles.unlinkButton}
            onclick={onClose}
            text="Cancel"
            variant="outlined"
            fullwidth={true}
          />
          <ButtonComponent
            style={styles.unlinkButton}
            onclick={onUnlink(selected === 'delete')}
            text="delete"
            fullwidth={true}
          />
        </div>
      </div>
    </Dialog>
  );
}

UnlinkInstagram.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

UnlinkInstagram.defaultProps = {};
