import React, { useState } from 'react';
import { useDesktop } from 'contexts';
import { Drawer } from 'components/shared/Drawer';

import PropTypes from 'prop-types';
import {
  Button, Clickable, FormikInput, ReactInput
} from 'phoenix-components';
import { Switch } from 'phoenix-components/lib/formik';
import plusIcon from 'assets/images/areasServed/plus.svg';
import { useField } from 'formik';
// import { DebugValues } from 'components/formik';
import { BottomDrawer } from 'components/shared/BottomDrawer';
import { SideDrawer } from 'components/shared/SideDrawer';
import _ from 'lodash';
import Loader from 'services/loader';
import { Polygon } from 'api';
import SnackBar from 'services/snackbar';
import { Becca } from 'api';
import unCheckedRadioIcon from 'assets/images/areasServed/uncheckedRadio.svg';
import checkedRadioIcon from 'assets/images/areasServed/checkedRadio.svg';
import { useToggle } from 'hooks/common';
import cx from 'classnames';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import styles from './Zones.module.css';

function Zones({
  onClose, countryId, zoneId, onSave, isZoneEdit
}) {
  const isDesktop = useDesktop();
  const [{ value: allZones }, , { setValue: setAllZones }] = useField(`region.countries[${+countryId}].regions`);

  const [{ value }, , { setValue: setPincodes }] = useField(`region.countries[${+countryId}].regions[${+zoneId}]`);

  const [,, { setValue: setEnabled }] = useField(`region.countries[${+countryId}].regions[${+zoneId}].enabled`);

  const basePath = `region.countries[${+countryId}].regions[${+zoneId}]`;

  const [isOpen, setIsOpen] = useState(false);

  const [deletionType, setDeletionType] = useState('disable');

  const [deleteAlert, toggleDeleteAlert] = useToggle(false);

  const deleteOnClose = () => {
    if (value?.name?.length === 0 || value?.pincode?.included?.length === 0) {
      setAllZones(allZones.filter((_, index) => index !== +zoneId));
      onClose(null);
    } else {
      onClose(null);
    }
    return null;
  };

  const Component = isDesktop ? SideDrawer : Drawer;

  const props = !isDesktop ? {
    // eslint-disable-next-line react/destructuring-assignment
    title: 'Postal code',
    onClose: () => deleteOnClose(),
  } : {
    className: styles.desktopContainer,
    backButton: true,
    title: 'Include postal codes',
    onClose: () => deleteOnClose(),
  };

  const addPincodes = (e) => {
    const included = e.trim().split(',');
    const temp = {
      pincode: {
        included,
        type: 'included',
      }
    };

    setPincodes({ ...value, ...temp });
  };

  const exportPincodes = async () => {
    try {
      Loader.show();
      await Becca.exportPincodes(value._id);
      SnackBar.show('You will receive an email with the pincode list shortly');
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const handleFileUpload = async (e) => {
    Loader.show();
    try {
      const payload = new FormData();
      const file = e.target.files[0];
      payload.append('pincodes', file);
      const result = await Polygon.uploadPincodes(payload);
      if (!result?.length) {
        SnackBar.showError('pincodes not found in sheet');
        return;
      }
      const temp = {
        pincode: {
          included: [...result, ...value?.pincode?.included],
          type: 'included',
        }
      };
      setPincodes({ ...value, ...temp });
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const onChange = (e, value) => {
    e.stopPropagation();
    if (value) {
      setEnabled(value);
      onSave();
      return;
    }
    setIsOpen(true);
  };

  const onDelete = () => {
    toggleDeleteAlert();
  };

  const onDisable = () => {
    setEnabled(false);
    onSave();
  };

  const deleteZone = () => {
    setAllZones(allZones.filter((_, index) => index !== +zoneId));
    onSave();
    onClose(null);
  };

  if (deleteAlert) {
    return (
      <DeleteAlert
        title="Are you sure about deleting this Zone?"
        onCancel={toggleDeleteAlert}
        onDelete={deleteZone}
      />
    );
  }

  const deleteZonePopUp = () => {
    const Component = isDesktop ? SideDrawer : BottomDrawer;
    const props = !isDesktop ? {
      title: 'Zone Status',
      onClose: () => setIsOpen(false),
    } : {
      title: 'Define Inclusion Zone',
      onClose: () => setIsOpen(false),
      closeButton: true,
    };
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Component {...props}>
        <div className={styles.dcontainer}>
          <Clickable onClick={() => setDeletionType('disable')} className={cx(styles.fullwidth, styles.zoneStatus)}>
            Disable this zone
            <img
              src={deletionType === 'disable' ? checkedRadioIcon : unCheckedRadioIcon}
              alt="" />
          </Clickable>
          <Clickable onClick={() => setDeletionType('delete')} className={cx(styles.fullwidth, styles.zoneStatus)}>
            Delete this Zone
            <img
              src={deletionType === 'delete' ? checkedRadioIcon : unCheckedRadioIcon}
              alt="" />
          </Clickable>
          <Button
            label="Save"
            primary={true}
            onClick={() => (deletionType === 'disable' ? onDisable() : onDelete())}
            className={styles.dbutton}
            fullWidth={true} />
        </div>

      </Component>
    );
  };

  if (isOpen) {
    return deleteZonePopUp();
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Component {...props}>
      <div className={styles.container}>
        <>
          {isZoneEdit && (
            <div className={styles.zoneStatus}>
              Zone Status
              <Switch name={`${basePath}.enabled`} onChange={onChange} />
            </div>
          )}
          <div className={styles.zoneTitle}>
            <FormikInput
              label="Enter Zone Title"
              placeholder="Area 1"
              type="text"
              variant="outlined"
              name={`${basePath}.name`}
            />
          </div>
          <div className={styles.zoneTextArea}>
            <ReactInput
              value={value.pincode.included.join(',')}
              type="textarea"
              rows={12}
              setValue={(e) => addPincodes(e)}
              label="Enter Eligible Postal Codes"
              placeholder="e.g. 560085,560086,560087"
            />
          </div>
          <div className={styles.or}>
            <span className={styles.text}>Or</span>
          </div>
          <label>
            <div className={styles.addCsv} onClick={() => null}>
              <img src={plusIcon} alt="" />
              &nbsp;
              Add CSV File
            </div>
            <input
              className={styles.input}
              hidden
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
            />
          </label>
          <div className={styles.subHeading}>
            Download sample
            {' '}
            <a
              className={styles.link}
              href="https://becca-cdn.windo.live/templates/sample-pincodes.csv"
            >
              CSV template
            </a>
          </div>
          {value?.pincode?.included?.length > 0 && (
            <Clickable className={styles.export} onClick={exportPincodes}>
              Download All Uploaded
              {'  '}
              <span className={styles.csv}>CSV file</span>
            </Clickable>
          )}
          <Button
            label="Save"
            fullwidth={true}
            disabled={(!_.isEmpty(value)) && Object?.values(value)?.some(x => x === null || x === '')}
            className={styles.saveButton}
            variant="primary"
            onClick={() => { onSave(); onClose(null); }} />
        </>
      </div>
    </Component>
  );
}

Zones.propTypes = {
  countryId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  zoneId: PropTypes.number.isRequired,
  onSave: PropTypes.func.isRequired,
  isZoneEdit: PropTypes.bool,
};

Zones.defaultProps = {
  isZoneEdit: false,
};

export default Zones;
