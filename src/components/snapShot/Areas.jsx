import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import _ from 'lodash';
import Loader from 'services/loader';
import { useChargeConfig } from 'hooks/areasServed';
import { Becca } from 'api';
import editIcon from 'assets/overview/edit.svg';
import pandaIcon from 'assets/images/areasServed/panda.svg';
import Accordion from './Accordion';
import styles from './Areas.module.css';

function Areas() {
  const history = useHistory();
  const [zones, setZones] = useState({});
  const [chargeConfig, ,, loading] = useChargeConfig();
  const config = chargeConfig?.config;

  if (loading) {
    return <Loader />;
  }

  const getAllZones = async () => {
    try {
      Loader.show();
      const data = await Becca.getAllZones();
      setZones(data);
    } finally {
      Loader.hide();
    }
  };
  useEffect(() => {
    getAllZones();
  }, []);
  const zonesWithChargeArray = config?.reduce((acc, obj) => [...acc, obj.value], []);

  const marshalConfig = zones?.data?.map(obj => {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.region?.length > 0) {
      const newObj = { ...obj };
      newObj.region = obj.region.filter(region => zonesWithChargeArray?.includes(region._id));
      return newObj;
    }
    if (zonesWithChargeArray?.includes(obj._id)) {
      return obj;
    }
    return null;
  }).filter(a => a);

  const getCharges = (idx, key) => config?.find(obj => obj.value === idx)?.config?.[key];

  return (
    <>
      <Accordion
        label="Areas Served"
        labelHelper="View Areas Served"
      >
        <div className={styles.padded}>
          <div
            className={styles.top}
            onClick={() => {
              history.push('/manage/areasServed');
            }}
          >
            <div className={styles.head1}>
              Enabled Areas
            </div>
            <img src={editIcon} alt="snapshot" />
          </div>
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
        </div>
      </Accordion>
    </>
  );
}

export default Areas;
