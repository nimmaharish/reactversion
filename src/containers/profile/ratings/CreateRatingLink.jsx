import React, { useState, useRef } from 'react';
import { Drawer } from 'components/shared/Drawer';
import { useToggle } from 'hooks/common';
import { useHistory } from 'react-router-dom';
import { SideDrawer } from 'components/shared/SideDrawer';
import { OtherButton } from 'components/products/OtherButton';
import {
  InfiniteLoader, List, CellMeasurerCache, CellMeasurer
} from 'react-virtualized';
import {
  useDesktop
} from 'contexts';
import { useInfiniteProducts } from 'hooks';
import { Search } from 'phoenix-components';
import emptyProducts from 'assets/overview/newOrder.svg';
import { ProductCard } from 'components/reviewProduct/ProductCard';
import Filters from './Filters';
import styles from './CreateRatingLink.module.css';

function CreateRatingLink() {
  const isDesktop = useDesktop();
  const history = useHistory();
  const [level, setLevel] = useState('');
  const [query, setQuery] = useState('');
  const containerRef = useRef();
  const [clickedIndex, setClickedIndex] = useState(null);
  const [openLevel, toggleLevel] = useToggle(false);
  const isProducts = level === 'product';
  const label = isProducts ? 'Product' : 'Select';
  const boxWidth = isDesktop
    ? (containerRef?.current?.getBoundingClientRect()?.width) : (window.screen.width - 32);
  console.log(containerRef, clickedIndex);

  const gotoRatings = () => history.push('/manage/ratings');

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 130
  });

  const searchFilters = () => {
    if (query.length > 0) {
      return { title: { $regex: `${query}`, $options: 'i' } };
    }
    return {};
  };

  const [products, loadMore, hasMore, , refresh] = useInfiniteProducts({
    ...searchFilters()
  }, { createdAt: -1 });

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
          <ProductCard
            onShareOpen={(isHide) => {
              setClickedIndex(isHide ? null : item.index);
            }}
            measure={measure}
            product={products[item.index]} />
        </div>
      )}
    </CellMeasurer>
  );

  const rowCount = hasMore ? 10000 : products.length;
  const isLoaded = i => !!products[i];
  const topBar = containerRef?.current?.getBoundingClientRect()?.top || 120;
  const height = window.screen.height - topBar - 75;

  const body = () => (
    <div className={styles.sdContent}>
      <div className={styles.label}>Choose Rating Type</div>
      <div className={styles.shareSection}>
        <OtherButton onClick={toggleLevel} label={label} open={false} />
      </div>
      {openLevel && (
        <Filters onClose={toggleLevel} selected={level} onSelect={(val) => setLevel(val)} />
      )}
      {isProducts && (
        <>
          <div className={styles.paddLR}>
            <Search
              value={query}
              placeholder="Search products"
              onChange={(e) => {
                setQuery(e.target.value);
                refresh();
              }}
            />
          </div>
          <div ref={containerRef}></div>
          {products.length > 0 ? (
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
                  deferredMeasurementCache={cache}
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                  rowCount={products.length}
                  rowRenderer={renderItem}
                  rowHeight={cache.rowHeight}
                  width={boxWidth}
                />
              )}
            </InfiniteLoader>
          ) : (
            <div className={styles.emptyProducts}>
              <img src={emptyProducts} alt="" />
              <div className={styles.emptyProductText}>
                No recently added products
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <SideDrawer
        backButton={true}
        onClose={gotoRatings}
        title="Share Ratings Link"
      >
        {body()}
      </SideDrawer>
    );
  }

  return (
    <Drawer
      className={styles.section}
      title="Share Ratings Link"
    >
      {body()}
    </Drawer>
  );
}
export default CreateRatingLink;
