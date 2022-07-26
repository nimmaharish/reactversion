import React, { useState } from 'react';
import { useField } from 'formik';
import { useShop } from 'contexts';
import ButtonComponent from 'containers/profile/ButtonComponent';
import AddIcon from '@material-ui/icons/Add';
import binkIcon from 'assets/overview/binIcon.svg';
import editIcon from 'assets/overview/editIcon.svg';
import { useToggle } from 'hooks/common';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import {
  useIsConditionalChargesEnabled
} from 'contexts/userContext';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import { ConditionForm } from './ConditionForm';
import { DeliveryType, formatConditionalCharge } from './utils';
import styles from './Delivery.module.css';
export function ConditionalDelivery() {
  const shop = useShop();
  const [{ value: type }] = useField('chargeType');
  const [{ value: charges = [] }, , { setValue }] = useField('otherCharges');
  const [index, setIndex] = useState(null);
  const [del, toggleDel] = useToggle(false);
  const params = useQueryParams();
  const history = useHistory();
  const isConditionalChargesEnabled = useIsConditionalChargesEnabled();

  const onClose = () => {
    setIndex(null);
  };

  if (type !== DeliveryType.CONDITIONAL) {
    return null;
  }

  if (charges.length === 0) {
    return (
      <ConditionForm onClose={onClose} />
    );
  }

  if (index !== null) {
    return (
      <ConditionForm onClose={onClose} index={index === -1 ? null : index} />
    );
  }

  const onDelete = () => {
    setValue(charges.filter((_, idx) => idx !== charges.length - 1));
    toggleDel();
    onClose();
  };

  return (
    <div>
      {del && (
        <DeleteAlert
          onCancel={toggleDel}
          onDelete={onDelete}
          title="Boo! Are you sure you want to delete this delivery charge?"
        />
      )}
      {charges.map((charge, idx) => (
        <div className={styles.charge}>
          <span className={styles.chargeIndex}>
            {idx + 1}
          </span>
          <span className={styles.chargeBody}>
            {formatConditionalCharge(charge, shop.currency)}
          </span>
          <div className={styles.editDiv}>
            <span
              onClick={toggleDel}
              className={styles.editContainer}
            >
              <img src={binkIcon} alt="" />
            </span>
            <span
              onClick={() => setIndex(idx)}
              className={styles.editContainer}
            >
              <img src={editIcon} alt="" />
            </span>
          </div>
        </div>
      ))}
      <div className="textRight">
        <ButtonComponent
          starticon={<AddIcon />}
          text="Add More Charges"
          style={styles.addMoreCharges}
          onclick={() => {
            if (!isConditionalChargesEnabled) {
              params.set('openPlans', 'generic');
              history.push({
                search: params.toString(),
              });
              return;
            }
            setIndex(-1);
          }}
        />
      </div>
    </div>
  );
}
