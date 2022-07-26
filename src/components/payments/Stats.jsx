import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './Stats.module.css';

export function Stats({
  icon1, text1, subText1, icon2, text2, subText2
}) {
  return (
    <div className={styles.flex}>
      <div className={styles.width45}>
        <div className={styles.iconContainer}>
          <img src={icon1} alt="" />
          <div className={styles.price}>
            {text1}
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.info}>
            {subText1}
          </div>
        </div>
      </div>
      <div className={styles.width10} />
      <div className={cx(styles.width45, styles.width451)}>
        <div className={styles.iconContainer}>
          <img src={icon2} alt="" />
          <div className={styles.price}>
            {text2}
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.info}>
            {subText2}
          </div>
        </div>
      </div>
    </div>
  );
}

Stats.propTypes = {
  icon1: PropTypes.string.isRequired,
  text1: PropTypes.string.isRequired,
  subText1: PropTypes.string.isRequired,
  icon2: PropTypes.string.isRequired,
  text2: PropTypes.string.isRequired,
  subText2: PropTypes.string.isRequired,

};

Stats.defaultProps = {};
