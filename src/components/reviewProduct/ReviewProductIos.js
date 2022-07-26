import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Rating from '@material-ui/lab/Rating';
import PropTypes from 'prop-types';
import windologo from 'assets/v2/logoFilled.svg';
import { useToggle } from 'hooks/common';
import cx from 'classnames';
import { Clickable } from 'phoenix-components';
import WebView from 'services/webview';
import { Becca } from 'api';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import styles from './ReviewProductIos.module.css';
import ReviewSuccessIos from './ReviewSuccessIos';

function ReviewProductIos({ onClose }) {
  const [rating, setRating] = useState(0);
  const [submit, toggleSubmit] = useToggle();

  const onSetRating = (e) => {
    const value = +e.target.value;
    setRating(value);
  };

  const onSubmit = async () => {
    if (rating === 0) {
      return;
    }
    if (rating > 3) {
      WebView.askRating('store');
      Becca.rateShop({
        rated: true,
        rating,
        platform: 'ios',
      });
      onClose();
      return;
    }
    try {
      Loader.show();
      await Becca.rateShop({
        rated: true,
        rating,
        platform: 'ios',
      });
    } catch (e) {
      SnackBar.showError(e);
      return;
    } finally {
      Loader.hide();
    }
    toggleSubmit();
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className={styles.dialog}
      classes={{ paper: styles.dialog1 }}
    >
      <div className={styles.container}>
        {!submit
          ? (
            <>
              <img src={windologo} alt="" className={styles.emojilogo} />
              <div className={styles.texts}>
                <div className={cx(styles.text, 'bold')}>Enjoying Windo?</div>
                <div className={styles.text}>Tap a star to rate  the</div>
                <div className={styles.text}>App.</div>
              </div>
              <div className={styles.rating}>
                <Rating
                  value={rating}
                  size="large"
                  onChange={onSetRating}
                  classes={{
                    iconFilled: styles.iosRating,
                    iconEmpty: styles.iosRating1
                  }}
                />
              </div>
              <div className={styles.buttons}>
                <div className={styles.cancelButton}>
                  <Clickable
                    className={styles.cancelText}
                    onClick={onClose}
                  >
                    Cancel
                  </Clickable>
                </div>
                <div className={styles.submitButton}>
                  <Clickable
                    className={styles.submitText}
                    onClick={onSubmit}
                  >
                    Submit
                  </Clickable>
                </div>
              </div>
            </>
          ) : <ReviewSuccessIos closeDialog={onClose} />}
      </div>
    </Dialog>
  );
}

ReviewProductIos.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default ReviewProductIos;
