import React from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import starlogo from 'assets/logos/starslogo.svg';
import { Clickable } from 'phoenix-components';
import styles from './ReviewProductIos.module.css';

function ReviewSuccessIos({ closeDialog }) {
  return (
    <div className={styles.container1}>
      <div className="textCenter">
        <Typography>
          Thanks for
        </Typography>
        <Typography>submitting a review!!</Typography>
        <div>
          <img src={starlogo} alt="" className={styles.starlogoIos} />
        </div>
        <Clickable
          className={styles.undoIos}
          onClick={closeDialog}
        >
          Ok
        </Clickable>
      </div>
    </div>
  );
}

ReviewSuccessIos.propTypes = {
  closeDialog: PropTypes.func.isRequired
};

export default ReviewSuccessIos;
