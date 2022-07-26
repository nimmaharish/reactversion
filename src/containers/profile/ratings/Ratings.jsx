import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Drawer } from 'components/shared/Drawer';
import reviewIcon from 'assets/images/profile/ratings.svg';
import Info from 'components/info/Info';
import checkIcon from 'assets/images/orders/multi/check.svg';
import unCheckIcon from 'assets/images/orders/multi/uncheck.svg';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import { useRefreshShop } from 'contexts/userContext';
import { OtherButton } from 'components/products/OtherButton';
import emptyOrder from 'assets/overview/newOrder.svg';
import { StatusSelectionBar } from 'components/shared/StatusSelectionBar';
import { RatingCard } from 'components/products/RatingCard';
import {
  useDesktop, IsShopRatingsEnabled, IsShopRatingsAutoApproved
} from 'contexts';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import {
  Switch
} from 'phoenix-components';
import { useInfiniteRatings } from 'hooks/ratings';
import {
  InfiniteLoader, List, Grid, CellMeasurerCache, CellMeasurer
} from 'react-virtualized';
import { Becca } from 'api';
import Kbc from 'components/knowBaseCards/KnowBaseCards';
import styles from './Ratings.module.css';

function Ratings() {
  const stateList = [
    {
      label: 'Products',
      value: 'sku',
    },
    {
      label: 'Shop (Coming Soon)',
      value: 'shop',
    }
  ];

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 250 - 71 - 45
  });

  const deskCache = new CellMeasurerCache({
    defaultHeight: 155,
    fixedWidth: true,
  });

  const [type, setType] = useState(stateList[0].value);
  const history = useHistory();
  const isDesktop = useDesktop();
  const splitterRef = useRef();
  const isShopRatingsEnabled = IsShopRatingsEnabled();
  const isShopRatingsAutoApproved = IsShopRatingsAutoApproved();
  const refreshShop = useRefreshShop();

  const [ratings, loadMore, hasMore, , refresh] = useInfiniteRatings(-1, {
    createdAt: -1,
  });

  const isLoaded = i => !!ratings[i];

  const rowCount = hasMore ? 10000 : ratings.length;

  const height = window.screen.height - 78 - 36 - 50;

  const width = splitterRef?.current?.clientWidth;

  const dHeight = window.screen.height - 90 - 68 - 24 - 68;

  const gotoShareRating = () => {
    history.push('/manage/createRatingLink');
  };

  const text = 'Want to enable ratings and reviews on your shop?';
  const info = 'You can share the rating link with them anytime Or Customers will see \'Rate the Product\' option '
    + ' once you mark  the order as completed or shipping status as delivered or picked-up.';

  const onUnlive = async (isAutoApprove = false) => {
    const config = !isAutoApprove ? {
      ratings: {
        enabled: !isShopRatingsEnabled,
        autoApprove: isShopRatingsAutoApproved
      }
    } : {
      ratings: {
        enabled: isShopRatingsEnabled,
        autoApprove: !isShopRatingsAutoApproved
      }
    };
    Loader.show();
    try {
      await Becca.updateShop({
        config,
      });
      refreshShop();
      SnackBar.show('Ratings changes saved successfully', 'success');
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const onStateChange = (val) => {
    setType(val);
  };

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
            showReviewsLink={true}
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
            showReviewsLink={true}
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

  const body = () => (
    <div id="scroll" className={styles.sdContent}>
      <div className={styles.flex}>
        <div className={styles.reviewHead}>
          <div className={styles.ratingView}>
            <img src={reviewIcon} alt="" />
            <div className={styles.text}>{text}</div>
            <Switch active={isShopRatingsEnabled} onChange={() => onUnlive(false)} />
          </div>
          <div className={styles.subC}>
            <img
              src={isShopRatingsAutoApproved ? checkIcon : unCheckIcon}
              className={styles.imgC}
              alt=""
              onClick={() => onUnlive(true)}
            />
            Approve ratings automatically
          </div>
          <div className={styles.hText}>
            Check this box to automatically approve product ratings
            submitted by customers. You can always disable
            a rating that has been automatically approved.
          </div>
        </div>
      </div>
      <div className={styles.shareSection}>
        <OtherButton onClick={gotoShareRating} label="Share Ratings Link" open={false} />
      </div>
      <div className="flexCenter fullWidth">
        <Kbc type="ratingsAndReview" />
      </div>
      <Info text={info} title="Info" />
      <StatusSelectionBar
        className={styles.tab}
        tabClassName={styles.tabClassName}
        activeClass={styles.tabActive}
        items={stateList}
        onChange={onStateChange}
        active={type}
        seperator={true}
      />
      <div ref={splitterRef}></div>
      {
        ratings?.length === 0 && (
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
            columnWidth={(width) / 2}
            height={dHeight}
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
  );

  if (isDesktop) {
    return (
      <div className={styles.desktopContainer}>
        <div onClick={history.goBack} className={styles.maintitle}>
          <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          Reviews
        </div>
        {body()}
      </div>
    );
  }

  return (
    <Drawer
      className={styles.section}
      title="Reviews"
    >
      {body()}
    </Drawer>
  );
}
export default Ratings;
