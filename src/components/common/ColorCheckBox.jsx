import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Clickable } from 'phoenix-components';
import tick from 'assets/v2/common/whiteTick.svg';
import styles from './ColorCheckBox.module.css';

export function ColorCheckBox({
  color, value, onSelect, className
}) {
  const selected = value === color;

  const onClick = () => {
    if (!selected) {
      onSelect(color);
    }
  };

  return (
    <Clickable
      onClick={onClick}
      className={cx(styles.colorBox, className)}
      style={{ background: selected ? `${color}95` : color }}
    >
      {selected && (
        <div className={styles.selected} style={{ background: color }}>
          <img src={tick} alt="" />
        </div>
      )}
    </Clickable>
  );
}

ColorCheckBox.propTypes = {
  color: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  className: PropTypes.string,
};

ColorCheckBox.defaultProps = {
  className: '',
};
