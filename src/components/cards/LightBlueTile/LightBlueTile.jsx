import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './LightBlueTile.module.css';

export function LightBlueTile({ children, className }) {
  return (
    <div className={cx(styles.container, className)}>
      {children}
    </div>
  );
}

LightBlueTile.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node.isRequired,
    PropTypes.arrayOf(PropTypes.node).isRequired
  ]).isRequired,
  className: PropTypes.string,
};

LightBlueTile.defaultProps = {
  className: '',
};
