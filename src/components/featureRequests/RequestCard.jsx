import React from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardContent, Dialog, DialogActions, DialogContent
} from '@material-ui/core';
import cx from 'classnames';
import moment from 'moment';
import ButtonComponent from 'containers/profile/ButtonComponent';
import { useToggle } from 'hooks/common';
import styles from './RequestCard.module.css';

export function RequestCard({ data }) {
  const [open, toggle] = useToggle(false);
  return (
    <>
      {open && (
        <Dialog maxWidth="md" open={true} onClose={toggle} fullWidth>
          <DialogContent>
            <div className={styles.firstRow}>
              <div className={styles.title}>{data.title}</div>
              <div className={cx(styles.chip, styles[data.status])}>{data.status}</div>
            </div>
            <div className={styles.desc}>{data.message}</div>
            {data.note?.length > 0 && (
              <div className={styles.note}>
                Note From Windo :-
                <br />
                {data.note}
              </div>
            )}
            <div className={styles.spacer} />
            <div className={styles.right}>
              <div className={styles.date}>
                Submitted At :
                {' '}
                {moment(data.createdAt).format('lll')}
              </div>
              {' '}
              <div className={styles.date}>
                Last Updated At :
                {' '}
                {moment(data.updatedAt).format('lll')}
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <ButtonComponent
              size="small"
              color="primary"
              text="Close"
              onclick={toggle}
            />
          </DialogActions>
        </Dialog>
      )}
      <Card className={cx(styles.card, styles[data.status])}>
        <CardContent className={styles.content}>
          <div className={styles.firstRow}>
            <div className={styles.title}>{data.title.slice(0, 50)}</div>
            <div className={cx(styles.chip, styles[data.status])}>{data.status}</div>
          </div>
          <div className={styles.desc}>{data.message.slice(0, 100)}</div>
          <div className={styles.spacer} />
          <div className={styles.firstRow}>
            <div className={styles.date}>{moment(data.updatedAt).format('lll')}</div>
            <ButtonComponent
              size="small"
              color="primary"
              text="More"
              onclick={toggle}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}

RequestCard.propTypes = {
  data: PropTypes.object.isRequired,
};

RequestCard.defaultProps = {};
