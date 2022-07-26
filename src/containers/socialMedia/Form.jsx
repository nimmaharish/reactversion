import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid
} from '@material-ui/core';
import ButtonComponent from 'containers/profile/ButtonComponent';
import Snackbar from 'services/snackbar';
import { Becca } from 'api/index';
import { useShop } from 'contexts/userContext';
import cx from 'classnames';
import DeleteIcon from 'assets/images/socialMedia/delete.png';
import DesktopDeleteIcon from 'assets/desktop/deleteIcon.svg';
import { ReactInput, Clickable } from 'phoenix-components';
import { useToggle } from 'hooks/common';
import {
  useIsSocialMediaEnabled
} from 'contexts/userContext';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import editIcon from 'assets/v2/settings/domain/edit.svg';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import { useDesktop } from 'contexts';
import styles from './Accounts.module.css';

function Login({
  isNew, icon, item, refresh
}) {
  const defaultValue = isNew ? '' : item.url;
  const [URL, setURL] = useState(defaultValue);
  const [openCancel, toggleCancel] = useToggle();
  const shop = useShop();
  const label = (item?.name || item);
  const isSocialMediaEnabled = useIsSocialMediaEnabled();
  const history = useHistory();
  const [edit, toggleEdit] = useToggle(false);
  const params = useQueryParams();
  const isDesktop = useDesktop();

  useEffect(() => {
    setURL(defaultValue);
  }, [defaultValue]);

  const getLabel = () => label;

  const updateShop = async (payload, successMsg, checkFeature = true) => {
    if (!isSocialMediaEnabled && checkFeature) {
      params.set('openPlans', 'generic');
      history.push({
        search: params.toString(),
      });
      return;
    }
    try {
      await Becca.updateShop(payload);
      Snackbar.show(successMsg);
      if (isNew) {
        setURL('');
      }
      refresh();
    } catch (exception) {
      Snackbar.showError(exception);
    }
  };

  const onDelete = async () => {
    try {
      const { linkedAccounts = [] } = shop;
      const otherItems = linkedAccounts.filter(x => x.name !== label);
      updateShop({ linkedAccounts: otherItems }, `${label} deleted successfully`, false);
      toggleCancel();
    } catch (exception) {
      Snackbar.showError(exception);
    }
  };

  return (
    <form
      Validate
      autoComplete="off"
      id="form"
      onSubmit={async (e) => {
        e.preventDefault();
        const payload = { name: label.toLowerCase(), url: URL };
        if (isNew) {
          const { linkedAccounts = [] } = shop;
          // eslint-disable-next-line no-unused-expressions
          const tx = linkedAccounts.filter(x => x.name !== label);
          tx.push(payload);
          updateShop({ linkedAccounts: tx }, `${label} linked successfully`);
        } else {
          const { linkedAccounts = [] } = shop;
          const otherItems = linkedAccounts.filter(x => x.name !== label);
          otherItems.push(payload);
          updateShop({ linkedAccounts: otherItems },
            `${label !== 'whatsapp' ? `${label} link` : `${label} number`} updated successfully`);
        }
      }}
      className={styles.form}
    >
      {openCancel && (
        <DeleteAlert
          className={styles.deleteText}
          title="Eek! Are you sure you want to delete this linked account?"
          onCancel={toggleCancel}
          onDelete={onDelete}
          primary="Delete"
          icon={null}
          secondary="Cancel"
        />
      )}
      {isDesktop ? (
        <div className={isNew ? styles.desktopContainer1 : styles.desktopContainer}>
          <div className={styles.mainBox}>
            <img src={icon} alt="" />
            <div className={styles.box}>
              <label className={styles.label}>
                {' '}
                {`${getLabel()} `}
                {' '}
              </label>
              <div className={styles.section}>
                <ReactInput
                  value={URL}
                  label={label === 'whatsapp' ? `Add ${getLabel()} Number` : `Add ${getLabel()} URL`}
                  placeholder={label === 'whatsapp' ? 'Enter Mobile Number' : 'Enter URL'}
                  setValue={(e) => setURL(e)}
                  required={true}
                />
              </div>
            </div>
            {!isNew && (
              <img
                src={DesktopDeleteIcon}
                alt="A"
                onClick={toggleCancel}
                className={styles.deleteIcon} />
            )}
            {!isNew && (
              <Clickable
                onClick={(e) => {
                  toggleEdit();
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className={styles.editIcon}
              >
                <img
                  src={editIcon}
                  alt="" />
              </Clickable>
            )}
          </div>
          {edit && (
            <div className={styles.buttonsContainer}>
              <ButtonComponent
                text="Save"
                size="small"
                color="primary"
                style={cx(styles.button)}
              />
            </div>
          )}
          {isNew && (
            <div className={styles.buttonsContainer}>
              <ButtonComponent
                text="Add"
                color="primary"
                style={cx(styles.button)}
              />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className={styles.topBar}>
            <img src={icon} alt="" />
            <label className={styles.label}>
              {' '}
              {`${getLabel()} `}
              {' '}
            </label>
            {!isNew && (
              <img
                src={DeleteIcon}
                alt="A"
                onClick={toggleCancel}
                className={styles.deleteIcon} />
            )}
          </div>
          <div className={styles.section}>
            <Grid item xs={12}>
              <ReactInput
                value={URL}
                label={label === 'whatsapp' ? `Add ${getLabel()} Number` : `Add ${getLabel()} URL`}
                placeholder={label === 'whatsapp' ? 'Enter Mobile Number' : 'Enter URL'}
                setValue={(e) => setURL(e)}
                required={true}
                inputClass={styles.noOpacity}
                readonly={!edit && !isNew}
              />
              {!isNew && (
                <Clickable
                  onClick={(e) => {
                    toggleEdit();
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className={styles.editIcon}
                >
                  <img
                    src={editIcon}
                    alt="" />
                </Clickable>
              )}
            </Grid>
          </div>
          {edit && (
            <div className={styles.buttonsContainer}>
              <ButtonComponent
                text="Save"
                size="small"
                color="primary"
                style={cx(styles.button)}
              />
            </div>
          )}
          {isNew && (
            <div className={styles.buttonsContainer}>
              <ButtonComponent
                text="Add"
                color="primary"
                style={cx(styles.button)}
              />
            </div>
          )}
        </>
      )}
    </form>
  );
}

Login.propTypes = {
  isNew: PropTypes.bool,
  icon: PropTypes.string.isRequired,
  item: PropTypes.any.isRequired,
  refresh: PropTypes.func.isRequired,
};

Login.defaultProps = {
  isNew: false,
};

export default Login;
