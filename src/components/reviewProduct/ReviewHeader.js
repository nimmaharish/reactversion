import React from 'react';
import gplaylogo from 'assets/logos/googleplaylogo.svg';
import { Typography } from '@material-ui/core';
import styles from './ReviewProductAndroid.module.css';

function ReviewHeader() {
  return (
    <div className={styles.googleprofiledetails}>
      <img src={gplaylogo} alt="googleplaylogo" className={styles.googleplaylogo} />
      <Typography className={styles.googleplaytext}>Google Play</Typography>
    </div>
  );
}

export default ReviewHeader;
