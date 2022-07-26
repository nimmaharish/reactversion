import React from 'react';
import PropTypes from 'prop-types';
import deleteIcon from 'assets/images/address/delete.svg';
import cx from 'classnames';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { Becca } from 'api';
import { useRefreshShop } from 'contexts';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import { useToggle } from 'hooks/common';
import { Badge, Clickable } from 'phoenix-components';
import { getChipNameForNick } from 'components/address/utils';
import PencilIcon from 'assets/images/address/edit.svg';
import selIcon from 'assets/images/address/sel.svg';
import unSelIcon from 'assets/images/address/unsel.svg';
import { AddressForm } from 'components/address/lazy';
import { useDesktop } from 'contexts';
import styles from './Card.module.css';

export function Card({ address }) {
  const refreshShop = useRefreshShop();
  const [openDelete, toggleDelete] = useToggle(false);
  const [openEdit, toggleEdit] = useToggle(false);
  const isDesktop = useDesktop();

  const deleteAddress = async () => {
    Loader.show();
    try {
      await Becca.deleteAddress(address._id);
      refreshShop();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const markDefault = async () => {
    if (address.default) {
      return;
    }
    Loader.show();
    try {
      await Becca.setDefaultAddress(address._id);
      refreshShop();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  return (
    <div
      className={isDesktop
        ? cx(styles.desktopContainer)
        : cx(styles.container, { [styles.border]: address.default })}>
      <div className={styles.bottom}>
        <div className="flexCenter">
          <div className={styles.userName}>{address.name}</div>
          <Badge
            rounded={true}
            className={cx({
              [styles.selected]: address.default,
              [styles.chip]: !address.default,
            })}
          >
            {getChipNameForNick(address?.nick)}
          </Badge>
        </div>
        <div className={styles.editButton} onClick={toggleEdit}>
          <img src={PencilIcon} alt="" />
        </div>
      </div>
      <div className={cx(styles.row)}>
        <div className={styles.address}>
          {address.addressLine1}
          {', '}
          {address.addressLine2 || ''}
          {address.addressLine2 && ','}
          {address.city}
          {', '}
          {address.state}
          {' - '}
          {address.pincode}
          <br />
          {address.landmark && (
            <>
              Landmark :
              {' '}
              {address.landmark}
              <br />
            </>
          )}
          Contact Number:
          {' '}
          {address.phone}
          <br />
        </div>
      </div>
      <div className={cx(styles.bottom)}>
        <Clickable
          className={cx(styles.deleteFlex)}
          onClick={markDefault}
        >
          <img src={address.default ? selIcon : unSelIcon} alt="" />
          <span
            className={cx(styles.default, { [styles.mark]: address.default })}>
            Make as Default

          </span>
        </Clickable>
        <div>
          <img onClick={toggleDelete} className={styles.delete} src={deleteIcon} alt="" />
        </div>
      </div>
      {openDelete && (
        <DeleteAlert
          title="Are you sure want to delete this address?"
          onCancel={toggleDelete}
          onDelete={deleteAddress}
        />
      )}
      {openEdit && (<AddressForm onClose={toggleEdit} address={address} />)}
    </div>
  );
}

Card.propTypes = {
  address: PropTypes.object.isRequired,
};

Card.defaultProps = {};
