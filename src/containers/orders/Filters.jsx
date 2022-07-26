import React, { useState } from 'react';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import { useQueryParams } from 'hooks';
import { Button, Drawer } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import notAppliedIcon from 'assets/images/payments/filter.svg';
import appliedIcon from 'assets/images/payments/filterSel.svg';
import clearIcon from 'assets/images/payments/clear.svg';
import unchecked from 'assets/images/payments/unselect.svg';
import checked from 'assets/v2/products/checked.svg';
import { useDesktop } from 'contexts';
import { SideDrawer } from 'components/shared/SideDrawer';
import { Button as Btn } from 'phoenix-components';
import { orderShippingStatusLabels, orderStatusLabels, paymentStatusLabels } from './utils';
import styles from './Filters.module.css';

function Filters() {
  const [openOrderStatus, toggleOpenOrderStatus] = useState(false);
  const [openShippingStatus, toggleOpenShippingStatus] = useState(false);
  const [openPaymentStatus, toggleOpenPaymentStatus] = useState(false);
  const isDesktop = useDesktop();
  const params = useQueryParams();
  const history = useHistory();

  const isOrderStatusSelected = params.has('os');
  const isShippingStatusSelected = params.has('ss');
  const isPaymentStatusSelected = params.has('ps');

  // intermediate state to push query params on btn click
  const [ssToPush, toggleSsToPush] = useState([]);
  const [psToPush, togglePsToPush] = useState([]);
  const [osToPush, toggleOsToPush] = useState([]);

  // fetch applied filters

  const getItems = (type) => {
    if (type === 0 || type === 'os') {
      return osToPush;
    } if (type === 1 || type === 'ss') {
      return ssToPush;
    }
    return psToPush;
  };

  const getValues = (type) => {
    const value = params.get(type);
    const items = !isEmpty(value) && getItems(type).length === 0 ? value?.split(',') : getItems(type);
    return items;
  };

  const appliedFilters = () => {
    let osFilters = [];
    let ssFilters = [];
    let psFilters = [];
    if (isOrderStatusSelected) {
      osFilters = getValues('os');
    }
    if (isShippingStatusSelected) {
      ssFilters = getValues('ss');
    }
    if (isPaymentStatusSelected) {
      psFilters = getValues('ps');
    }
    return osFilters.concat(ssFilters).concat(psFilters);
  };

  // fetch applied filters with label

  const appliedFilterLabels = (value) => {
    const os = orderStatusLabels.find(x => x.value === value);
    if (os) {
      return os.label;
    }
    const ss = orderShippingStatusLabels.find(x => x.value === value);
    if (ss) {
      return ss.label;
    }
    const ps = paymentStatusLabels.find(x => x.value === value);
    if (ps) {
      return ps.label;
    }
    return value;
  };

  // removed selected filter

  const removeSelectedFilter = (item) => {
    if (isOrderStatusSelected) {
      const items = getValues('os').filter(x => x !== item);
      if (isEmpty(items)) {
        params.delete('os');
      } else {
        params.set('os', items);
      }
    }
    if (isShippingStatusSelected) {
      const items = getValues('ss').filter(x => x !== item);
      if (isEmpty(items)) {
        params.delete('ss');
      } else {
        params.set('ss', items);
      }
    }
    if (isPaymentStatusSelected) {
      const items = getValues('ps').filter(x => x !== item);
      if (isEmpty(items)) {
        params.delete('ps');
      } else {
        params.set('ps', items);
      }
    }
    history.push({
      search: params.toString(),
    });
  };

  // toggle / hide  modals

  const toggleModal = (type) => {
    if (type === 0) {
      toggleOpenOrderStatus(!openOrderStatus);
    }
    if (type === 1) {
      toggleOpenShippingStatus(!openShippingStatus);
    }
    if (type === 2) {
      toggleOpenPaymentStatus(!openPaymentStatus);
    }
  };

  // clear filters

  const clearFilters = () => {
    params.delete('ss');
    params.delete('ps');
    params.delete('os');
    history.push({
      search: params.toString(),
    });
  };

  const handleChange = (isSelected, value, mode) => {
    const selected = getValues(mode);
    if (isSelected) {
      const items = selected.concat(value);
      if (mode === 'os') {
        toggleOsToPush(items);
      } else if (mode === 'ps') {
        togglePsToPush(items);
      } else {
        toggleSsToPush(items);
      }
    } else {
      const items = selected.filter(x => x !== value);
      if (mode === 'os') {
        toggleOsToPush(items);
      } else if (mode === 'ps') {
        togglePsToPush(items);
      } else {
        toggleSsToPush(items);
      }
    }
  };

  const isSelected = (item, mode) => {
    const value = getValues(mode);
    return value.includes(item?.value);
  };

  const title = (type) => (type === 0 ? 'Order Status' : type === 1 ? 'Shipping Status' : 'Payment Status');

  const labels = (type) => (type === 0
    ? orderStatusLabels
    : (type === 1
      ? orderShippingStatusLabels
      : paymentStatusLabels
    ));

  const body = (type, param) => {
    const label = title(type);
    return (
      <div className={styles.content}>
        {!isDesktop && (
          <div className={styles.label}>
            <div className={styles.title}>
              <img className={styles.icon} src={appliedIcon} alt="" />
              {label}
            </div>
          </div>
        )}
        <ul className={styles.list}>
          {labels(type).map((x, i) => (
            <li
              className={cx(styles.item, isSelected(x, param) && styles.active)}
              key={i}
              role="presentation"
              onClick={() => handleChange(!isSelected(x, param), x.value, param)}
            >
              {x.label}
              {<img src={isSelected(x, param) ? checked : unchecked} className={styles.icon1} alt="" />}
            </li>
          ))}
        </ul>
        {!isDesktop && (
          <Btn
            onClick={() => {
              const items = getItems(type);
              if (items.length === 0) {
                params.delete(param);
              } else {
                params.set(param, items);
                history.push({
                  search: params.toString(),
                });
              }
              toggleModal(type);
            }}
            bordered={false}
            fullWidth
            label="APPLY" />
        )}
      </div>
    );
  };

  return (
    <>
      {!isDesktop && (
        <Drawer
          anchor="bottom"
          open={openOrderStatus}
          onClose={() => {
            toggleModal(0);
          }}
          PaperProps={{
            classes: {
              root: styles.paper,
            }
          }}
        >
          {body(0, 'os')}
        </Drawer>
      )}
      {isDesktop && openOrderStatus && (
        <SideDrawer
          backButton={true}
          onClick={() => {
            const items = getItems(0);
            const param = 'os';
            if (items.length === 0) {
              params.delete(param);
            } else {
              params.set(param, items);
              history.push({
                search: params.toString(),
              });
            }
            toggleModal(0);
          }}
          onClose={() => {
            toggleModal(0);
          }}
          button={true}
          btnLabel="Apply"
          title={title(0)}
        >
          {body(0, 'os')}
        </SideDrawer>
      )}
      {!isDesktop && (
        <Drawer
          anchor="bottom"
          open={openShippingStatus}
          onClose={() => {
            toggleModal(1);
          }}
          PaperProps={{
            classes: {
              root: styles.paper,
            }
          }}
        >
          {body(1, 'ss')}
        </Drawer>
      )}
      {isDesktop && openShippingStatus && (
        <SideDrawer
          backButton={true}
          onClick={() => {
            const items = getItems(1);
            const param = 'ss';
            if (items.length === 0) {
              params.delete(param);
            } else {
              params.set(param, items);
              history.push({
                search: params.toString(),
              });
            }
            toggleModal(1);
          }}
          onClose={() => {
            toggleModal(1);
          }}
          button={true}
          btnLabel="Apply"
          title={title(1)}
        >
          {body(1, 'ss')}
        </SideDrawer>
      )}
      {!isDesktop && (
        <Drawer
          anchor="bottom"
          open={openPaymentStatus}
          onClose={() => {
            toggleModal(2);
          }}
          PaperProps={{
            classes: {
              root: styles.paper,
            }
          }}
        >
          {body(2, 'ps')}
        </Drawer>
      )}
      {isDesktop && openPaymentStatus && (
        <SideDrawer
          backButton={true}
          onClick={() => {
            const items = getItems(2);
            const param = 'ps';
            if (items.length === 0) {
              params.delete(param);
            } else {
              params.set(param, items);
              history.push({
                search: params.toString(),
              });
            }
            toggleModal(2);
          }}
          onClose={() => {
            toggleModal(2);
          }}
          button={true}
          btnLabel="Apply"
          title={title(2)}
        >
          {body(2, 'ps')}
        </SideDrawer>
      )}
      <div className={styles.container}>
        <Button
          onClick={() => toggleModal(0)}
          className={cx(styles.button, {
            [styles.btnActive]: isOrderStatusSelected
          })}
          endIcon={<img src={isOrderStatusSelected ? appliedIcon : notAppliedIcon} alt="" />}
        >
          {title(0)}
        </Button>
        <Button
          onClick={() => toggleModal(1)}
          className={cx(styles.button, {
            [styles.btnActive]: isShippingStatusSelected
          })}
          endIcon={<img src={isShippingStatusSelected ? appliedIcon : notAppliedIcon} alt="" />}
        >
          {title(1)}
        </Button>
        <Button
          onClick={() => toggleModal(2)}
          className={cx(styles.button, {
            [styles.btnActive]: isPaymentStatusSelected
          })}
          endIcon={<img src={isPaymentStatusSelected ? appliedIcon : notAppliedIcon} alt="" />}
        >
          {title(2)}
        </Button>
      </div>
      {(isOrderStatusSelected
      || isShippingStatusSelected
      || isPaymentStatusSelected) && (
        <div className={styles.appliedSection}>
          <div
            onClick={clearFilters}
            className={cx(styles.button, styles.btnActive, styles.widthAuto)}
          >
            Clear Filters
          </div>
          {appliedFilters().map(x => (
            <div
              onClick={() => removeSelectedFilter(x)}
              className={cx(styles.button, styles.widthAuto, styles.padLeft)}
            >
              {appliedFilterLabels(x)}
              <img className={styles.delIcon} src={clearIcon} alt="delete" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

Filters.defaultProps = {
};

Filters.propTypes = {
};

export default Filters;
