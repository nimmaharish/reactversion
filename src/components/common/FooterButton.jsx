import React from 'react';
import PropTypes from 'prop-types';
import { useIsKeyboardOpen } from 'contexts';
import cx from 'classnames';
import styles from './FooterButton.module.css';

export function FooterButton({ children }) {
  const isOpen = useIsKeyboardOpen();

  return (
    <div
      className={cx(styles.container, {
        [styles.isOpen]: isOpen,
      })}
    >
      {children}
    </div>
  );
}

FooterButton.propTypes = {
  children: PropTypes.any.isRequired,
};

FooterButton.defaultProps = {};
