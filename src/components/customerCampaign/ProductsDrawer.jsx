import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from '@material-ui/core';
import { useInfiniteProducts } from 'hooks';
import { Grid, InfiniteLoader } from 'react-virtualized';
import { LightBlueTile } from 'components/cards';
import { SideDrawer } from 'components/shared/SideDrawer';
import { useDesktop } from 'contexts';
import { Button } from 'phoenix-components';
import Header from 'containers/products/Header';
import emptyProducts from 'assets/overview/products.svg';
import styles from 'components/shared/ProductsDrawer.module.css';
import checkIcon from 'assets/v2/products/checked.svg';
import uncheckIcon from 'assets/v2/products/unchecked.svg';

export function ProductsDrawer({
  initial = [],
  onClose,
  filters = {},
  btnText,
  allowCheck,
}) {
  const [products, setProducts] = useState(initial);
  const [productList = [], loadMore, hasMore] = useInfiniteProducts(filters);
  const productSet = new Set(products);
  const isDesktop = useDesktop();
  const rowCount = hasMore ? 10000 : productList.length;
  const isLoaded = i => !!productList[i];

  const height = window.screen.height - 136 - 16;
  const cellWidth = (window.screen.width - 32) / 2;

  const tagProduct = product => e => {
    const id = product._id;
    e.stopPropagation();
    if (productSet.has(id)) {
      productSet.delete(id);
      setProducts([...productSet]);
      return;
    }
    productSet.add(id);
    setProducts([...productSet]);
  };

  const onSectionRendered = (onRowsRendered) => ({
    columnStartIndex,
    columnStopIndex,
    rowStartIndex,
    rowStopIndex
  }) => {
    const startIndex = rowStartIndex * 3 + columnStartIndex;
    const stopIndex = rowStopIndex * 3 + columnStopIndex;

    onRowsRendered({
      startIndex,
      stopIndex
    });
  };

  const tagProducts = () => {
    onClose([...productSet]);
  };

  useEffect(() => {
    const container = document.getElementById('resize');
    function handleResize() {
      if (container) {
        container.style.height = `${window.innerHeight - 115}px`;
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    if (container) {
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }, 500);
    }
  });

  // eslint-disable-next-line react/no-multi-comp
  const renderCell = (el) => {
    const idx = el.rowIndex * 2 + el.columnIndex;
    if (idx >= productList.length) {
      return null;
    }
    const product = productList[idx];
    const [image] = product.images || [];
    return (
      <div key={el.key} onClick={tagProduct(product)} style={el.style}>
        <LightBlueTile className={styles.block}>
          <div className={styles.img} style={{ backgroundImage: `url(${image?.url})` }}>
            <div className={styles.checkBoxContainer}>
              {allowCheck && (
                <img src={productSet.has(product._id) ? checkIcon : uncheckIcon} alt="" />
              )}
            </div>
          </div>
          <div
            className={styles.title}
          >
            {product.title.length > 30 ? `${product.title.slice(0, 30)}...` : product.title}
          </div>
        </LightBlueTile>
      </div>
    );
  };

  return (
    <>
      {!isDesktop && (
        <Drawer
          anchor="bottom"
          open={true}
          onClose={() => onClose(initial)}
        >
          <div className={styles.container}>
            <Header onBack={() => onClose(initial)} title="Select Products" />
            <div className={styles.overflow} id="resize">
              {productList?.length > 0 ? (
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
                      cellRenderer={renderCell}
                      columnCount={2}
                      columnWidth={cellWidth}
                      height={height}
                      rowCount={Math.ceil(rowCount / 2)}
                      rowHeight={176}
                      style={{ display: 'flex' }}
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
            </div>
            <div className={styles.tagButtonContainer}>
              {allowCheck && (
                <Button
                  size="large"
                  fullWidth
                  bordered={false}
                  onClick={tagProducts}
                  label={btnText.length > 0 ? btnText : `Filter ${productSet.size} Products`}
                />
              )}
            </div>
          </div>
        </Drawer>
      )}
      {isDesktop && (
        <>
          <SideDrawer
            backButton={true}
            onClose={() => onClose(initial)}
            title="Select Products"
          >
            <div className={styles.container}>
              <div className={styles.overflow} id="resize">
                {productList?.length > 0 ? (
                  <InfiniteLoader
                    loadMoreRows={loadMore}
                    isRowLoaded={isLoaded}
                    rowCount={rowCount}
                    minimumBatchSize={10}
                  >
                    {({
                      onRowsRendered, registerChild
                    }) => (
                      <Grid
                        onSectionRendered={onSectionRendered(onRowsRendered)}
                        ref={registerChild}
                        cellRenderer={renderCell}
                        columnCount={2}
                        columnWidth={cellWidth}
                        height={height}
                        rowCount={Math.ceil(rowCount / 2)}
                        rowHeight={176}
                        style={{ display: 'flex' }}
                        width={window.screen.width} />
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
              <div className={styles.tagButtonContainer}>
                {allowCheck && (
                  <Button
                    size="large"
                    onClick={tagProducts}
                    label={btnText.length > 0 ? btnText : `Filter ${productSet.size} Products`} />
                )}
              </div>
            </div>
          </SideDrawer>
        </>
      )}
    </>
  );
}

ProductsDrawer.propTypes = {
  initial: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  filters: PropTypes.object,
  btnText: PropTypes.string,
  allowCheck: PropTypes.bool,
};

ProductsDrawer.defaultProps = {
  filters: {},
  initial: [],
  btnText: '',
  allowCheck: true,
};
