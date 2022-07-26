import React, { useState, useEffect } from 'react';
import { useField } from 'formik';
import editIcon from 'assets/overview/editIcon.svg';
import PropTypes from 'prop-types';
// import { useToggle } from 'hooks/common';
// import { DistanceForm } from './DistanceForm';
import { SideDrawer } from 'components/shared/SideDrawer';
import { Becca } from 'api';
import { Button } from 'phoenix-components';
import _ from 'lodash';
import cx from 'classnames';
import { useDesktop } from 'contexts';
import { Drawer } from 'components/shared/Drawer';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import { useToggle } from 'hooks/common';
// import { DebugValues } from 'components/formik';
// import { useChargeConfig } from 'hooks/areasServed';
import pandaIcon from 'assets/images/areasServed/panda.svg';
import { useHistory } from 'react-router-dom';
import {
  useIsConditionalChargesEnabled
} from 'contexts/userContext';
import { useQueryParams } from 'hooks';
import { DeliveryByZone } from './DeliveryByZone';
import styles from './DistanceDelivery.module.css';
import { DeliveryType } from './utils';

export function DistanceDelivery({ onRefresh }) {
  const isDesktop = useDesktop();
  const history = useHistory();
  const [idx, setIdx] = useState(null);
  const [{ value: config }] = useField('config');
  const [createMoreZones, toggleMoreZones] = useToggle(false);
  const [viewConfig, toggleConfig] = useToggle(true);
  const [{ value: type }] = useField('chargeType');
  const params = useQueryParams();
  const isConditionalChargesEnabled = useIsConditionalChargesEnabled();

  // const [index, setIndex] = useState(null);
  const [zones, setZones] = useState({});

  const getAllZones = async () => {
    try {
      Loader.show();
      const data = await Becca.getAllZones();
      setZones(data);
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  useEffect(() => {
    getAllZones();
  }, []);

  if (type !== DeliveryType.AREA) {
    return null;
  }

  if (viewConfig) {
    return (
      <div className={styles.view}>
        <Button
          label="View Config"
          primary={false}
          size="medium"
          onClick={() => {
            if (!isConditionalChargesEnabled) {
              params.set('openPlans', 'generic');
              history.push({
                search: params.toString(),
              });
            } else {
              toggleConfig();
            }
          }}
          style={styles.button}
        />
        <div className={styles.spacer} />
        <Button
          label="Add Charges"
          primary={true}
          size="medium"
          onClick={() => {
            if (!isConditionalChargesEnabled) {
              params.set('openPlans', 'generic');
              history.push({
                search: params.toString(),
              });
            } else { toggleConfig(); toggleMoreZones(); }
          }}
          style={styles.button}
        />
      </div>
    );
  }

  if (createMoreZones) {
    return (
      <DeliveryByZone
        zones={zones}
        idx={idx}
        config={config}
        onClose={toggleMoreZones}
        setIdx={setIdx}
        onRefresh={onRefresh} />
    );
  }

  const Component = isDesktop ? SideDrawer : Drawer;
  const props = !isDesktop ? {
    title: 'Delivery Charge by Zone',
    onClose: toggleConfig,

  } : {
    className: styles.desktopContainer,
    backButton: true,
    title: 'Delivery Charge by Zone',
    onClose: toggleConfig,
  };

  const zonesWithChargeArray = config?.reduce((acc, obj) => [...acc, obj.value], []);

  const marshalConfig = zones?.data?.map(obj => {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.region?.length > 0) {
      const newObj = { ...obj };
      newObj.region = obj.region.filter(region => zonesWithChargeArray.includes(region._id));
      return newObj;
    }
    if (zonesWithChargeArray.includes(obj._id)) {
      return obj;
    }
    return null;
  }).filter(a => a);

  const getCharges = (idx, key) => config?.find(obj => obj.value === idx)?.config?.[key];

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Component {...props}>
      <div className={styles.container}>
        {marshalConfig?.map(zone => (
          <div className={styles.card}>
            <div className={cx(styles.flexbetween, styles.green)}>
              {_.capitalize(zone?.name)}
              {/* <Switch active={zone?.enabled} onChange={onUnlive(id)} /> */}
            </div>
            {zone?.region?.length > 0 ? (
              zone?.region?.map(s => (
                <div className={styles.cards}>
                  <div className={cx(styles.flexbetween, styles.paddingTop, styles.f12)}>
                    {s.name}
                    <img onClick={() => { setIdx(s._id); toggleMoreZones(); }} src={editIcon} alt="" />
                  </div>
                  <div className={cx(styles.flexbetween, styles.border, styles.f12)}>
                    <div className={styles.grid}>
                      Min order value
                      <div className={styles.spacer} />
                      <div className={styles.f14}>{getCharges(s._id, 'min')}</div>
                    </div>
                    <div className={styles.grid}>
                      Max order value
                      <div className={styles.spacer} />
                      <div className={styles.f14}>{getCharges(s._id, 'max')}</div>
                    </div>
                  </div>
                  <div className={cx(styles.flexbetween, styles.f14, styles.paddingTop)}>
                    Delivery Charge
                    <div>{getCharges(s._id, 'value')}</div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className={cx(styles.flexEnd, styles.paddingTop, styles.f12)}>
                  <img onClick={() => { setIdx(zone._id); toggleMoreZones(); }} src={editIcon} alt="" />
                </div>
                <div className={cx(styles.flexbetween, styles.border, styles.f12)}>
                  <div className={styles.grid}>
                    Min order value
                    <div className={styles.spacer} />
                    <div className={styles.f14}>{getCharges(zone._id, 'min')}</div>
                  </div>
                  <div className={styles.grid}>
                    Max order value
                    <div className={styles.spacer} />
                    <div className={styles.f14}>{getCharges(zone._id, 'max')}</div>
                  </div>
                </div>
                <div className={cx(styles.flexbetween, styles.f14, styles.paddingTop)}>
                  Delivery Charge
                  <div>{getCharges(zone._id, 'value')}</div>
                </div>
              </>
            )}
          </div>
        ))}
        {zones?.length === 0 && (
          <>
            <div className={styles.noData}>
              <img src={pandaIcon} alt="" />
            </div>
            <div className={styles.text}>
              No active zones in the areas you serve
            </div>
          </>
        )}
        {marshalConfig?.length === 0 && (
          <>
            <div className={styles.noData}>
              <img src={pandaIcon} alt="" />
            </div>
            {' '}
            <div className={styles.text}>
              No active charges for the active zones in the areas you serve
            </div>
          </>
        )}
        <Button
          label={zones?.length === 0 ? 'Add Zones'
            : (marshalConfig?.length === 0 ? 'Add Charges' : 'Add More Charges')}
          fullwidth={true}
          className={styles.saveButton}
          variant="primary"
          onClick={() => (zones?.length === 0 ? (history.push('/manage/areasServed')) : toggleMoreZones())} />
      </div>
    </Component>
  );
}

DistanceDelivery.propTypes = {
  onRefresh: PropTypes.func.isRequired,
};
