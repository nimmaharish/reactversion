import React from 'react';
import { useToggle } from 'hooks/common';
import PropTypes from 'prop-types';
import cx from 'classnames';
import chevUp from 'assets/v2/settings/paymentModes/chevUp.svg';
import chevDown from 'assets/v2/settings/paymentModes/chevDown.svg';
import styles from './Accordion.module.css';

function Accordion({
  children, label, headStyle, bodyStyle, mainStyle, showDefault
}) {
  const [show, toggleShow] = useToggle(showDefault);

  const chevIcon = show ? chevUp : chevDown;
  return (
    <div
      className={cx(mainStyle, styles.main,
        {
          [styles.hideBorder]: show && mainStyle.length > 0,
          [styles.customMain]: mainStyle.length > 0
        })}
    >
      <div
        className={cx(styles.head, headStyle)}>
        <div className={styles.label} onClick={toggleShow}>
          {label}
        </div>
        <img onClick={toggleShow} src={chevIcon} alt="" />
      </div>
      {show && (
        <div
          className={cx(styles.body, bodyStyle,
            {
              [styles.custom]: mainStyle.length > 0
            })}
        >
          {children}
        </div>
      )}
    </div>
  );
}

Accordion.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node.isRequired,
    PropTypes.arrayOf(PropTypes.node).isRequired
  ]).isRequired,
  label: PropTypes.string.isRequired,
  headStyle: PropTypes.string,
  bodyStyle: PropTypes.string,
  mainStyle: PropTypes.string,
  showDefault: PropTypes.bool
};

Accordion.defaultProps = {
  headStyle: '',
  bodyStyle: '',
  mainStyle: '',
  showDefault: false,
};

export default Accordion;
