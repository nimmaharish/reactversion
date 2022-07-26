import React from 'react';
import PropTypes from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';
import { useToggle } from 'hooks/common';
import { Clickable } from 'phoenix-components';
import styles from './Note.module.css';

export function Note({ note }) {
  const [open, setOpen] = useToggle();

  if (!note || note?.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <InfoIcon style={{ fontSize: 24, color: 'var(--green)' }} />
      <div className={styles.note}>
        {open ? note : note.slice(0, 80)}
        {note.length > 80 && (
          <Clickable className={styles.more} onClick={setOpen}>
            {open ? 'less' : 'more...'}
          </Clickable>
        )}
      </div>
    </div>
  );
}

Note.propTypes = {
  note: PropTypes.string
};

Note.defaultProps = {
  note: null
};
