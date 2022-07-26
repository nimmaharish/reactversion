import React from 'react';
import PropTypes from 'prop-types';
import { DialogContent, Drawer as MuiDrawer } from '@material-ui/core';
import cx from 'classnames';
import chevronLeftDesk from 'assets/desktop/backArrow.svg';
import { Clickable, Button } from 'phoenix-components';
import backIcon from 'assets/v2/common/closePrimary.svg';
import styles from './SideDrawer.module.css';

export function SideDrawer({
  title,
  children,
  onClose,
  classes,
  backButton,
  button,
  onClick,
  closeButton,
  btnLabel,
  buttonSize,
  disabled,
  ...other
}) {
  return (
    <MuiDrawer
      anchor="right"
      open={true}
      PaperProps={{
        classes: {
          root: styles.paper,
        }
      }}
      onClose={onClose}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      <DialogContent className={cx(styles.overflow, classes.container)}>
        {(title || closeButton) && (
          <div className={styles.row}>
            {backButton && (
              <Clickable onClick={onClose}>
                <img className={styles.backIcon} src={chevronLeftDesk} alt="" />
              </Clickable>
            )}
            {backButton && <div>&nbsp;</div>}
            {title ? <div className={cx(styles.heading, classes.heading)}>{title}</div> : (
              <div className="spacer">&nbsp;</div>
            )}
            {closeButton && (
              <Clickable onClick={onClose}>
                <img className={styles.closeIcon} src={backIcon} alt="" />
              </Clickable>
            )}
            {closeButton && <div>&nbsp;</div>}
          </div>
        )}
        <div className={cx(styles.container, classes.container)}>
          {children}
        </div>
        {button && (
          <div className={styles.button}>
            <Button
              label={btnLabel}
              onClick={onClick}
              primary
              size={buttonSize}
              disabled={disabled}
            />
          </div>
        )}
      </DialogContent>
    </MuiDrawer>
  );
}

SideDrawer.propTypes = {
  title: PropTypes.string,
  btnLabel: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node.isRequired,
    PropTypes.arrayOf(PropTypes.node).isRequired
  ]).isRequired,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  classes: PropTypes.object,
  closeButton: PropTypes.bool,
  button: PropTypes.bool,
  backButton: PropTypes.bool,
  buttonSize: PropTypes.string,
  disabled: PropTypes.bool,
};

SideDrawer.defaultProps = {
  title: null,
  onClose: null,
  classes: {},
  button: false,
  btnLabel: 'Save',
  buttonSize: 'large',
  onClick: () => {
  },
  backButton: false,
  closeButton: false,
  disabled: false,
};
