import React from 'react';
import PropTypes from 'prop-types';
import { LightBlueTile } from 'components/cards/LightBlueTile/LightBlueTile';
import cx from 'classnames';
import styles from './LightBlueTileList.module.css';

export function LightBlueTileList({ children, containerClass, tileClass }) {
  return (
    <div className={containerClass}>
      {children.map((child, i) => (
        <LightBlueTile key={i} className={cx(styles.child, tileClass)}>
          {child}
        </LightBlueTile>
      ))}
    </div>
  );
}

LightBlueTileList.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  containerClass: PropTypes.string,
  tileClass: PropTypes.string,
};

LightBlueTileList.defaultProps = {
  containerClass: '',
  tileClass: ''
};
