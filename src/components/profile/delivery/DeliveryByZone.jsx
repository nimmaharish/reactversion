import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Clickable, FormikInput } from 'phoenix-components';
import { useToggle } from 'hooks/common';
import { useShop } from 'contexts';
import { Drawer } from 'components/shared/Drawer';
import { useDesktop } from 'contexts';
import rightArrowIcon from 'assets/images/areasServed/rightArrow.svg';
import { Button } from 'phoenix-components';
import editIcon from 'assets/images/areasServed/edit.svg';
import cx from 'classnames';
import { Becca } from 'api';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { SideDrawer } from 'components/shared/SideDrawer';
import { useHistory } from 'react-router-dom';
// import { DebugValues } from 'components/formik';
import pandaIcon from 'assets/images/areasServed/panda.svg';
import { DeliveryByZoneForm } from './DeliveryByZoneForm';
import { getChargeConfig } from './utils';
import styles from './DeliveryByZone.module.css';

export function DeliveryByZone({
  zones, idx, config, onClose, setIdx, onRefresh
}) {
  const history = useHistory();
  const shop = useShop();
  const isDesktop = useDesktop();
  const [showZones, toggleZones] = useToggle();
  const [selectedZones, setSelectedZones] = useState([]);
  //   const isConditionalChargesEnabled = useIsConditionalChargesEnabled();

  const onSubmit = async (values) => {
    try {
      Loader.show();
      const marshalData = selectedZones.map(zone => ({
        value: zone._id,
        enabled: true,
        config: values,
        type: zone?.type || 'pincodeGroup'
      }));
      if (idx) {
        config.find(s => s.value === idx).config = values;
      }
      await Becca.updateChargeConfig({ config: [...marshalData, ...config], chargeType: 'area' });
      SnackBar.show('successfully Updated');
      onRefresh();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
      onClose();
    }
  };

  const Component = isDesktop ? SideDrawer : Drawer;
  const props = !isDesktop ? {
    title: 'Delivery Charge by Zone',
    onClose: () => {
      setIdx(null);
      onClose();
    }
  } : {
    title: 'Delivery Charge by Zone',
    backButton: true,
    onClose: () => {
      setIdx(null);
      onClose();
    }
  };

  const onSave = (values) => {
    setSelectedZones(values);
    toggleZones();
  };

  const getLabel = () => {
    if (idx) {
      const label = zones?.data?.map(obj => obj?.region?.find(s => s._id === idx))?.filter(a => a)?.[0]?.name
      || zones?.data?.find(zone => zone._id === idx)?.name;
      return label;
    }
    if (selectedZones?.length) {
      return selectedZones?.reduce((acc, obj) => [...acc, obj.name], []).toString();
    }
    return 'Select Zone';
  };

  const zonesWithChargeArray = config?.reduce((acc, obj) => [...acc, obj.value], []);

  const marshalConfig = zones?.data?.map(obj => {
    // eslint-disable-next-line no-prototype-builtins
    if (obj?.region?.length > 0) {
      const newObj = { ...obj };
      newObj.region = obj?.region?.filter(region => !zonesWithChargeArray.includes(region._id));
      return newObj;
    }
    if (!zonesWithChargeArray.includes(obj._id)) {
      return obj;
    }
    return null;
  }).filter(s => s);

  const isZonesAvailable = marshalConfig && marshalConfig?.length > 0;

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Component {...props}>
      <div className={styles.container}>
        {!idx && !isZonesAvailable && (
          <>
            <div className={styles.noData}>
              <img src={pandaIcon} alt="" />
            </div>
            <div className={styles.text}>
              No active zones in the areas you serve
            </div>
          </>
        )}
        {(isZonesAvailable || idx) && (
          <div className={styles.card}>
            <Formik
              initialValues={getChargeConfig(config, idx)}
              onSubmit={onSubmit}
            >
              {({ submitForm }) => (
                <>
                  <div>
                    <div className={styles.paddingBottom}>
                      <FormikInput
                        name="min"
                        label="Minimum order value"
                        type="number"
                        placeholder={`${shop.currency} 2000`}
                      />
                    </div>
                    <div className={styles.paddingBottom}>
                      <FormikInput
                        name="max"
                        label="Max order value"
                        type="number"
                        placeholder={`${shop.currency} 5000`}
                      />
                    </div>
                    <Clickable fullWidth onClick={idx ? null : toggleZones}>
                      <div className={cx(styles.paddingBottom, styles.select)}>
                        {getLabel()}
                        <div>
                          {selectedZones?.length > 0 && <img src={editIcon} alt="" /> }
                          <img src={rightArrowIcon} className={styles.icon} alt="" />
                        </div>
                      </div>
                    </Clickable>
                    <div className={styles.paddingBottom}>
                      <FormikInput
                        name="value"
                        label="Delivery Charge"
                        type="number"
                        placeholder={`${shop.currency} 200`}
                      />
                    </div>
                  </div>
                  <Button
                    label={!isZonesAvailable && !idx ? 'Add Zones' : 'Save'}
                    fullwidth={true}
                    className={styles.saveButton}
                    variant="primary"
                    onClick={() => (!isZonesAvailable && !idx
                      ? history.push('/manage/areasServed') : submitForm())} />

                  {showZones && (
                    <DeliveryByZoneForm
                      onClose={toggleZones}
                      zones={marshalConfig}
                      onSave={(val) => onSave(val)}
                      selectedZones={selectedZones} />
                  )}
                </>
              )}
            </Formik>
          </div>
        )}
      </div>
    </Component>
  );
}

DeliveryByZone.propTypes = {
  zones: PropTypes.array.isRequired,
  idx: PropTypes.number.isRequired,
  config: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  setIdx: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired
};
