import React, { useState } from 'react';
import { InfiniteLoader, List } from 'react-virtualized';
import { useWalletLogs } from 'hooks/wallet';
import { Loading } from 'components/shared/Loading';
import PropTypes from 'prop-types';
import { getText, customDateFilters } from 'containers/utils';
import { Picker } from 'components/shared/dateRangePicker/Picker';
import { WalletBlock } from 'components/wallet/WalletBlock';
import { useQueryParams } from 'hooks';
import noCreditsIcon from 'assets/images/settlement/illustration.svg';
import noCashIcon from 'assets/images/settlement/noCash.svg';
import { StatusSelectionBar } from 'components/shared/StatusSelectionBar';
import { useHistory } from 'react-router-dom';
import { useDesktop } from 'contexts';
import { windoCashStates, windoCreditStates, FilterMap } from '../payments/utils';
import styles from './WalletLog.module.css';

export function WalletLog({ top, type }) {
  const params = useQueryParams();
  const step = type !== 'credits' ? 'all' : 'rewards';
  const state = params.get('state') || step;
  const history = useHistory();
  const [dateRangeFilters, setDateRangeFilters] = useState({ from: null, to: null });
  const isEmptyFrom = dateRangeFilters?.from == null;
  const isEmptyTo = !!dateRangeFilters.to === null;
  const isDesktop = useDesktop();

  const getStates = () => {
    if (type === 'credits') {
      return windoCreditStates;
    }
    return windoCashStates;
  };

  const onStateChange = (val) => {
    params.set('state', val);
    history.replace({
      search: params.toString(),
    });
  };

  const dateTimeFilters = () => {
    if (isEmptyFrom || isEmptyTo) {
      return {};
    }
    return customDateFilters(dateRangeFilters.from, dateRangeFilters.to);
  };

  const [logs, loadMore, hasMore, loading, refresh] = useWalletLogs({
    ...dateTimeFilters(),
    ...(FilterMap[state] || FilterMap.rewards),
    type,
  }, {
    createdAt: -1,
  });

  const rowCount = hasMore ? 10000 : logs.length;

  const isLoaded = i => !!logs[i];

  const topBar = top?.current?.getBoundingClientRect()?.top || 200;

  const height = window.screen.height - topBar;

  if (loading && logs === null) {
    return (
      <Loading />
    );
  }

  // eslint-disable-next-line react/no-multi-comp
  const renderItem = (item) => (
    <div key={item.key} style={item.style}>
      <WalletBlock log={logs[item.index]} hideCurrency={type === 'credits'} />
    </div>
  );

  return (
    <div>
      <div className={styles.head}>
        <div className={styles.heading}> Transactions </div>
        <Picker
          label={getText(dateRangeFilters)}
          float="right"
          onSelect={(e) => {
            setDateRangeFilters(e);
            refresh();
          }}
        />
      </div>
      <StatusSelectionBar
        tabClassName={styles.tabClassName}
        className={styles.tab}
        activeClass={styles.tabActive}
        items={getStates()}
        onChange={onStateChange}
        active={state}
      />
      {logs.length > 0 && (
        <div className={isDesktop ? styles.desktop : null}>
          <InfiniteLoader
            loadMoreRows={loadMore}
            isRowLoaded={isLoaded}
            rowCount={rowCount}
            minimumBatchSize={10}
          >
            {({
              onRowsRendered,
              registerChild
            }) => (
              <List
                height={height}
                onRowsRendered={onRowsRendered}
                ref={registerChild}
                rowCount={logs.length}
                rowHeight={type === 'credits' ? 96 : 96}
                rowRenderer={renderItem}
                width={!isDesktop ? window.screen.width - 32 : window.screen.width - 320 - 420}
              />
            )}
          </InfiniteLoader>
        </div>
      )}
      {logs.length === 0 && (
        <div className={styles.emptyProducts}>
          <img src={type === 'credits' ? noCreditsIcon : noCashIcon} alt="" />
          <div className={styles.emptyText}>
            {state === 'all' && 'You dont have any transactions yet'}
            {state === 'credits' && 'You dont have any credit transactions yet'}
            {state === 'debits' && 'You dont have any debit transactions yet'}
            {state === 'redeem' && 'You dont have any redeemed transactions yet'}
          </div>
        </div>
      )}
    </div>
  );
}

WalletLog.propTypes = {
  top: PropTypes.any.isRequired,
  type: PropTypes.string.isRequired,
};

WalletLog.defaultProps = {};
