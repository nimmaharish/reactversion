import React, { useState } from 'react';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import { Button, Drawer } from '@material-ui/core';
import { Button as Btn } from 'phoenix-components';
import notAppliedIcon from 'assets/images/payments/filter.svg';
import appliedIcon from 'assets/images/payments/filterSel.svg';
import clearIcon from 'assets/images/payments/clear.svg';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import {
  usePaymentRules
} from 'contexts/userContext';
import { useDesktop } from 'contexts';
import unchecked from 'assets/images/payments/unselect.svg';
import checked from 'assets/v2/products/checked.svg';
import { SideDrawer } from 'components/shared/SideDrawer';
import { psFilterList } from './utils';
import styles from './Filters.module.css';

function Filters() {
  const [openPm, togglePm] = useState(null);
  const [openPs, togglePs] = useState(null);
  const paymentRules = usePaymentRules(true);
  const history = useHistory();
  const params = useQueryParams();
  const isDesktop = useDesktop();
  const isModeSelected = params.has('pm');
  const isStatusSelected = params.has('ps');
  // intermediate state to push query params on btn click
  const [pmToPush, togglePmToPush] = useState([]);
  const [psToPush, togglePsToPush] = useState([]);

  const appliedFilters = () => {
    let pmFilters = [];
    let psFilters = [];
    if (isModeSelected) {
      const value = params.get('pm');
      pmFilters = !isEmpty(value) ? value?.split(',') : [];
    }
    const value = params.get('ps');
    psFilters = !isEmpty(value) ? value?.split(',') : [];
    return pmFilters.concat(psFilters);
  };

  const all = paymentRules.map(x => ({
    label: x.name,
    value: x.value
  }));

  const appliedFilterLabels = (value) => {
    const pm = all.find(x => x.value === value);
    if (pm) {
      return pm.label;
    }
    const ps = psFilterList.find(x => x.value === value);
    if (ps) {
      return ps.label;
    }
    return value;
  };

  const openPmDrawer = (e) => {
    togglePm(e.currentTarget);
  };

  const closePmDrawer = () => {
    togglePm(false);
  };

  const openPsDrawer = (e) => {
    togglePs(e.currentTarget);
  };

  const closePsDrawer = () => {
    togglePs(false);
  };

  const clearFilters = () => {
    params.delete('pm');
    params.delete('ps');
    togglePsToPush([]);
    togglePmToPush([]);
    history.push({
      search: params.toString(),
    });
  };

  const getValues = (type) => {
    const value = params.get(type);
    const values = type === 'pm' ? pmToPush : psToPush;
    const items = value?.split(',')?.filter(x => x.length > 0) || values;
    return items;
  };

  const removeSelectedFilter = (item) => {
    if (isModeSelected) {
      const value = params.get('pm');
      const items = value?.split(',')?.filter(x => x !== item && x.length > 0) || [];
      if (isEmpty(items)) {
        params.delete('pm');
      } else {
        params.set('pm', items);
      }
      history.push({
        search: params.toString(),
      });
      togglePmToPush(items);
    }
    if (isStatusSelected) {
      const value = params.get('ps');
      const items = value?.split(',')?.filter(x => x !== item && x.length > 0) || [];
      if (isEmpty(items)) {
        params.delete('ps');
      } else {
        params.set('ps', items);
      }
      togglePsToPush(items);
    }
    history.push({
      search: params.toString(),
    });
  };

  const handleChange = (isSelected, value, mode) => {
    const selected = getValues(mode);
    if (isSelected) {
      const items = selected.concat(value);
      if (mode === 'pm') {
        togglePmToPush(items);
      }
      togglePsToPush(items);
    } else {
      const items = selected.filter(x => x !== value);
      if (mode === 'pm') {
        togglePmToPush(items);
      }
      togglePsToPush(items);
    }
  };

  const isSelected = (item, mode) => {
    const value = params.get(mode);
    const values = mode === 'pm' ? pmToPush : psToPush;
    const items = value?.split(',') || [];
    return items.indexOf(item?.value) > -1 || values.includes(item?.value);
  };

  const pmBody = () => (
    <div className={styles.content}>
      {!isDesktop && (
        <div className={styles.label}>
          <div>
            Payment Mode
          </div>
        </div>
      )}
      <ul className={styles.list}>
        {all.map((x, i) => (
          <li
            className={cx(styles.item, isSelected(x, 'pm') && styles.active)}
            key={i}
            role="presentation"
            onClick={() => handleChange(!isSelected(x, 'pm'), x.value, 'pm')}
          >
            {x.label}
            <img src={isSelected(x, 'pm') ? checked : unchecked} className={styles.icon} alt="" />
          </li>
        ))}
      </ul>
      {!isDesktop && (
        <Btn
          onClick={() => {
            if (pmToPush.length === 0) {
              params.delete('pm');
            } else {
              params.set('pm', pmToPush);
              history.push({
                search: params.toString(),
              });
            }
            closePmDrawer();
          }}
          bordered={false}
          fullWidth
          label="APPLY" />
      )}
    </div>
  );

  const psBody = () => (
    <div className={styles.content}>
      {!isDesktop && (
        <div className={styles.label}>
          <div>
            Payment Status
          </div>
        </div>
      )}
      <ul className={styles.list}>
        {psFilterList.map((x, i) => (
          <li
            className={cx(styles.item, isSelected(x, 'ps') && styles.active)}
            key={i}
            role="presentation"
            onClick={() => handleChange(!isSelected(x, 'ps'), x.value, 'ps')}
          >
            {x.label}
            <img src={isSelected(x, 'ps') ? checked : unchecked} className={styles.icon} alt="" />
          </li>
        ))}
      </ul>
      {!isDesktop && (
        <Btn
          onClick={() => {
            if (psToPush.length === 0) {
              params.delete('ps');
            } else {
              params.set('ps', psToPush);
              history.push({
                search: params.toString(),
              });
            }
            closePsDrawer();
          }}
          bordered={false}
          fullWidth
          label="APPLY"
        />
      )}
    </div>
  );

  return (
    <>
      {isDesktop && !!openPm && (
        <SideDrawer
          backButton={true}
          onClick={() => {
            if (pmToPush.length === 0) {
              params.delete('pm');
            } else {
              params.set('pm', pmToPush);
              history.push({
                search: params.toString(),
              });
            }
            closePmDrawer();
          }}
          onClose={() => {
            closePmDrawer();
          }}
          button={true}
          btnLabel="Apply"
          title="Payment Mode"
        >
          {pmBody()}
        </SideDrawer>
      )}
      {!isDesktop && (
        <Drawer
          anchor="bottom"
          open={!!openPm}
          onClose={() => {
            closePmDrawer();
          }}
          PaperProps={{
            classes: {
              root: styles.paper,
            }
          }}
        >
          {pmBody()}
        </Drawer>
      )}
      {isDesktop && !!openPs && (
        <SideDrawer
          backButton={true}
          onClick={() => {
            if (psToPush.length === 0) {
              params.delete('ps');
            } else {
              params.set('ps', psToPush);
              history.push({
                search: params.toString(),
              });
            }
            closePsDrawer();
          }}
          onClose={() => {
            closePsDrawer();
          }}
          button={true}
          btnLabel="Apply"
          title="Payment Status"
        >
          {psBody()}
        </SideDrawer>
      )}
      {!isDesktop && (
        <Drawer
          anchor="bottom"
          open={!!openPs}
          onClose={() => {
            closePsDrawer();
          }}
          PaperProps={{
            classes: {
              root: styles.paper,
            }
          }}
        >
          {psBody()}
        </Drawer>
      )}
      <div className={styles.container}>
        <Button
          onClick={openPmDrawer}
          className={cx(styles.button, {
            [styles.btnActive]: isModeSelected
          })}
        >
          Payment Mode
        </Button>
        <div className={styles.spacer}></div>
        <Button
          onClick={openPsDrawer}
          className={cx(styles.button, {
            [styles.btnActive]: isStatusSelected
          })}
          endIcon={<img src={isStatusSelected ? appliedIcon : notAppliedIcon} alt="" />}
        >
          Payment Status
        </Button>
      </div>
      {(isModeSelected || isStatusSelected) && (
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
              className={cx(styles.button, styles.widthAuto, styles.appliedbtn)}
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
