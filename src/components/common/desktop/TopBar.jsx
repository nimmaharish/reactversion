import React from 'react';
import PropTypes from 'prop-types';
import { Clickable } from 'phoenix-components';
import backArrow from 'assets/v2/common/chevronPrimaryLeft.svg';
import { useHistory } from 'react-router-dom';
import styles from './TopBar.module.css';

export function TopBar({ title, onClick }) {
  const history = useHistory();

  const onHandleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    history.goBack();
  };

  return (
    <div className={styles.container}>
      <Clickable onClick={onHandleClick} className={styles.back}>
        <img src={backArrow} alt="" />
      </Clickable>
      <div className={styles.title}>{title}</div>
    </div>
  );
}

TopBar.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

TopBar.defaultProps = {
  onClick: null,
};
