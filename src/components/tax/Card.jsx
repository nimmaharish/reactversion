import React from 'react';
import { Switch } from 'phoenix-components/lib/formik';
import PropTypes from 'prop-types';
import deleteIcon from 'assets/overview/deleteIcon.svg';
import editIcon from 'assets/overview/edit.svg';
import { useToggle } from 'hooks/common';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import { Clickable } from 'phoenix-components';
import { useField, useFormikContext } from 'formik';
import styles from './List.module.css';

export function Card({
  index, openForm
}) {
  const { submitForm } = useFormikContext();
  const [{ value: tax },, { setValue: setTax }] = useField(`taxes[${index}]`);
  const deleteTitle = [`Hold up! Are you sure you want to delete this ${tax.title} Tax?`];
  const [openDelete, toggleDelete] = useToggle(false);

  const openDeleteAlert = () => {
    toggleDelete(!openDelete);
  };

  const saveTax = () => {
    setTax({
      ...tax,
      enabled: !tax.enabled
    });
    submitForm();
  };

  const onDelete = () => {
    setTax({
      ...tax,
      isDeleted: true,
      enabled: false,
    });
    submitForm();
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.taxCard}>
        <div className={styles.taxTitle}>
          {tax.title}
        </div>
        <div className={styles.right}>
          <Switch name={`taxes[${index}].enabled`} onChange={saveTax} />
        </div>
      </div>
      <div className={styles.lineH} />
      {tax.identifier.length > 0 && (
        <>
          <div className={styles.taxId}>
            Tax Identification Number
          </div>
          <div className={styles.taxNumber}>
            {tax.identifier}
          </div>
          <div className={styles.lineH} />
        </>
      )}
      <div>
        <div className={styles.taxId}>
          Tax Percentage
        </div>
        <div className={styles.taxNumber}>
          {tax.value}
          {' '}
          %
        </div>
        <div className={styles.imgContainer}>
          <Clickable
            onClick={openDeleteAlert}
          >
            <img className={styles.tImg} src={deleteIcon} alt="" />
          </Clickable>
          <Clickable
            onClick={() => openForm(index)}
          >
            <img className={styles.tImg} src={editIcon} alt="" />
          </Clickable>
        </div>
      </div>
      {openDelete && (
        <DeleteAlert
          title={deleteTitle}
          onCancel={openDeleteAlert}
          primary="Delete"
          secondary="Cancel"
          onDelete={() => {
            onDelete();
            toggleDelete();
          }}
        />
      )}
    </div>
  );
}

Card.propTypes = {
  index: PropTypes.number.isRequired,
  openForm: PropTypes.func,
};

Card.defaultProps = {
  openForm: () => {}
};
