import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import featureIcon from 'assets/overview/feature.svg';
import styles from './StatusSelectionBar.module.css';

export function StatusSelectionBar({
  items,
  active,
  onChange,
  className,
  itemClassName,
  activeClass,
  tabClassName,
  seperator,
}) {
  return (
    <div className={cx(className, styles.container)}>
      {items.map((i, index) => (
        <>
          {index !== 0 && seperator && (
            <div className={styles.line}></div>
          )}
          <div
            className={cx(styles.block, itemClassName, tabClassName, {
              [styles.active]: active === i.value,
              [activeClass]: active === i.value
            })}
            key={i.value}
            onClick={() => {
              if (i.value === active) {
                return;
              }
              onChange(i.value);
            }}
            translate="no"
          >
            {i.label}
            {i?.count >= 0 && (
              <sup
                className={cx(styles.count)}>
                {i?.count >= 100 ? '99+' : i?.count}
              </sup>
            )}
            {i.isPremium === true && (
              <img className={styles.fIcon} src={featureIcon} alt="" />
            )}
          </div>
        </>
      ))}
    </div>
  );
}

StatusSelectionBar.propTypes = {
  items: PropTypes.array.isRequired,
  active: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  tabClassName: PropTypes.string,
  activeClass: PropTypes.string,
  itemClassName: PropTypes.string,
  seperator: PropTypes.bool,
};

StatusSelectionBar.defaultProps = {
  className: '',
  tabClassName: '',
  activeClass: '',
  itemClassName: '',
  seperator: false,
};
