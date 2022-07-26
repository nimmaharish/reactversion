import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Drawer } from 'components/shared/Drawer';

import { useDesktop } from 'contexts';

import {
  Clickable
} from 'phoenix-components';
import cx from 'classnames';
import checkedCheckBox from 'assets/images/areasServed/checkedCheckBox.svg';
import uncheckedCheckBox from 'assets/images/areasServed/uncheckedCheckBox.svg';
import checkedIcon from 'assets/images/areasServed/checked.svg';
import uncheckedIcon from 'assets/images/areasServed/unchecked.svg';
import { Button } from 'phoenix-components';
import _ from 'lodash';
import { SideDrawer } from 'components/shared/SideDrawer';
import styles from './DeliveryByZoneForm.module.css';

export function DeliveryByZoneForm({
  onClose, zones, onSave, selectedZones
}) {
  const isDesktop = useDesktop();
  const [activeZones, setActiveZone] = useState(selectedZones);

  const Component = isDesktop ? SideDrawer : Drawer;
  const props = !isDesktop ? {
    title: 'Select Zones',
    onClose,
  } : {
    className: styles.desktopContainer,
    backButton: true,
    title: 'Select Zones',
    onClose,
  };

  const checkIsZoneEnabled = (id) => {
    const zones = activeZones?.find(zone => zone._id === id);
    return _.isEmpty(zones);
  };

  const onEnable = (zoneObj) => {
    if (!_.isEmpty(activeZones?.find(zone => zone._id === zoneObj._id))) {
      setActiveZone(activeZones?.filter(zone => zone._id !== zoneObj._id));
    } else {
      setActiveZone(prev => [...prev, zoneObj]);
    }
  };

  const enableWholeCountry = (countryObj) => {
    if (!_.isEmpty(activeZones?.find(zone => zone._id === countryObj._id))) {
      setActiveZone(activeZones?.filter(zone => zone._id !== countryObj._id));
      return;
    }
    const filteredZones = zones.data?.find(zone => zone._id === countryObj._id)
      .region?.reduce((acc, region) => [...acc, region._id], []);
    if (filteredZones?.length > 0) {
      setActiveZone(activeZones.filter(zone => !filteredZones.includes(zone._id)));
    }
    setActiveZone(prev => [...prev, countryObj]);
  };

  return (
  // eslint-disable-next-line react/jsx-props-no-spreading
    <Component {...props}>
      <div className={styles.container}>
        {zones?.map(obj => (
          <div className={styles.card}>
            <Clickable
              className={cx(styles.flexbetween, styles.green)}
              onClick={() => enableWholeCountry(obj)}>
              {_.capitalize(obj.name)}
              <img src={!checkIsZoneEnabled(obj._id) ? checkedIcon : uncheckedIcon} alt="" />
            </Clickable>
            {obj?.region?.length > 0 && (
              <div className={styles.box2}>
                {obj?.region?.map(zone => (
                  <Clickable
                    className={cx(styles.flexStart, styles.paddingTop, styles.f12)}
                    onClick={() => { onEnable(zone); }}
                  >
                    <img
                      className={styles.marginRight}
                      src={!checkIsZoneEnabled(obj._id) ? checkedCheckBox
                        : (!checkIsZoneEnabled(zone._id) ? checkedCheckBox : uncheckedCheckBox)}
                      alt="" />
                    {zone.name}
                  </Clickable>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className={styles.container}>
          <Button
            label="Save"
            fullwidth={true}
            className={styles.saveButton}
            variant="primary"
            onClick={() => onSave(activeZones)} />
        </div>
      </div>
    </Component>
  );
}
DeliveryByZoneForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  zones: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  selectedZones: PropTypes.array.isRequired,
};
