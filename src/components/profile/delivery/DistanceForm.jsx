import React from 'react';
import PropTypes from 'prop-types';
import { Formik, useField } from 'formik';
import { FormikInput, Button } from 'phoenix-components';
import { Select } from 'phoenix-components/lib/formik';
import { useToggle } from 'hooks/common';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import {
  Dialog, DialogContent,
} from '@material-ui/core';
import { useShop } from 'contexts';
import { useHistory } from 'react-router-dom';
import {
  useIsConditionalChargesEnabled
} from 'contexts/userContext';
import { useQueryParams } from 'hooks';
import _ from 'lodash';
import SnackBar from 'services/snackbar';
import { useDesktop } from 'contexts';
import {
  DistanceOptions, getInitialDistanceValues
} from './utils';
import styles from './Delivery.module.css';
import { distanceChargeSchema } from './schema';

export function DistanceForm({
  index,
  onClose
}) {
  const { addresses = [] } = useShop();
  const history = useHistory();
  const shop = useShop();
  const [{ value: charges = [] }, , { setValue }] = useField('distanceMatrix');
  const [del, toggleDel] = useToggle(false);
  const [address, toggleAddress] = useToggle(false);
  const isDesktop = useDesktop();
  const params = useQueryParams();
  const isConditionalChargesEnabled = useIsConditionalChargesEnabled();

  const isDuplicate = values => {
    const fields = ['from', 'to', 'fromDistance', 'toDistance', 'unit'];
    return !!charges.find((ch, idx) => {
      if (idx === index) {
        return false;
      }
      return _.isEqual(_.pick(ch, fields), _.pick(values, fields));
    });
  };
  const onSubmit = (values) => {
    if (isDuplicate(values)) {
      SnackBar.show('Duplicate delivery charges', 'error');
      return;
    }
    if (index !== null) {
      charges[index] = values;
    } else {
      charges.push(values);
    }
    setValue([...charges]);
    onClose();
  };

  const onDelete = () => {
    setValue(charges.filter((_, idx) => idx !== index));
    toggleDel();
    onClose();
  };

  return (
    <>
      <Formik
        initialValues={getInitialDistanceValues(charges, index)}
        validationSchema={distanceChargeSchema}
        onSubmit={onSubmit}
      >
        {({
          values,
          submitForm,
          setFieldValue,
        }) => (
          <div>
            {del && <DeleteAlert onCancel={toggleDel} onDelete={onDelete} />}
            <div className={styles.paddingBottom}>
              <FormikInput
                name="from"
                label="Minimum order value"
                type="number"
                placeholder={`${shop.currency} 2000`}
              />
            </div>
            <div className={styles.paddingBottom}>
              <FormikInput
                name="to"
                label="Max order value"
                type="number"
                placeholder={`${shop.currency} 5000`}
              />
            </div>
            <div className={styles.paddingBottom}>
              <Select
                name="distance"
                label="Select distance range"
                value={DistanceOptions.find(x => x.unit === values.unit
                  && x.fromDistance === values.fromDistance
                  && x.toDistance === values.toDistance)}
                options={DistanceOptions}
                onChange={(x) => {
                  setFieldValue('distance', x);
                  setFieldValue('unit', x.value.includes('Miles') ? 'mile' : 'km');
                }}
              />
            </div>
            <div className={styles.paddingBottom}>
              <FormikInput
                name="charge"
                label="Delivery Charge"
                type="number"
                placeholder={`${shop.currency} 200`}
              />
            </div>
            <div className={isDesktop ? 'flexCenter' : 'flexBetween'}>
              {charges.length !== 0 && (
                <Button
                  label="Cancel"
                  size="medium"
                  primary={false}
                  className={styles.button}
                  onClick={onClose}
                />
              )}
              <Button
                label={index !== null ? 'Update' : 'Add'}
                className={styles.button}
                onClick={() => {
                  if (addresses.length > 0) {
                    if (!isConditionalChargesEnabled) {
                      params.set('openPlans', 'generic');
                      history.push({
                        search: params.toString(),
                      });
                      return;
                    }
                    submitForm();
                  } else {
                    toggleAddress();
                  }
                }}
              />
            </div>
          </div>
        )}
      </Formik>
      {address && (
        <Dialog open={true} maxWidth="md" fullWidth>
          <DialogContent>
            <div>
              Please fill shop address before using distance based charges.
            </div>
            <br />
            <div className={styles.textCenter}>
              <Button
                label="Add Address"
                onClick={() => {
                  history.push('/manage/address', {
                    redirectTo: '/manage/delivery',
                  });
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

DistanceForm.propTypes = {
  index: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

DistanceForm.defaultProps = {
  index: null,
};
