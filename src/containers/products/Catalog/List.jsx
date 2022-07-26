import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Avatar, } from '@material-ui/core';
import AddIcon from 'assets/images/products/catalog/add.svg';
import checkedIcon from 'assets/images/products/catalog/checked.svg';
import emptyIcon from 'assets/images/products/catalog/empty.svg';
import cx from 'classnames';
import { Button as Btn, Search, Clickable } from 'phoenix-components';
import { Becca } from 'api/index';
import { useRefreshShop } from 'contexts';
import { useToggle } from 'hooks/common';
import { useQueryParams } from 'hooks';
import { Picker } from 'components/shared/dateRangePicker/Picker';
import { useDesktop } from 'contexts';
import ButtonComponent from 'containers/profile/ButtonComponent';
import PropTypes from 'prop-types';
import SnackBar from 'services/snackbar';
import Add1Icon from 'assets/images/products/create/add1.svg';
import Loader from 'services/loader';
// import { Loading } from 'components/shared/Loading';
import EventManager from 'utils/events';
import { customDateFilters, dateFilters, getText } from 'containers/utils';
import { Add } from './Add';
import styles from './List.module.css';

const colors = ['#FFF0E8', '#EDEDFF', '#E6FBFF', '#FFE6FB', '#FFC8C8', '#E6FFF3'];

function List({
  from,
  selected,
  onSelect,
  onHide
}) {
  const [query, setQuery] = useState('');
  const contextShopRefresh = useRefreshShop();
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const isDesktop = useDesktop();
  const params = useQueryParams();
  const create = params.get('created') || 'all';
  const history = useHistory();
  const [openDrawer, setOpenDrawer] = useToggle(false);
  const [catalogs, setCatalogs] = useState([]);
  const [dateRangeFilters, setDateRangeFilters] = useState({
    from: null,
    to: null
  });
  const isEmptyFrom = dateRangeFilters.from === null;
  const isEmptyTo = dateRangeFilters.to === null;

  useEffect(() => {
    Loader.show();
    Becca.getCatalogStats().then(x => {
      setCatalogs(x);
      Loader.hide();
    }).catch((e) => {
      SnackBar.showError(e);
      Loader.hide();
    });
  }, [setCatalogs]);

  const refresh = async () => {
    setCatalogs(await Becca.getCatalogStats());
  };

  // if (!shop) {
  //   return (
  //     <Loading />
  //   );
  // }
  const dateTimeFilters = () => {
    if (create !== 'custom') {
      return dateFilters[create];
    }
    if (isEmptyFrom || isEmptyTo) {
      return {};
    }
    return customDateFilters(dateRangeFilters.from, dateRangeFilters.to);
  };

  const onClick = (value, id) => {
    if (from === 'product') {
      if (selected.includes(value)) {
        const filtered = selected.filter(x => x !== value);
        onSelect(filtered);
        return;
      }
      onSelect(selected.concat(value));
      return;
    }
    contextShopRefresh();
    history.push({
      pathname: `/products/catalog/${id}`
    });
  };

  const goBack = () => {
    setOpenDrawer();
  };

  const updateShop = async () => {
    if (caption.length === 0) {
      SnackBar.show('Please Add Name', 'error');
      return;
    }
    try {
      await Becca.updateShop({
        catalogs: [...catalogs, {
          url,
          caption: caption.trim()
        }]
      });
      SnackBar.show('Catalog created successfully', 'success', 10000);
      EventManager.emitEvent('catalog_added', {
        name: caption.trim(),
      });
      await refresh();
      dateTimeFilters();
      goBack();
      setUrl('');
      setCaption('');
    } catch (exception) {
      SnackBar.showError(exception);
    }
  };
  const getCatalogs = () => {
    if (query.length === 0) {
      return catalogs;
    }
    return catalogs.filter(x => x.caption?.toLowerCase()
      .indexOf(query?.toLowerCase()) > -1);
  };

  const getClass = (value) => {
    if (from === 'product') {
      if (selected.includes(value?.caption)) {
        return cx(styles.tile, styles.active);
      }
      return cx(styles.tile);
    }
    return cx(styles.tile);
  };

  return (
    <>
      {!isDesktop
        && (
          <div className={styles.container}>
            {openDrawer && (
              <Add
                url={url}
                caption={caption}
                setUrl={setUrl}
                catalogs={catalogs}
                setCaption={setCaption}
                updateShop={updateShop}
                onBack={goBack}
                type="create"
              />
            )}
            <div className={styles.buttons}>
              <ButtonComponent
                style={styles.catLabel}
                text="Total Collections"
                color="secondary"
                onClick={() => {
                }}
                endIcon={(
                  <span className={styles.catCount}>
                    {catalogs?.length || 0}
                  </span>
                )}
              />
              <Btn
                startIcon={AddIcon}
                label="Add Collections"
                onClick={setOpenDrawer}
                size="small"
              />
            </div>
            {catalogs?.length > 0 && (
              <div className={styles.search}>
                <Search
                  value={query}
                  placeholder="Search for collection"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            )}
            <div className={styles.section}>
              {getCatalogs()
                ?.map((x, i) => (
                  <div
                    style={{ backgroundColor: colors[i % colors.length] }}
                    className={getClass(x, i)}
                    onClick={() => onClick(x?.caption, x?._id)}
                  >
                    <Avatar className={cx(styles.avatar)} variant="rounded" alt="Remy Sharp" src={x?.url}>
                      {x?.caption ? x.caption.charAt(0) : '#'}
                    </Avatar>
                    <div className={styles.card}>
                      <div className={styles.name}>{x?.caption ? x.caption : 'un named'}</div>
                      <div className={styles.skuCount}>{`${x?.skuCount} Products`}</div>
                    </div>
                    {selected.includes(x?.caption) && (
                      <img src={checkedIcon} className={styles.img} alt="" />
                    )}
                  </div>
                ))}
              {getCatalogs()?.length === 0 && (
                <div className={styles.empty}>
                  <img src={emptyIcon} alt="" />
                  <div className={styles.emptyText}>
                    You haven't curated any Collections yet!
                  </div>
                </div>
              )}
              <Clickable
                className={styles.fab}
                onClick={setOpenDrawer}>
                <img src={Add1Icon} alt="" />
              </Clickable>
            </div>
          </div>
        )}
      {isDesktop
        && (
          <div className={styles.container}>
            {openDrawer && (
              <Add
                url={url}
                caption={caption}
                setUrl={setUrl}
                catalogs={catalogs}
                setCaption={setCaption}
                updateShop={updateShop}
                onBack={goBack}
                type="create"
              />
            )}
            <div className={styles.buttons}>
              <ButtonComponent
                style={styles.catLabel}
                text="Total Collections"
                color="secondary"
                onClick={() => {
                }}
                endIcon={(
                  <span className={styles.catCount}>
                    {catalogs?.length || 0}
                  </span>
                )}
              />
              <Btn
                startIcon={AddIcon}
                primary={false}
                label="Add Collections"
                onClick={setOpenDrawer}
                size="medium"
              />
            </div>
            {catalogs?.length > 0 && (
              <>
                {!onHide && (
                  <div className={styles.pickerContainer}>
                    <div className={styles.picker}>
                      <div>
                        <Picker
                          label={getText(dateRangeFilters)}
                          onSelect={(e) => {
                            setDateRangeFilters(e);
                            params.set('created', 'custom');
                            history.push({ search: params.toString() });
                            refresh();
                          }}
                        />
                      </div>
                    </div>
                    <div className={styles.search1}>
                      <Search
                        value={query}
                        placeholder="Search for collection"
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </div>
                    <Btn
                      label="Search "
                    />
                  </div>
                )}
                {onHide && (
                  <div className={styles.pickerContainer1}>
                    <div className={styles.search1}>
                      <Search
                        value={query}
                        placeholder="Search for collection"
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </div>
                    <Btn
                      label="Search "
                    />
                  </div>
                )}
              </>
            )}
            <div className={styles.sectionContainer}>
              <div className={styles.section}>
                {getCatalogs()
                  ?.map((x, i) => (
                    <div
                      style={{ backgroundColor: colors[i % colors.length] }}
                      className={getClass(x, i)}
                      onClick={() => onClick(x?.caption, x?._id)}
                    >
                      <Avatar className={cx(styles.avatar)} variant="rounded" alt="Remy Sharp" src={x?.url}>
                        {x?.caption ? x.caption.charAt(0) : '#'}
                      </Avatar>
                      <div className={styles.card}>
                        <div className={styles.name}>{x?.caption ? x.caption : 'un named'}</div>
                        <div className={styles.skuCount}>{`${x?.skuCount} Products`}</div>
                      </div>
                      {selected.includes(x?.caption) && (
                        <img src={checkedIcon} className={styles.img} alt="" />
                      )}
                    </div>
                  ))}
                {getCatalogs()?.length === 0 && (
                  <div className={styles.empty}>
                    <img src={emptyIcon} alt="" />
                    <div className={styles.emptyText}>
                      You haven't curated any Collections yet!
                    </div>
                  </div>
                )}
                <Clickable
                  className={styles.fab}
                  onClick={setOpenDrawer}>
                  <img src={Add1Icon} alt="" />
                </Clickable>
              </div>
            </div>
          </div>
        )}
    </>
  );
}

List.defaultProps = {
  from: 'grid',
  selected: [],
  onSelect: null,
  onHide: null,
};

List.propTypes = {
  from: PropTypes.string,
  selected: PropTypes.array,
  onSelect: PropTypes.func,
  onHide: PropTypes.bool
};

export default List;
