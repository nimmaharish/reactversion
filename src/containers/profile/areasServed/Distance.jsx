import React from 'react';
import { useField } from 'formik';
import { BottomDrawer } from 'components/shared/BottomDrawer';
import { useDesktop } from 'contexts';
import { PropTypes } from 'prop-types';
import {
  Button,
  FormikInput
} from 'phoenix-components';
import { Select } from 'phoenix-components/lib/formik';
import { SideDrawer } from 'components/shared/SideDrawer';
import { FooterButton } from 'components/common/FooterButton';
// import { DebugValues } from 'components/formik';
import _ from 'lodash';
// import { getIntialValuesForDistanceMatrix } from './utils';
import styles from './Distance.module.css';
import { distanceTypes } from './utils';

function Distance({
  onClose, idx, type, submitForm
}) {
  // const [{ value: distanceMatrix },, { setValue }] = useField(`distance[${type}].distanceMatrix`);
  const [{ value: distanceArr },, { setValue: setDistanceArr }] = useField(`distance[${type}].distanceMatrix`);
  const [{ value }] = useField(`distance[${type}].distanceMatrix[${+idx}]`);
  const [, , { setValue: setType }] = useField(`distance[${type}].distanceMatrix[${+idx}].type`);
  const isDesktop = useDesktop();
  const basePath = `distance[${type}].distanceMatrix[${+idx}]`;

  const deleteOnClose = () => {
    if (value?.name?.length === 0 || value?.min?.length === 0
       || value?.max?.length === 0 || value?.type?.length === 0) {
      setDistanceArr(distanceArr.filter((_, index) => index !== idx));
      onClose();
    } else {
      onClose();
    }
    return null;
  };

  const Component = isDesktop ? SideDrawer : BottomDrawer;

  const getTitle = (type) => (type === 'included' ? 'Inclusion' : 'Exclusion');
  const props = !isDesktop ? {
    title: `Define ${getTitle(type)} Zone`,
    onClose: () => deleteOnClose(),
    className: styles.title
  } : {
    title: 'Define Inclusion Zone',
    className: styles.desktopContainer,
    onClose: () => deleteOnClose(),
    closeButton: true,
  };

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Component {...props}>
      <div className={styles.spacer} />
      Set a distance range for your store
      <div className={styles.input}>
        <FormikInput
          label="Enter Zone Title"
          placeholder="e.g. Zone 1"
          type="text"
          variant="outlined"
          name={`${basePath}.name`}
        />
        <div className={styles.spacer} />
        <Select
          label="Unit of Distance"
          name={`${basePath}.type`}
          onChange={(val) => {
            setType(val.value);
          }}
          options={distanceTypes}
          value={distanceTypes.find(x => x.value === value?.type)}
        />
        <div className={styles.spacer} />
        <div className={styles.width}>
          <div className={styles.width50}>
            <FormikInput
              label={`Min ${value?.type}`}
              placeholder="e.g. 0"
              type="number"
              variant="outlined"
              name={`${basePath}.min`}
            />
          </div>
          <div className={styles.width50}>
            <FormikInput
              label={`Max ${value?.type}`}
              placeholder="e.g. 500"
              type="number"
              variant="outlined"
              name={`${basePath}.max`}
            />
          </div>
        </div>
        <div className={styles.spacer} />
        <FooterButton>
          <Button
            label="Create"
            primary={true}
            disabled={(!_.isEmpty(value)) && Object?.values(value)?.some(x => x === null || x === '')}
            onClick={() => { onClose(); submitForm(); }}
            className={styles.button}
            fullWidth={true} />
        </FooterButton>
      </div>
    </Component>
  );
}

Distance.propTypes = {
  onClose: PropTypes.func.isRequired,
  idx: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  submitForm: PropTypes.func.isRequired
};

export default Distance;
