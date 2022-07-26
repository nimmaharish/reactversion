import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import viewIcon from 'assets/overview/viewAll.svg';
import { Clickable } from 'phoenix-components';
import styles from './TileList.module.css';

export function TileList({ children, title, route }) {
  const history = useHistory();

  const onClick = () => {
    history.push(route);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.title}>{title}</div>
        <Clickable onClick={onClick} className={styles.link}>
          View All
          <span>
            <img className={styles.icon} src={viewIcon} alt="" />
            {' '}
          </span>
        </Clickable>
      </div>
      {children}
    </div>
  );
}

TileList.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node.isRequired,
    PropTypes.arrayOf(PropTypes.node).isRequired
  ]).isRequired,
  title: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
};

TileList.defaultProps = {};
