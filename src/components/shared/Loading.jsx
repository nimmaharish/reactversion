import React from 'react';
import loader from 'assets/images/loader.gif';
import styles from './Loading.module.css';

export function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.loader}>
        <img src={loader} alt="" />
      </div>
    </div>
  );
}
