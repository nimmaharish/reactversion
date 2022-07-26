import React from 'react';
import PropTypes from 'prop-types';
import { OnlineMode } from 'components/profile/payments/OnlineMode';
import styles from './Accordion.module.css';

function Accordion({
  children, label, name, onChange
}) {
  return (
    <div className={styles.main}>
      <div className={styles.head}>
        <div className="flexCenter">
          <OnlineMode
            label={label}
            name={name}
            onChange={onChange}
          />
        </div>
      </div>
      <div className={styles.body}>
        {children}
      </div>
    </div>
  );
}

Accordion.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node.isRequired,
    PropTypes.arrayOf(PropTypes.node).isRequired
  ]).isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

Accordion.defaultProps = {
  onChange: null,
};

export default Accordion;
