import React from 'react';
import { Button } from 'phoenix-components';
import snapShotIcon from 'assets/v2/settings/snapshot/overView.svg';
import { useToggle } from 'hooks/common';
import Overview from './Overview';
import styles from './SnapMini.module.css';

export function SnapMini() {
  const [openOverview, toggleOverview] = useToggle();
  return (
    <div className={styles.container}>
      <div className={styles.head}>
        Shop Settings Summary
      </div>
      <div className={styles.content}>
        <img src={snapShotIcon} alt="snapshot" />
        <div className={styles.text}>
          Check all your shop settings that affect customer's checkout as a summary here
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button
          className={styles.btn}
          primary={false}
          label="View Summary"
          size="small"
          onClick={toggleOverview}
        />
        {openOverview && <Overview onClose={toggleOverview} />}
      </div>
    </div>
  );
}
