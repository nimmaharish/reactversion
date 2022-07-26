import React from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@material-ui/core';
import { useDesktop } from 'contexts';
import closeIcon from 'assets/images/orders/list/close.svg';
import { Button, Clickable } from 'phoenix-components';
import cx from 'classnames';
import styles from './DeleteAlert.module.css';

export function DeleteAlert({
  title, subTitle, onCancel, onDelete, primary, secondary
}) {
  const isSecondaryReq = !!onCancel;
  const hideSubTitle = subTitle.length === 0;
  const isDesktop = useDesktop();
  return (
    <Dialog
      // className={styles.dialog}
      PaperProps={{
        classes: {
          root: styles.dialog,
        }
      }}
      maxWidth={isDesktop ? 'xs' : 'md'}
      open={true}
    >
      {isDesktop && (
        <div className={cx('flexEnd', styles.padding)}>
          <Clickable
            onClick={onCancel}>
            <img src={closeIcon} alt="" />
          </Clickable>
        </div>
      )}
      <div className={styles.title}>{title}</div>
      {!hideSubTitle && <div className={styles.subTitle}>{subTitle}</div>}
      <div className={styles.buttons}>
        {isSecondaryReq && <Button size="large" onClick={onCancel} label={secondary} primary={false} />}
        <Button size="large" onClick={onDelete} label={primary} />
      </div>
    </Dialog>
  );
}

DeleteAlert.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  primary: PropTypes.string,
  secondary: PropTypes.string,
};

DeleteAlert.defaultProps = {
  title: 'Delete?',
  subTitle: '',
  primary: 'Delete',
  secondary: 'Cancel',
};
