import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {
  Drawer,
} from '@material-ui/core';
import moment from 'moment';
import styles from './Stepper.module.css';

function Stepper({ tracks, onClose, open }) {
  return (
    <Drawer
      PaperProps={{
        classes: {
          root: cx(styles.paper),
        }
      }}
      anchor="bottom"
      open={open}
      onClose={onClose}
    >
      <div className={styles.width80}>
        <div className={styles.state}> Order Timeline </div>
        {tracks.map((h, i) => (
          <>
            <div className={cx(styles.tile, i === tracks.length - 1 ? '' : styles.addBorder)}>
              <div className={cx(styles.remark, 'bold')}>{h.status}</div>
              <div className={styles.remark}>
                <span>
                  {moment(h.at).format('LLL')}
                </span>
              </div>
              <div className={styles.ball}>
              </div>
            </div>
          </>
        ))}
      </div>
    </Drawer>
  );
}

Stepper.propTypes = {
  tracks: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default Stepper;
