import React from 'react';
import PropTypes from 'prop-types';
import { DialogContent, Drawer as MuiDrawer } from '@material-ui/core';
import cx from 'classnames';
import { Clickable } from 'phoenix-components';
import backIcon from 'assets/v2/common/chevronBlackLeft.svg';
import styles from './BottomDrawer.module.css';

export function BottomDrawer({
  title,
  children,
  onClose,
  classes,
  closeButton,
  ...other
}) {
  return (
    <MuiDrawer
      anchor="bottom"
      open={true}
      PaperProps={{
        classes: {
          root: classes.paper ? classes.paper : styles.paper,
        }
      }}
      onClose={onClose}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      <DialogContent className={cx(styles.overflow, classes.container)}>
        {(title || closeButton) && (
          <div className={styles.row}>
            {closeButton && (
              <Clickable onClick={onClose}>
                <img className={styles.closeIcon} src={backIcon} alt="" />
              </Clickable>
            )}
            {title ? <div className={cx(styles.heading, classes.heading)}>{title}</div> : (
              <div className="spacer">&nbsp;</div>
            )}
            {closeButton && <div>&nbsp;</div>}
          </div>
        )}
        <div className={cx(styles.container, classes.container)}>
          {children}
        </div>
      </DialogContent>
    </MuiDrawer>
  );
}

BottomDrawer.propTypes = {
  title: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node.isRequired,
    PropTypes.arrayOf(PropTypes.node).isRequired
  ]).isRequired,
  onClose: PropTypes.func,
  classes: PropTypes.object,
  closeButton: PropTypes.bool,
};

BottomDrawer.defaultProps = {
  title: null,
  onClose: null,
  classes: {},
  closeButton: false,
};
