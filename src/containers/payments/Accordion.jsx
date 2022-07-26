import React from 'react';
import { useToggle } from 'hooks/common';
import PropTypes from 'prop-types';
import chevUp from 'assets/v2/settings/paymentModes/chevUp.svg';
import chevDown from 'assets/v2/settings/paymentModes/chevDown.svg';
import paypalIcon from 'assets/images/payments/pp.svg';
import rzPaylIcon from 'assets/images/payments/rp.svg';
import stripeIcon from 'assets/images/payments/sp.svg';
import cashFreeIcon from 'assets/images/payments/cf.svg';
import cx from 'classnames';
import styles from './Accordion.module.css';

function Accordion({
  children, label, name, isActive
}) {
  const [show, toggleShow] = useToggle(true);

  const getIcon = () => {
    if (name === 'paypal') {
      return paypalIcon;
    }
    if (name === 'razorpay') {
      return rzPaylIcon;
    }
    if (name === 'stripe') {
      return stripeIcon;
    }
    if (name === 'cashfree') {
      return cashFreeIcon;
    }
    return '';
  };

  const chevIcon = show ? chevUp : chevDown;
  return (
    <div className={styles.main}>
      <div
        className={cx(styles.head, {
          [styles.bigPad]: !getIcon(),
          [styles.noBottomBorder]: show
        })}>
        <div className={styles.label} onClick={toggleShow}>
          {getIcon() && <img src={getIcon()} alt="" />}
          {label}
        </div>
        <div className="flexCenter">
          <div className={cx(styles.status, { [styles.inactive]: !isActive })}>
            {isActive ? 'Active' : 'Inactive'}
          </div>
          <img onClick={toggleShow} src={chevIcon} alt="" />
        </div>
      </div>
      {show && (
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
  name: PropTypes.string,
  isActive: PropTypes.bool
};

Accordion.defaultProps = {
  name: '',
  isActive: false
};

export default Accordion;
