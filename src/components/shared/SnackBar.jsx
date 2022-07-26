import React, { useEffect, useState } from 'react';
import { SnackBar as SB } from 'phoenix-components';
import { setCallbacks } from 'services/snackbar';
import styles from './SnackBar.module.css';

function SnackBar() {
  const [data, setData] = useState(null);

  let timer = null;

  function setMessage(msg, sev, timeout = 4000) {
    if (timer) {
      clearTimeout(timer);
    }

    setData({ severity: sev, message: msg });
    timer = setTimeout(() => {
      setData(null);
    }, timeout);
  }

  function clearMessage() {
    if (timer) {
      clearTimeout(timer);
    }
    setData(null);
  }

  useEffect(() => {
    setCallbacks(setMessage, clearMessage);
  }, [setData]);

  if (!data) {
    return null;
  }

  const { message, severity } = data;

  return (
    <div className={styles.root}>
      <SB
        type={severity}
        onClose={clearMessage}
        message={message}
      />
    </div>
  );
}

export default SnackBar;
