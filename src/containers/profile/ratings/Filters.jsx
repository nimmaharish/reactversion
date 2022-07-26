import React from 'react';
import cx from 'classnames';
import { Drawer } from '@material-ui/core';
import { useDesktop } from 'contexts';
import unchecked from 'assets/images/payments/unselect.svg';
import checked from 'assets/v2/products/checked.svg';
import PropTypes from 'prop-types';
import { SideDrawer } from 'components/shared/SideDrawer';
import styles from './Filters.module.css';

function Filters({ onSelect, onClose, selected }) {
  const isDesktop = useDesktop();
  const all = [{
    label: 'Product',
    value: 'product'
  }];

  const onClick = (value) => {
    onSelect(value);
    onClose();
  };

  const isSelected = (value) => selected === value;

  const body = () => (
    <div className={styles.content}>
      {!isDesktop && (
        <div className={styles.label}>
          <div>
            Choose Rating Type
          </div>
        </div>
      )}
      <ul className={styles.list}>
        {all.map((x, i) => (
          <li
            className={cx(styles.item, isSelected(x.value) && styles.active)}
            key={i}
            role="presentation"
            onClick={() => onClick(x.value)}
          >
            {x.label}
            <img src={isSelected(x.value) ? checked : unchecked} className={styles.icon} alt="" />
          </li>
        ))}
        <li
          className={cx(styles.item, styles.opacity)}
          role="presentation"
        >
          Shop (Coming Soon)
          <img src={unchecked} className={styles.icon} alt="" />
        </li>
      </ul>
    </div>
  );

  return (
    <>
      {isDesktop && (
        <SideDrawer
          backButton={true}
          onClick={() => {
            onClose();
          }}
          onClose={() => {
            onClose();
          }}
          button={true}
          btnLabel="Apply"
          title="Choose Rating Type"
        >
          {body()}
        </SideDrawer>
      )}
      {!isDesktop && (
        <Drawer
          anchor="bottom"
          open={true}
          onClose={() => {
            onClose();
          }}
          PaperProps={{
            classes: {
              root: styles.paper,
            }
          }}
        >
          {body()}
        </Drawer>
      )}
    </>
  );
}

Filters.defaultProps = {
};

Filters.propTypes = {
  onSelect: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Filters;
