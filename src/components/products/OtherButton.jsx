import React from 'react';
import PropTypes from 'prop-types';
import { Clickable } from 'phoenix-components';
import chevron from 'assets/v2/common/chevronBlackRight.svg';
import chevronTop from 'assets/v2/common/chevronGreyTop.svg';
import chevronBottom from 'assets/v2/common/chevronGreyBottom.svg';
import cx from 'classnames';
import { useDesktop } from 'contexts';
import styles from './OtherButton.module.css';

export function OtherButton({
  label,
  onClick,
  open,
  from
}) {
  const isDesktop = useDesktop();

  return (
    <Clickable
      onClick={onClick}
      className={cx(styles.container, {
        [styles.open]: open,
        [styles.varBgn]: from === 'var'
      })}>
      <div className={styles.button}>{label}</div>
      {!isDesktop
        && (
          <img className={styles.img} src={open ? chevronTop : chevron} alt="" />
        )}
      {isDesktop
        && (
          <img className={styles.img} src={chevronBottom} alt="" />
        )}
    </Clickable>
  );
}

OtherButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  open: PropTypes.bool,
  from: PropTypes.string.isRequired
};

OtherButton.defaultProps = {
  open: false
};
