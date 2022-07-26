import React from 'react';
import PropTypes from 'prop-types';
import { LightBlueTile } from 'components/cards';
import debitIcon from 'assets/images/wallet/debit.svg';
import creditIcon from 'assets/images/wallet/credit.svg';
import rewardIcon from 'assets/images/wallet/refer.svg';
import lossIcon from 'assets/images/wallet/loss.svg';
import { Badge } from 'phoenix-components';
import cx from 'classnames';
import { longDateFormat } from 'utils';
import { useShop } from 'contexts/userContext';
import styles from './WalletBlock.module.css';

export function WalletBlock({ log, hideCurrency }) {
  const shop = useShop();

  const getAmount = () => (!hideCurrency ? log?.amount?.toFixed(2) : log?.amount?.toFixed(0));
  const getIcon = () => {
    if (hideCurrency) {
      const icon = log.operation === 'add' ? rewardIcon : lossIcon;
      return icon;
    }
    const icon = log.operation === 'add' ? creditIcon : debitIcon;
    return icon;
  };

  const getTitle = (item) => {
    if (item.operation === 'subtract') {
      return 'Debited';
    }
    return 'Credited';
  };

  return (
    <LightBlueTile className={styles.container}>
      <div className={styles.left}>
        <img src={getIcon()} alt="" />
      </div>
      <div className={styles.center}>
        <div className={styles.operation}>{getTitle(log)}</div>
        <div className={cx('textCapital', styles.note)}>{log.note}</div>
        <div className={styles.date}>{longDateFormat(log.createdAt)}</div>
      </div>
      <div className={styles.right}>
        <div className={styles.amount}>{`${!hideCurrency ? shop.currency : ''} ${getAmount()}`}</div>
        <Badge
          size="small"
          className={styles.green}
        >
          Successful
        </Badge>
      </div>
    </LightBlueTile>
  );
}

WalletBlock.propTypes = {
  log: PropTypes.object.isRequired,
  hideCurrency: PropTypes.bool.isRequired,
};

WalletBlock.defaultProps = {};
