import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useShop } from 'contexts';
import { Clickable } from 'phoenix-components';
import styles from './OverviewTile.module.css';
export function OverviewTile({
  icon,
  title,
  subTitle,
  route,
  bgColor,
}) {
  const history = useHistory();
  const onClick = () => {
    history.push(route);
  };

  const isBilling = subTitle === 'Total Billing';
  const shop = useShop();

  return (
    <Clickable onClick={onClick} style={{ backgroundColor: bgColor }} className={styles.container}>
      <div className={styles.row1}>
        <img className={styles.icon} src={icon} alt="" />
        <div className={styles.subTitle}>{subTitle}</div>
        <div>&nbsp;</div>
      </div>
      <div className={styles.row}>
        <div className={styles.title}>
          {isBilling && (<span className={styles.less}>{shop.currency}</span>)}
          {title}
        </div>
      </div>
    </Clickable>
  );
}

OverviewTile.propTypes = {
  icon: PropTypes.any.isRequired,
  title: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]).isRequired,
  subTitle: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
};
