import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogContent, LinearProgress, CircularProgress
} from '@material-ui/core';
import styles from './UploadProgress.module.css';

export function UploadProgress({ progress, text, type }) {
  const isCircular = type === 'circular';
  return (
    <Dialog open={true} fullWidth disableBackdropClick={true} disableEscapeKeyDown={true}>
      <DialogContent>
        {isCircular ? (
          <div className={styles.circular}>
            <CircularProgress />
          </div>
        ) : (
          <LinearProgress value={progress} variant="determinate" />
        )}
        <div className={styles.container}>{text}</div>
      </DialogContent>
    </Dialog>
  );
}

UploadProgress.propTypes = {
  progress: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

UploadProgress.defaultProps = {};
