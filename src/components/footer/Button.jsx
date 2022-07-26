import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import styles from './Button.module.css';

export function Button({
  route,
  icon,
  label,
  iconFilled,
  id
}) {
  const history = useHistory();
  const location = useLocation();
  const activeRoute = location.pathname === '/' ? '/overview' : location.pathname;
  const selected = activeRoute.includes(route);

  const onClick = () => {
    history.push(route);
  };

  return (
    <div id={id} onClick={onClick} className={styles.container}>
      <div
        className={cx(styles.icon, {
          [styles.selected]: selected,
        })}>
        <img src={selected ? iconFilled : icon} alt="" />
      </div>
      <div
        className={cx(styles.label, {
          [styles.selected]: selected,
        })}>
        {label}
      </div>
    </div>
  );
}

Button.propTypes = {
  route: PropTypes.string.isRequired,
  icon: PropTypes.any.isRequired,
  iconFilled: PropTypes.any.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.string,
};

Button.defaultProps = {
  id: ''
};
