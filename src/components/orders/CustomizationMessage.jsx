import React from 'react';
import { useCustomizationMessage } from 'contexts/orderContext';
import { LightBlueTile } from 'components/cards';
import InfoIcon from '@material-ui/icons/Info';
import styles from './CustomizationMessage.module.css';

export function CustomizationMessage() {
  const note = useCustomizationMessage();
  if (note.length === 0) {
    return null;
  }
  return (
    <LightBlueTile className={styles.noteContainer}>
      <InfoIcon style={{ fontSize: 24 }} />
      <div className={styles.note}>{note}</div>
    </LightBlueTile>
  );
}
