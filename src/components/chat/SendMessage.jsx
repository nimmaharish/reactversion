import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import sendIcon from 'assets/images/chat/send.svg';
import { Hedwig } from 'api';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import styles from './SendMessage.module.css';

export function SendMessage({ refresh, roomId }) {
  const [message, setMessage] = useState('');

  const onFocus = () => {
    const container = document.getElementById('chatRoom');
    if (container) {
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }, 500);
    }
  };

  const sendMessage = async () => {
    if (message.length === 0) {
      return;
    }
    try {
      Loader.show();
      await Hedwig.sendMessage(roomId, {
        message: {
          type: 'text',
          data: message
        }
      });
      setMessage('');
      setTimeout(refresh, 500);
    } catch (e) {
      SnackBar.show('something went wring', 'error');
    } finally {
      Loader.hide();
    }
  };

  return (
    <div className={styles.container}>
      <TextField
        fullWidth
        placeholder="Type here......"
        size="small"
        className={styles.field}
        variant="outlined"
        value={message}
        onFocus={onFocus}
        onChange={e => setMessage(e.target.value)}
      />
      <div onClick={sendMessage} className={styles.button}>
        <img src={sendIcon} alt="" />
      </div>
    </div>
  );
}

SendMessage.propTypes = {
  refresh: PropTypes.func.isRequired,
  roomId: PropTypes.string.isRequired,
};

SendMessage.defaultProps = {};
