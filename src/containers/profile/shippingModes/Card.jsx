import React from 'react';
import { Switch } from 'phoenix-components/lib/formik';
import { useField, useFormikContext } from 'formik';
import cx from 'classnames';
import PropTypes from 'prop-types';
import editIcon from 'assets/overview/editIcon.svg';
import deleteIcon from 'assets/images/address/delete.svg';
import SnackBar from 'services/snackbar';
import { useToggle } from 'hooks/common';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import { useShop } from 'contexts';
import { useHistory } from 'react-router-dom';
import styles from './Card.module.css';

export default function Card({
  onEdit,
  idx,
  path,
  type: itemType,
}) {
  const [{ value: enabled }, , { setValue }] = useField(`${path}.enabled`);
  const { submitForm, values, setValues } = useFormikContext();
  const [{ value: item }] = useField(path);
  const title = item?.title ?? 'No title';
  const type = item?.type ?? '';
  const [openDel, toggleDel] = useToggle();
  const history = useHistory();
  const {
    addresses = []
  } = useShop();

  const handleChange = () => {
    if (enabled) {
      const deliveryEnabled = values?.delivery?.enabled;
      const pickupEnabled = values?.pickup?.enabled;
      const customEnabled = values?.custom?.filter(item => item?.enabled);
      const onlyOneEnabled = [deliveryEnabled, pickupEnabled, ...customEnabled]
        .filter(Boolean).length <= 1;
      if (onlyOneEnabled) {
        SnackBar.showError('Atleast one shipping mode should be enabled');
        return;
      }
    }
    if (path === 'pickup' && !enabled && addresses.length === 0) {
      SnackBar.show('please add shop address', 'error');
      history.push('/manage/address', {
        redirectTo: '/manage/shippingModes',
      });
    }
    setValue(!enabled);
    submitForm();
  };

  const deleteItem = () => {
    toggleDel();
    setValues({
      ...values,
      custom: values?.custom?.filter((a, i) => i !== idx),
    });
    submitForm();
  };

  return (
    <div className={styles.container}>
      {openDel && (
        <DeleteAlert
          title="Are you sure you want to delete?"
          onCancel={toggleDel}
          onDelete={deleteItem}
          primary="Yes"
          secondary="No"
        />
      )}
      <div className={cx(styles.top, 'flexBetween')}>
        <div className={styles.center}>
          {title}
        </div>
        <div
          className={cx('flexBetween')}
          onClick={handleChange}
        >
          <p className={cx(enabled ? styles.activeText : styles.inActiveText)}>{enabled ? 'Active' : 'Inactive'}</p>
          <Switch
            name={`${path}.enabled`}
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        <div className={cx('flexBetween', styles.text)}>
          <p className={styles.shippingText}>Shipping Type</p>
          <p className={styles.shippingTypeText}>{type?.charAt(0).toUpperCase() + type?.slice(1)}</p>
        </div>
        {itemType === 'custom' && (
          <div className={cx('flexEnd', styles.iconsContainer)}>
            <img
              src={deleteIcon}
              alt="delete"
              onClick={toggleDel}
              className={styles.deleteIcon} />
            <img
              src={editIcon}
              alt="edit"
              onClick={() => onEdit(idx)}
              className={styles.editIcon}
            />
          </div>
        )}
      </div>
      <div className={styles.line} />
    </div>
  );
}

Card.propTypes = {
  idx: PropTypes.number,
  path: PropTypes.string,
  onEdit: PropTypes.func,
  type: PropTypes.string,
};

Card.defaultProps = {
  idx: null,
  path: '',
  type: '',
  onEdit: () => { }
};
