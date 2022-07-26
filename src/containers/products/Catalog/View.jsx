import React, { useState } from 'react';
import { useInfiniteProducts } from 'hooks';
import { useHistory, useParams } from 'react-router-dom';
import { Loading } from 'components/shared/Loading';
import { useDesktop } from 'contexts';
import AddIcon from 'assets/images/products/catalog/add.svg';
import ShareIcon from 'assets/images/products/catalog/share.svg';
// import { SideDrawer } from 'components/shared/SideDrawer';
import EditIcon from 'assets/images/products/catalog/edit.svg';
import SuccessIcon from 'assets/images/products/catalog/success.svg';
import {
  useCustomDomain, useIsOnCustomDomain, useRefreshShop, useShop
} from 'contexts/userContext';
import {
  Avatar,
} from '@material-ui/core';
import ButtonComponent from 'containers/profile/ButtonComponent';
import { Grid, InfiniteLoader } from 'react-virtualized';
import { ProductsDrawer } from 'components/shared/ProductsDrawer';
import Alert from 'components/shared/alert/Alert';
import { useToggle } from 'hooks/common';
import SnackBar from 'services/snackbar';
import { Becca } from 'api/index';
import { get } from 'lodash';
import Loader from 'services/loader';
import { shareCatalog } from 'utils/share';
import { share } from 'utils';
import { Switch, Button as Btn } from 'phoenix-components';
import styles from './View.module.css';
import { ProductCard } from './Card';
import { Add } from './Add';

function View() {
  const { catalogs = [], slug, name } = useShop();
  const refresh = useRefreshShop();
  const [add, setAdd] = useToggle();
  const [edit, setEdit] = useToggle();
  const isDesktop = useDesktop();
  const [showAlert, setShowAlert] = useToggle();
  const { id } = useParams();
  const catalog = catalogs.find(x => x._id === id);
  const [caption, setCaption] = useState(catalog?.caption || '');
  const history = useHistory();
  const isCustomDomain = useIsOnCustomDomain();
  const domain = useCustomDomain();

  const filters = {
    catalogs: { $in: [catalog?.caption] },
    status: {
      $ne: 'deleted',
    },
  };

  const [products, loadMore, hasMore, loading] = useInfiniteProducts(filters, { createdAt: -1 });

  const isEmpty = products.length === 0 && loading;

  const [url, setUrl] = useState(catalog?.url || '');

  const getProductImage = get(products, '[0].images.[0].url', catalog?.url || '');

  const rowCount = hasMore ? 10000 : products.length;

  const isLoaded = i => !!products[i];

  const height = isDesktop ? window.screen.height - 109 - 59 : window.screen.height - 109 - 36 - 45 - 16;
  const cellWidth = isDesktop ? (window.screen.width - 272 - 32) / 4 : (window.screen.width - 32) / 2;

  const status = (catalog?.status || 'live');

  const onClose = async (ids = []) => {
    if (ids.length === 0) {
      refresh();
      setAdd();
      return;
    }
    try {
      Loader.show();
      await Becca.addProductsToCatalog({ _id: id, skuIds: ids });
      setShowAlert();
    } catch (e) {
      SnackBar.show('something went wrong, try again', 'error');
    } finally {
      Loader.hide();
    }
  };

  const onAlertClose = () => {
    setAdd();
    refresh();
  };

  const updateShop = async (status) => {
    if (caption.length === 0) {
      SnackBar.show('Please Add Name', 'error');
      return;
    }
    try {
      await Becca.updateCatalog({
        url: url || getProductImage,
        caption,
        _id: id,
        status
      });
      SnackBar.show('Collection Updated Successfully');
      refresh();
      if (!status) {
        history.goBack();
      }
      setUrl('');
      setCaption('');
    } catch (exception) {
      SnackBar.showError(exception);
    }
  };

  if (isEmpty) {
    return <Loading />;
  }

  // eslint-disable-next-line react/no-multi-comp
  const renderCell = (el) => {
    const idx = el.rowIndex * 2 + el.columnIndex;
    if (idx >= products.length) {
      return null;
    }
    const product = products[idx];
    return (
      <div key={el.key} style={el.style}>
        <ProductCard product={product} refresh={refresh} />
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

  const getSign = () => {
    if (hasMore) {
      if (products.length > 15) {
        return '+';
      }
      return '';
    }
    return '';
  };

  const shareToUser = e => {
    e.stopPropagation();
    e.preventDefault();
    share(`Hello

We are now selling online. Please visit my WINDO Shop Catalog at
${shareCatalog(catalog?.caption, slug, isCustomDomain, domain)} to buy my products.

Thank you
${name}`);
  };

  return (
    <>
      {!isDesktop && (
        <div className={styles.paper}>
          <div className={styles.catalogBlock}>
            <Avatar className={styles.img} variant="rounded" src={url || getProductImage}>
              {catalog?.caption ? catalog?.caption?.charAt(0) : '#'}
            </Avatar>
            <div className={styles.middle}>
              <div className={styles.name}>{catalog?.caption}</div>
              <div className={styles.shareFlex}>
                <span onClick={shareToUser}>
                  <img className={styles.shareImg} src={ShareIcon} alt="" />
                  <span> Share Collection</span>
                </span>
                <Switch
                  active={status === 'live'}
                  onChange={() => updateShop(status === 'live' ? 'unlive' : 'live')}
                  value={status === 'live'}
                />
              </div>
            </div>
            <img
              className={styles.edit}
              src={EditIcon}
              onClick={setEdit}
              alt="" />
          </div>
          <div className={styles.container}>
            <div className="flexBetween marginSTopBottom">
              <ButtonComponent
                style={styles.catLabel}
                text="Total Products"
                color="secondary"
                onClick={() => {}}
                endIcon={(
                  <span className={styles.catCount}>
                    {`${products.length}${getSign()}`}
                    {' '}
                  </span>
                )}
              />
              <Btn
                className={styles.catLabel1}
                onClick={setAdd}
                label="Add Products"
                size="small"
                primary={false}
                startIcon={AddIcon}
              />
            </div>
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
                  rowCount={Math.ceil(rowCount / (isDesktop ? 4 : 2))}
                  rowHeight={172}
                  style={{ display: 'flex' }}
                  width={window.screen.width}
                />
              )}
            </InfiniteLoader>
            {add && (
              <ProductsDrawer
                filters={{ catalogs: { $nin: [catalog?.caption] } }}
                initial={[]}
                title="Add Products"
                btnText="Add"
                onClose={onClose}
              />
            )}
            {edit && (
              <Add
                url={url || getProductImage}
                caption={caption}
                setUrl={setUrl}
                catalogs={catalogs}
                setCaption={setCaption}
                updateShop={updateShop}
                onBack={setEdit}
                type="update"
              />
            )}
          </div>
          {showAlert && (
            <Alert
              text="Products added Successfully"
              btnText="Ok"
              icon={SuccessIcon}
              onClick={onAlertClose}
            />
          )}
        </div>
      )}
      {isDesktop && (
        <div className={styles.paper}>
          <div className={styles.catalogBlock1}>
            <Avatar className={styles.img} variant="rounded" src={url || getProductImage}>
              {catalog?.caption ? catalog?.caption?.charAt(0) : '#'}
            </Avatar>
            <div className={styles.middle}>
              <div className={styles.name}>{catalog?.caption}</div>
              <div className={styles.shareFlex}>
                <span onClick={shareToUser}>
                  <img className={styles.shareImg} src={ShareIcon} alt="" />
                  <span> Share Collection</span>
                </span>
                <Switch
                  active={status === 'live'}
                  onChange={() => updateShop(status === 'live' ? 'unlive' : 'live')}
                  value={status === 'live'}
                />
              </div>
            </div>
            <img
              className={styles.edit}
              src={EditIcon}
              onClick={setEdit}
              alt="" />
          </div>
          <div className={styles.container}>
            <div className={styles.margin}>
              <ButtonComponent
                style={styles.catLabelDesk}
                text="Total Products"
                color="secondary"
                onClick={() => {}}
                endIcon={(
                  <span className={styles.catCount}>
                    {`${products.length}${getSign()}`}
                    {' '}
                  </span>
                )}
              />
              <Btn
                className={styles.catLabelDesk1}
                onClick={setAdd}
                label="Add Products"
                size="small"
                primary={false}
                startIcon={AddIcon}
              />
            </div>
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
                  columnCount={4}
                  columnWidth={cellWidth}
                  height={height}
                  rowCount={Math.ceil(rowCount / (isDesktop ? 4 : 2))}
                  rowHeight={172}
                  style={{ display: 'flex' }}
                  width={window.screen.width}
                />
              )}
            </InfiniteLoader>
            {add && (
              <ProductsDrawer
                filters={{ catalogs: { $nin: [catalog?.caption] } }}
                initial={[]}
                title="Add Products"
                btnText="Add"
                onClose={onClose}
              />
            )}
            {edit && (
              <Add
                url={url || getProductImage}
                caption={caption}
                setUrl={setUrl}
                catalogs={catalogs}
                setCaption={setCaption}
                updateShop={updateShop}
                onBack={setEdit}
                type="update" />
            )}
          </div>
          {showAlert && (
            <Alert
              text="Whoopee, product added successfully!"
              btnText="Ok"
              icon={SuccessIcon}
              onClick={onAlertClose}
            />
          )}
        </div>
      )}
    </>
  );
}

export default View;
