import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'components/shared/Drawer';
import cx from 'classnames';
import Input from 'components/common/Input';
import ButtonComponent from 'containers/profile/ButtonComponent';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { Becca } from 'api';
import EventManager from 'utils/events';
import styles from './FeatureRequestModal.module.css';

export function FeatureRequestModal({ onClose }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const buttonEnabled = title.length > 0 && message.length > 0;

  const submitRequest = async () => {
    Loader.show();
    try {
      await Becca.createFeatureRequest(title, message);
      EventManager.emitEvent('feature_request_created');
      SnackBar.show('Your request has successfully submitted', 'success');
      onClose();
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  return (
    <Drawer onClose={onClose} title="Request a feature">
      <div className={styles.container}>
        <div className={styles.title}>Title</div>
        <Input
          value={title}
          placeholder="Title"
          setValue={(e) => setTitle(e)}
          InputProps={{
            classes: {
              input: cx(styles.textInput),
            },
          }}
          required
        />
        <div className={styles.title}>Description</div>
        <textarea
          placeholder="Description"
          onChange={(e) => setMessage(e.target.value)}
          rows="10"
          className={styles.textarea}
        >
          {message}
        </textarea>
        <div className={styles.buttonsContainer}>
          <ButtonComponent
            fullWidth={true}
            text="Submit"
            color="primary"
            disabled={!buttonEnabled}
            onclick={submitRequest}
            style={styles.button}
          />
        </div>
      </div>
    </Drawer>
  );
}

FeatureRequestModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

FeatureRequestModal.defaultProps = {};
