import React, { useState } from 'react';
import { useInfiniteCarts, useQueryParams } from 'hooks';
import { useHistory } from 'react-router-dom';
import {
  InfiniteLoader, List, Grid
} from 'react-virtualized';
import { StatusSelectionBar } from 'components/shared/StatusSelectionBar';
import { Picker } from 'components/shared/dateRangePicker/Picker';
import { Drawer } from 'components/shared/Drawer';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
// import { useRefreshShop } from 'contexts/userContext';
import { getText, customDateFilters, updatedFilters } from 'containers/utils';
import {
  useDesktop
} from 'contexts';
import { CartCard } from 'components/orders/CartCard';
import { placedList } from './utils';
// import SnackBar from 'services/snackbar';
// import Loader from 'services/loader';
// import { Becca } from 'api';
import styles from './Carts.module.css';

function Carts() {
  const history = useHistory();
  const params = useQueryParams();
  const isDesktop = useDesktop();
  const height = window.screen.height - 78 - 36 - 8 - 56;
  const place = params.get('placed') || 'all';
  const screenWidth = window.screen.width - 320 - 160;
  const [dateRangeFilters, setDateRangeFilters] = useState({
    from: null,
    to: null
  });
  const isEmptyFrom = dateRangeFilters.from === null;
  const isEmptyTo = dateRangeFilters.to === null;

  const dateTimeFilters = () => {
    if (place !== 'custom') {
      return updatedFilters[place];
    }
    if (isEmptyFrom || isEmptyTo) {
      return {};
    }
    return customDateFilters(dateRangeFilters.from, dateRangeFilters.to, false);
  };

  const filters = {
    ...dateTimeFilters(),
  };
  const [carts, loadMore, hasMore, , refresh] = useInfiniteCarts(filters, {
    updatedAt: -1,
  });
  const rowCount = hasMore ? 10000 : carts.length;

  const onSectionRendered = (onRowsRendered) => ({
    columnStartIndex,
    columnStopIndex,
    rowStartIndex,
    rowStopIndex
  }) => {
    const startIndex = rowStartIndex * 2 + columnStartIndex;
    const stopIndex = rowStopIndex * 2 + columnStopIndex;

    onRowsRendered({
      startIndex,
      stopIndex
    });
  };

  const onCreateChange = (val) => {
    setDateRangeFilters({
      from: null,
      to: null
    });
    params.set('placed', val);
    history.push({ search: params.toString() });
  };

  const isLoaded = i => !!carts[i];

  const renderItem = (item) => {
    const idx = isDesktop ? item.rowIndex * 2 + item.columnIndex : item.index;
    if (idx >= carts.length) {
      return null;
    }
    return (
      <div key={item.key} style={item.style}>
        <CartCard refresh={refresh} cart={carts[idx]} />
      </div>
    );
  };

  const body = () => (
    <div className={styles.Content}>
      <div className={styles.picContainer}>
        <Picker
          label={getText(dateRangeFilters)}
          onSelect={(e) => {
            setDateRangeFilters(e);
            params.set('placed', 'custom');
            history.push({ search: params.toString() });
          }}
          inputStyle={styles.padd0}
        />
      </div>
      <StatusSelectionBar
        tabClassName={styles.tabClassName}
        className={styles.tabClass}
        activeClass={styles.tabActive}
        items={placedList}
        onChange={onCreateChange}
        active={place}
      />
      <div className={styles.orderHead}>
        Abandoned Carts
      </div>
      <div className={styles.loaderPadding}>
        {isDesktop ? (
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
              <Grid
                onSectionRendered={onSectionRendered(onRowsRendered)}
                ref={registerChild}
                cellRenderer={renderItem}
                columnCount={2}
                columnWidth={(screenWidth / 2)}
                height={height}
                rowCount={Math.ceil(rowCount / 2)}
                rowHeight={120}
                width={screenWidth}
              />
            )}
          </InfiniteLoader>
        ) : (
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
                rowCount={carts.length}
                rowHeight={90}
                rowRenderer={renderItem}
                width={window.screen.width}
              />
            )}
          </InfiniteLoader>
        )}
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <div className={styles.desktopContainer}>
        <div onClick={() => history.push('/orders')} className={styles.maintitle}>
          <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          Carts
        </div>
        {body()}
      </div>
    );
  }

  return (
    <Drawer
      className={styles.section}
      title="Carts"
    >
      {body()}
    </Drawer>
  );
}
export default Carts;
