import React from 'react';
import { useToggle } from 'hooks/common';
import PropTypes from 'prop-types';
import { useIsFreePlan } from 'contexts/userContext';
import chevUp from 'assets/v2/settings/paymentModes/chevUp.svg';
import chevDown from 'assets/v2/settings/paymentModes/chevDown.svg';
import cx from 'classnames';
import featureIcon from 'assets/overview/feature.svg';
import styles from './Accordion.module.css';

function Accordion({
  children, label, labelHelper,
}) {
  const [show, toggleShow] = useToggle(true);
  const isFree = useIsFreePlan();
  const chevIcon = show ? chevDown : chevUp;
  return (
    <div className={styles.main}>
      <div
        className={cx(styles.head,
          [styles.noBottomBorder])}>
        <div className={styles.label} onClick={toggleShow}>
          {label}
          {isFree && (
            <>
              <img className={styles.iconF} src={featureIcon} alt="" />
            </>
          )}
        </div>
        <div className="flexCenter">
          <img onClick={toggleShow} src={chevIcon} alt="" />
        </div>
      </div>
      {show && (
        <div
          onClick={toggleShow}
        >
          {labelHelper}
        </div>
      )}
      {!show && (
        <div className={styles.body}>
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
  labelHelper: PropTypes.string.isRequired,
};

export default Accordion;
