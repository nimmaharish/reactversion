import React, { useRef } from 'react';
import { useOrdersInfiniteRatings } from 'hooks/ratings';
import {
  InfiniteLoader, List, Grid, CellMeasurerCache, CellMeasurer
} from 'react-virtualized';
import { RatingCard } from 'components/products/RatingCard';
import emptyOrder from 'assets/overview/newOrder.svg';
import Header from 'components/orders/header/Header';
import { Loading } from 'components/shared/Loading';
import { useDesktop } from 'contexts';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import { useHistory } from 'react-router-dom';
import styles from './Ratings.module.css';

function Ratings() {
  const [ratings, loadMore, hasMore,, refresh] = useOrdersInfiniteRatings({
    createdAt: -1,
  });
  const isDesktop = useDesktop();

  const listRef = useRef();

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 205
  });

  const deskCache = new CellMeasurerCache({
    defaultHeight: 155,
    fixedWidth: true,
  });

  const rowCount = hasMore ? 10000 : ratings.length;

  const history = useHistory();

  const isLoaded = i => !!ratings[i];

  const height = window.screen.height - 78 - 36 - 50;

  const width = listRef?.current?.clientWidth;

  // eslint-disable-next-line react/no-multi-comp
  const renderItem = (item) => (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      key={item.key}
      rowIndex={item.index}
      parent={item.parent}>
      {({ measure, registerChild }) => (
        <div ref={registerChild} key={item.key} style={item.style}>
          <RatingCard
            measure={measure}
            showProduct={true}
            rating={ratings[item.index]}
            refresh={refresh}
          />
        </div>
      )}
    </CellMeasurer>
  );

  const renderCell = (el) => {
    const showBorder = el.columnIndex === 0;
    const idx = el.rowIndex * 2 + el.columnIndex;
    if (idx >= ratings.length) {
      return null;
    }
    const { style } = el;
    return (
      <CellMeasurer
        cache={deskCache}
        columnIndex={el.columnIndex}
        key={el.key}
        parent={el.parent}
        rowIndex={el.rowIndex}
      >
        <div
          style={{
            ...style,
            width: width / 2,
          }}>
          <RatingCard
            showProduct={true}
            showBorder={showBorder}
            rating={ratings[idx]}
            refresh={refresh}
          />
        </div>
      </CellMeasurer>
    );
  };

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

  if (!ratings) {
    return (
      <Loading />
    );
  }

  return (
    <div className={styles.container}>
      {isDesktop && (
        <div onClick={() => history.goBack()} className={styles.maintitle}>
          <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          Reviews
        </div>
      )}
      {!isDesktop && (
        <Header
          showFaq={false}
          title="Reviews"
          showItems={['orders', 'cancellationsReturnsAndRefunds', 'shippingAndDelivery']}
          onBack={() => history.push('/orders')}
        />
      )}
      <div ref={listRef} className={styles.body}>
        {
          ratings.length === 0 && (
            <div className={styles.emptyOrders}>
              <img src={emptyOrder} alt="" />
              <div className={styles.emptyProductText}>
                {'You haven\'t received any reviews yet!'}
              </div>
            </div>
          )
        }
        <InfiniteLoader
          loadMoreRows={loadMore}
          isRowLoaded={isLoaded}
          rowCount={rowCount}
          minimumBatchSize={10}
        >
          {({
            onRowsRendered,
            registerChild
          }) => (isDesktop ? (
            <Grid
              onSectionRendered={onSectionRendered(onRowsRendered)}
              ref={registerChild}
              deferredMeasurementCache={deskCache}
              cellRenderer={renderCell}
              columnCount={2}
              overscanColumnCount={0}
              overscanRowCount={2}
              columnWidth={((width) / 2)}
              height={window.screen.height - 130 - 47}
              rowCount={Math.ceil(rowCount / 2)}
              rowHeight={deskCache.rowHeight}
              width={width}
            />
          )
            : (
              <List
                height={height}
                onRowsRendered={onRowsRendered}
                ref={registerChild}
                rowCount={ratings.length}
                deferredMeasurementCache={cache}
                rowHeight={cache.rowHeight}
                rowRenderer={renderItem}
                width={window.screen.width - 32}
              />
            ))}
        </InfiniteLoader>
      </div>
    </div>
  );
}

Ratings.propTypes = {};

Ratings.defaultProps = {};

export default Ratings;
