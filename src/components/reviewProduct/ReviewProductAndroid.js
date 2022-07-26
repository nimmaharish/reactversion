import React, { useState } from 'react';
import {
  Button, Drawer, TextField
} from '@material-ui/core';
import PropTypes from 'prop-types';
import cx from 'classnames';
import windologo from 'assets/v2/logoFilled.svg';
import Rating from '@material-ui/lab/Rating';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { useToggle } from 'hooks/common';
import WebView from 'services/webview';
import { Becca } from 'api';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import ReviewHeader from './ReviewHeader';
import styles from './ReviewProductAndroid.module.css';
import ReviewSubmitted from './ReviewSubmitted';

function ReviewProductAndroid({ onClose }) {
  const [userRated, toggleUserRated] = useToggle();
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [textCount, setTextCount] = useState(0);
  const [reviewSubmit, toggleReviewSubmit] = useToggle();

  const handleRating = (e) => {
    const rating = +e.target.value;
    if (rating > 3) {
      WebView.askRating('store');
      Becca.rateShop({
        rated: true,
        rating,
        review: reviewText,
        platform: 'android',
      });
      onClose();
      return;
    }
    toggleUserRated();
    setRatingValue(rating);
  };

  const onSubmit = async () => {
    try {
      Loader.show();
      await Becca.rateShop({
        rated: true,
        rating: ratingValue,
        review: reviewText,
        platform: 'android',
      });
    } catch (error) {
      SnackBar.showError(error);
      return;
    } finally {
      Loader.hide();
    }
    toggleReviewSubmit();
  };

  const handleTextField = (e) => {
    setReviewText(e.target.value);
    setTextCount(e.target.value.length);
  };

  return (
    <Drawer
      anchor="bottom"
      open={true}
      onClose={onClose}
      classes={{ paper: styles.drawerPaper }}
    >
      {!reviewSubmit
        ? (
          <div className={styles.container}>
            <ReviewHeader />
            <div className={cx(styles.note, styles[userRated ? 'isSelected' : null])}>
              <div>
                <img src={windologo} alt="windologo" className={styles.windologo} />
              </div>
              <div>
                {!userRated
                  ? (
                    <div className={styles.note1}>
                      <div className={styles.windotext}>Windo</div>
                      <div className={styles.notetext}>
                        Your review is public and includes your Google profile name and photo
                      </div>
                    </div>
                  ) : (
                    <div className={styles.afterRated}>
                      <Rating
                        name="review"
                        value={ratingValue}
                        size="large"
                        emptyIcon={(
                          <StarBorderIcon
                            fontSize="inherit"
                          />
                        )}
                        classes={{
                          iconFilled: styles.cusmStars1,
                          iconEmpty: styles.cusmStars2
                        }}
                      />
                    </div>
                  )}
              </div>
              {userRated && (<div>&nbsp;</div>)}
            </div>
            {!userRated ? (
              <div className={styles.stars}>
                <Rating
                  name="review"
                  size="large"
                  value={ratingValue}
                  onChange={handleRating}
                  emptyIcon={(
                    <StarBorderIcon
                      fontSize="inherit"
                    />
                  )}
                  classes={{
                    icon: styles.cusmStars
                  }}
                />
              </div>
            ) : null}
            {!userRated
              ? (
                <div className={styles.buttons}>
                  <Button
                    variant="outlined"
                    className={styles.notnowButton}
                    onClick={onClose}>
                    Not Now
                  </Button>
                  <Button
                    variant="contained"
                    className={styles.disableSubmitButton}
                    disabled>
                    Submit
                  </Button>
                </div>
              ) : (
                <div>
                  <div className={styles.reviewText}>
                    <TextField
                      variant="outlined"
                      value={reviewText}
                      multiline
                      label="Write a review "
                      placeholder="(optional)"
                      size="small"
                      onChange={handleTextField}
                      fullWidth
                    />
                    <div className={styles.conditions}>
                      <div className={styles.optionalText}>Optional</div>
                      <div className={styles.textCount}>
                        {textCount}
                        /500
                      </div>
                    </div>
                  </div>
                  <div className={styles.buttons}>
                    <Button
                      variant="outlined"
                      className={styles.cancelButton}
                      onClick={onClose}>
                      cancel
                    </Button>
                    <Button
                      variant="contained"
                      className={styles.activeSubmitButton}
                      onClick={onSubmit}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              )}
          </div>
        ) : <ReviewSubmitted onClose={onClose} />}
    </Drawer>
  );
}

ReviewProductAndroid.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ReviewProductAndroid;
/*   */
