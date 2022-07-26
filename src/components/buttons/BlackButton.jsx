import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './BlackButton.module.css';

export function BlackButton({
  onClick, className, children, disabled, endIcon, id
}) {
  return (
    <div
      onClick={onClick}
      id={id}
      className={cx(className, styles.button, {
        [styles.disabled]: disabled
      })}>
      {children}
      {endIcon && (
        endIcon
      )}
    </div>
  );
}

BlackButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  endIcon: PropTypes.any
};

BlackButton.defaultProps = {
  className: '',
  id: '',
  onClick: () => {
  },
  disabled: false,
  endIcon: null
};
