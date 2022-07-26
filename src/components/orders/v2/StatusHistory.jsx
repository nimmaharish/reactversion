import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent } from '@material-ui/core';
import { Clickable } from 'phoenix-components';
import closeIcon from 'assets/images/orders/list/close.svg';
import { useDesktop, useShop } from 'contexts';
import moment from 'moment';
import greenDot from 'assets/v2/orders/greenDot.svg';
import infoIcon from 'assets/v2/orders/info.svg';
import _ from 'lodash';
import styles from './StatusHistory.module.css';

export function StatusHistory({
  history,
  onClose,
  type
}) {
  const isDesktop = useDesktop();
  const { currency } = useShop();
  return (
    <Dialog
      open={true}
      maxWidth={isDesktop ? 'xs' : 'md'}
      fullWidth
      onClose={onClose}
    >
      <DialogContent>
        <div className="flexBetween">
          <div className={styles.heading}>
            {type}
            {' '}
            Status History
          </div>
          <Clickable
            onClick={onClose}>
            <img src={closeIcon} alt="" />
          </Clickable>
        </div>
        <div>
          <div className={styles.subHeadingContainer}>
            <div>Status</div>
            <div>Date & Time</div>
          </div>
          {history.map(item => (
            <div className={styles.item} key={item._id}>
              <img src={greenDot} alt="" />
              <div className={styles.column}>
                <div className={styles.firstRow}>
                  <div className={styles.status}>
                    {item.status}
                    {item?.metaData?.amount > 0 && ` (${currency} ${item?.metaData?.amount.toFixed(2)})`}
                  </div>
                  <div className={styles.dateContainer}>
                    <div>
                      {moment(item.date)
                        .format('DD MMM, YYYY')}
                    </div>
                    <div>
                      {moment(item.date)
                        .format('HH:mmA')}
                    </div>
                  </div>
                </div>
                {!_.isEmpty(item?.note) && (
                  <div className={styles.note}>
                    <img src={infoIcon} alt="" />
                    <div>
                      <div className={styles.noteHeading}>Update Status Note</div>
                      <div className={styles.noteText}>
                        {item.note}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

StatusHistory.propTypes = {
  onClose: PropTypes.func.isRequired,
  history: PropTypes.array.isRequired,
  type: PropTypes.string,
};

StatusHistory.defaultProps = {
  type: '',
};
