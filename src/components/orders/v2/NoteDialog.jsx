/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent } from '@material-ui/core';
import { useDesktop } from 'contexts';
import { Button, Clickable, ReactInput } from 'phoenix-components';
import closeIcon from 'assets/images/orders/list/close.svg';
import styles from './NoteDialog.module.css';

export function NoteDialog({ onClose, onSubmit }) {
  const isDesktop = useDesktop();
  const [note, setNote] = useState('');

  return (
    <Dialog
      open={true}
      maxWidth={isDesktop ? 'xs' : 'md'}
      fullWidth
      onClose={onClose}
    >
      <DialogContent>
        <div className="flexBetween">
          <div className={styles.heading}>Add Note</div>
          <Clickable
            onClick={onClose}>
            <img src={closeIcon} alt="" />
          </Clickable>
        </div>
        <div className={styles.body}>
          <ReactInput
            type="textarea"
            value={note}
            rows={4}
            setValue={setNote}
            label="Enter note"
            placeholder="e.g. Note Status"
          />
        </div>
        <div className="flexCenter">
          <Button size="large" label="Update Status" onClick={() => onSubmit(note)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

NoteDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

NoteDialog.defaultProps = {};
