import React from 'react';
import { Typography } from '@material-ui/core';
import starlogo from 'assets/logos/starslogo.svg';
import PropTypes from 'prop-types';
import { Clickable } from 'phoenix-components';
import styles from './ReviewProductAndroid.module.css';

function ReviewSubmitted({ onClose }) {
  return (
    <div className={styles.container1}>
      <div>
        <Typography className={styles.l1}>
          Thanks for
        </Typography>
        <Typography className={styles.l2}>submitting a review!!</Typography>
      </div>
      <div>
        <img src={starlogo} alt="" className={styles.starlogo} />
      </div>
      <Clickable onClick={onClose} className={styles.undo}>
        Close
      </Clickable>
    </div>
  );
}

ReviewSubmitted.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ReviewSubmitted;
