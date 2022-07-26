import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Chip, Grid, Menu, MenuItem
} from '@material-ui/core';
import { InfiniteLoader, List, Grid as RVGrid } from 'react-virtualized';
import { useInfiniteProducts, useQueryParams } from 'hooks';
import { ProductCard } from 'components/products';
// import { Loading } from 'components/shared/Loading';
import InfoClose from 'assets/images/products/create/filterClose.svg';
import AddIcon from 'assets/images/products/create/add1.svg';
import emptyProducts from 'assets/overview/newOrder.svg';
import { useProfile } from 'hooks/profile';
import { Picker } from 'components/shared/dateRangePicker/Picker';
import { InstaImport } from 'components/userProfile/InstaImport';
import { useDesktop, useIsUserRated } from 'contexts';
import { Button, Clickable } from 'phoenix-components';
import { Select } from 'phoenix-components';
import { Search } from 'phoenix-components';
import addIcon from 'assets/v2/products/add.svg';
import { customDateFilters, dateFilters, getText } from 'containers/utils';
import cx from 'classnames';
import chevronWhiteBottom from 'assets/v2/common/chevronWhiteBottom.svg';
import { canTakeRating, setRatingShown } from 'utils/ratings';
import { RatingService } from 'services/ratings';
import { list, FilterMap } from './utils';
import styles from './List.module.css';

function ProductsList() {
  const history = useHistory();
  const isDesktop = useDesktop();
  const params = useQueryParams();
  const [query, setQuery] = useState('');
  const state = params.get('state') || 'all';
  const create = params.get('created') || 'all';
  const type = params.has('type');
  const types = type ? params.get('type') : null;
  const [dateRangeFilters, setDateRangeFilters] = useState({
    from: null,
    to: null
  });
  const isEmptyFrom = dateRangeFilters.from === null;
  const isEmptyTo = dateRangeFilters.to === null;

  const [anchorMenuEl, setAnchorEl] = useState(null);
  const rated = useIsUserRated();

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openBulkUploadProducts = () => {
    setAnchorEl(null);
    history.push('/product/bulk/upload');
  };

  const getCatalogFilters = () => {
    if (types) {
      return { catalog: types === 'null' ? null : types };
    }
    return {};
  };

  const dateTimeFilters = () => {
    if (create !== 'custom') {
      return dateFilters[create];
    }
    if (isEmptyFrom || isEmptyTo) {
      return {};
    }
    return customDateFilters(dateRangeFilters.from, dateRangeFilters.to);
  };

  const searchFilters = () => {
    if (query.length > 0) {
      return { title: { $regex: `${query}`, $options: 'i' } };
    }
    return {};
  };

  const [products, loadMore, hasMore, , refresh] = useInfiniteProducts({
    ...dateTimeFilters(),
    ...(FilterMap[state]),
    ...getCatalogFilters(),
    ...searchFilters()
  }, { createdAt: -1 });

  const [profile, refreshProfile] = useProfile();

  useEffect(() => {
    if ((products?.length || 0) < 2) {
      return;
    }
    if (rated) {
      return;
    }
    if (!canTakeRating()) {
      return;
    }
    RatingService.open();
    setRatingShown();
  }, [products?.length > 2]);

  const rowCount = hasMore ? 10000 : products.length;

  const isLoaded = i => !!products[i];

  const height = window.screen.height - 240;

  const dHeight = window.screen.height - 90 - 68 - 24 - 68;

  const dCellWidth = (window.screen.width - 272 - 60 - 34) / 2;

  const onCreate = () => {
    history.push('/products/create');
  };

  const onFilterSelect = (val) => {
    if (state === val.value) {
      params.delete('state');
    } else {
      params.set('state', val.value);
    }
    history.push({ search: params.toString() });
    refresh();
  };

  // const isEmpty = products.length === 0 && loading;

  // if (isEmpty) {
  //   return <Loading />;
  // }

  // eslint-disable-next-line react/no-multi-comp
  const renderItem = (item) => (
    <div
      key={item.key}
      style={item.style}
    >
      <ProductCard product={products[item.index]} />
    </div>
  );

  const renderCell = (el) => {
    const idx = el.rowIndex * 2 + el.columnIndex;
    if (idx >= products.length) {
      return null;
    }
    return (
      <div key={el.key} style={el.style}>
        <ProductCard showBorder={el.columnIndex === 0} product={products[idx]} />
      </div>
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

  return (
    <>
      {!isDesktop
    && (
      <div className={styles.container}>
        <div className={styles.emptyProductsRow}>
          <InstaImport profile={profile} onClose={refreshProfile} page="products" />
          <Button
            startIcon={addIcon}
            label="Add Product"
            onClick={onCreate}
          />
        </div>
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
        <div className={styles.picker}>
          <div className={styles.left}>
            <Select
              className={styles.select}
              classNamePrefix="react-select"
              isSearchable={false}
              // label="Select Bank"
              placeholder="Select Products"
              value={list.find(x => x.value === state)}
              onChange={onFilterSelect}
              options={list}
            />
          </div>
          <div>
            <Picker
              label={getText(dateRangeFilters)}
              onSelect={(e) => {
                setDateRangeFilters(e);
                if (getText(e) !== 'Select Date') {
                  params.set('created', 'custom');
                  history.push({ search: params.toString() });
                } else {
                  params.delete('created');
                  history.push({ search: params.toString() });
                }
                refresh();
              }}
            />
          </div>
        </div>
        <div className="textCenter fullWidth">
          {types?.length > 0 && (
            <div className={styles.chipSec}>
              <Chip
                color="primary"
                className={styles.chip}
                label={types === 'null' ? 'Un Named' : types}
                deleteIcon={<img src={InfoClose} alt="" />}
                onDelete={() => {
                  history.push({
                    pathname: 'products/catalog',
                  });
                }}
              />
            </div>
          )}
        </div>
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
                onRowsRendered={onRowsRendered}
                ref={registerChild}
                rowCount={products.length}
                rowHeight={132}
                rowRenderer={renderItem}
                width={window.screen.width}
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
        <Clickable
          className={styles.fab}
          onClick={() => {
            history.push('/products/create');
          }}>
          <img src={AddIcon} alt="" />
        </Clickable>
      </div>
    )}
      {isDesktop
    && (
      <div className={styles.container}>
        <div className={styles.emptyProductsRow}>
          <Grid item xs={6} container spacing={1}>
            <InstaImport profile={profile} onClose={refreshProfile} page="products" />
            <div className={styles.buttonContainer}>
              <Button
                className={cx(styles.copyButton, styles.desktopButton)}
                startIcon={addIcon}
                label="Add Product"
                onClick={onCreate}
              />
              <Clickable
                className={styles.dropDownButton}
                onClick={e => {
                  setAnchorEl(e.currentTarget);
                }}
              >
                <div>
                  <img src={chevronWhiteBottom} alt="" />
                </div>
              </Clickable>
              <Menu
                anchorEl={anchorMenuEl}
                open={Boolean(anchorMenuEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
              >
                <MenuItem onClick={openBulkUploadProducts}>Bulk Upload Products</MenuItem>
              </Menu>
            </div>
          </Grid>
        </div>
        <div className={styles.pickerContainer}>
          <div className={styles.picker}>
            <div>
              <Picker
                label={getText(dateRangeFilters)}
                onSelect={(e) => {
                  setDateRangeFilters(e);
                  if (!e.from) {
                    params.delete('created');
                    history.push({ search: params.toString() });
                    refresh();
                    return;
                  }
                  params.set('created', 'custom');
                  history.push({ search: params.toString() });
                  refresh();
                }}
              />
            </div>
          </div>
          <div className={styles.pickerContainer1}>
            <div className={styles.search1}>
              <Search
                value={query}
                placeholder="Search products"
                onChange={(e) => {
                  setQuery(e.target.value);
                  refresh();
                }}
              />
            </div>
            {/* <Button
              label="Search "
              onClick={onCreate}
            /> */}
          </div>
          <div className={styles.search}>
            <Select
              className={styles.select}
              classNamePrefix="react-select"
              // label="Select Bank"
              placeholder="Select Products"
              value={list.find(x => x.value === state)}
              onChange={onFilterSelect}
              options={list}
            />
          </div>
        </div>
        <div className="textCenter fullWidth">
          {types?.length > 0 && (
            <div className={styles.chipSec}>
              <Chip
                color="primary"
                className={styles.chip}
                label={types === 'null' ? 'Un Named' : types}
                deleteIcon={<img src={InfoClose} alt="" />}
                onDelete={() => {
                  history.push({
                    pathname: 'products/catalog',
                  });
                }}
              />
            </div>
          )}
        </div>
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
              <RVGrid
                onSectionRendered={onSectionRendered(onRowsRendered)}
                ref={registerChild}
                cellRenderer={renderCell}
                columnCount={2}
                columnWidth={dCellWidth}
                height={dHeight}
                rowCount={Math.ceil(rowCount / 2)}
                rowHeight={135}
                width={window.screen.width - 272 - 60 - 32}
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
      </div>
    )}
    </>
  );
}

export default ProductsList;
