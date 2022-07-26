import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
} from 'phoenix-components';
import chevronDown from 'assets/desktop/chevronDown.svg';
import styles from './commonComponents.module.css';

export function Tile({ title, subTitle }) {
  return (
    <div className={styles.root}>
      <div className={styles.flex}>
        {title}
        <img src={chevronDown} className={styles.img} alt="" />
      </div>
      <Button
        className={styles.button}
        size="small"
        primary={false}
        label={subTitle}
      />
    </div>
  );
}

Tile.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
};
