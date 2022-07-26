import React from 'react';
import PropTypes from 'prop-types';
import { Formik, useField } from 'formik';
import { useToggle } from 'hooks/common';
import { useShop } from 'contexts';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import {
  useIsConditionalChargesEnabled
} from 'contexts/userContext';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import { FormikInput, Button } from 'phoenix-components';
import { getInitialConditionalValues } from './utils';
import styles from './Delivery.module.css';
import { conditionalChargeSchema } from './schema';

export function ConditionForm({
  index,
  onClose
}) {
  const [{ value: charges = [] }, , { setValue }] = useField('otherCharges');
  const [del, toggleDel] = useToggle(false);
  const shop = useShop();
  const params = useQueryParams();
  const history = useHistory();
  const isConditionalChargesEnabled = useIsConditionalChargesEnabled();

  const onSubmit = (values) => {
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
    <Formik
      initialValues={getInitialConditionalValues(charges, index)}
      validationSchema={conditionalChargeSchema}
      onSubmit={onSubmit}
    >
      {({ submitForm }) => (
        <div>
          {del && <DeleteAlert onCancel={toggleDel} onDelete={onDelete} />}
          <div className={styles.paddingBottom}>
            <FormikInput
              name="from"
              label="Minimum Order Value"
              type="number"
              readonly={false}
              placeholder={`${shop.currency} 2000`}
            />
          </div>
          <div className={styles.paddingBottom}>
            <FormikInput
              name="to"
              label="Maximum order value"
              type="number"
              placeholder={`${shop.currency} 5000`}
            />
          </div>
          <div className={styles.paddingBottom}>
            <FormikInput
              name="charge"
              label="Delivery Charges"
              type="number"
              placeholder={`${shop.currency} 500`}
            />
          </div>
          <div className={styles.chargeButtons}>
            {charges.length !== 0 && (
              <Button
                label="Cancel"
                primary={false}
                className={styles.button}
                onClick={onClose}
              />
            )}
            <Button
              label={index !== null ? 'Update' : 'Add'}
              className={styles.button}
              onClick={() => {
                if (!isConditionalChargesEnabled) {
                  params.set('openPlans', 'generic');
                  history.push({
                    search: params.toString(),
                  });
                  return;
                }
                submitForm();
              }}
              variant="outlined"
              size="small"
            />
          </div>
        </div>
      )}
    </Formik>
  );
}

ConditionForm.propTypes = {
  index: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

ConditionForm.defaultProps = {
  index: null,
};
