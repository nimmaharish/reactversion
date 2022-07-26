import React from 'react';
import PropTypes from 'prop-types';
import { Drawer as MuiDrawer } from '@material-ui/core';
import Back from 'assets/images/products/create/back.svg';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';

import styles from './Drawer.module.css';

export function Drawer({
  title, children, onClose, containerClass, topBarClass, backButton, hideHeader, ...other
}) {
  const history = useHistory();

  const close = () => {
    if (onClose) {
      onClose();
    } else {
      history.goBack();
    }
  };

  return (
    <MuiDrawer
      anchor="bottom"
      open={true}
      onClose={close}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      <div className={cx(styles.container, containerClass)}>
        {(!hideHeader && title) && (
          <div className={cx(styles.topBar, topBarClass)}>
            {backButton && (
              <div onClick={close}>
                <img className={styles.back} src={Back} alt="" />
              </div>
            )}
            {title ? (
              <div className={styles.heading}>
                {title}
              </div>
            ) : <div>&nbsp;</div>}
            <div>&nbsp;</div>
          </div>
        )}
        {children}
      </div>
    </MuiDrawer>
  );
}

Drawer.propTypes = {
  title: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node.isRequired,
    PropTypes.arrayOf(PropTypes.node).isRequired
  ]).isRequired,
  onClose: PropTypes.func,
  containerClass: PropTypes.string,
  topBarClass: PropTypes.string,
  backButton: PropTypes.bool,
  hideHeader: PropTypes.bool,
};

Drawer.defaultProps = {
  title: null,
  onClose: null,
  containerClass: '',
  topBarClass: '',
  backButton: true,
  hideHeader: false,
};
