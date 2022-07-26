import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import Man from 'assets/images/chat/man.svg';
import styles from './ChatTile.module.css';

export function ChatTile({ room, type }) {
  const history = useHistory();
  const params = useQueryParams();

  const onClick = () => {
    const roomId = type === 'people' ? room?._id : room?.chat?.roomId;
    if (roomId) {
      params.set('chat', roomId);
      history.push({
        search: params.toString(),
      });
    }
  };

  return (
    <>
      <div onClick={onClick} className={styles.chatBody}>
        <div className={styles.icon}>
          <img src={room?.picture || Man} alt="" />
        </div>
        <div className={styles.center}>
          <div className={styles.line1}>
            {room?.userName || ''}
          </div>
          {type === 'order' && (
            <>
              <div className={styles.line2}>
                Order id : #
                {room.orderId}
                {' '}
                -
                {' '}
                {room.title}
              </div>
              <div className={styles.line3}>
                <div className={styles.status}>
                  {room.status}
                </div>
              </div>
            </>
          )}
        </div>
        {room.unread > 0 && <div className={styles.unread}>{room.unread}</div>}
      </div>
      <div className={styles.divider} />
    </>
  );
}

ChatTile.propTypes = {
  room: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};

ChatTile.defaultProps = {};
