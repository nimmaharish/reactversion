import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useInfiniteRoom, useQueryParams } from 'hooks';
import { SendMessage } from 'components/chat/SendMessage';
import moment from 'moment';
import { BlackButton } from 'components/buttons';
import Man from 'assets/images/chat/man.svg';
import chevronLeft from 'assets/images/chat/arrowBack.svg';
import styles from './ChatRoomDrawer.module.css';

const formatAt = (at) => moment(at).format('hh:mm a');

export function ChatRoomDrawer({ roomId }) {
  const history = useHistory();
  const params = useQueryParams();
  const isPeopleChat = params.get('type') === 'people' || params.get('type') === undefined;
  const [chats, names, loadMore, poll, hasMore] = useInfiniteRoom(roomId);

  useEffect(() => {
    const container = document.getElementById('chatRoom');
    function handleResize() {
      if (container) {
        container.style.height = `${window.innerHeight - 90}px`;
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    if (container) {
      setTimeout(() => {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth'
        });
      }, 500);
    }
  });

  return (
    <Drawer
      anchor="left"
      open={true}
      onClose={() => history.goBack()}
    >
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div onClick={history.goBack}>
            <img className={styles.back} src={chevronLeft} alt="" />
          </div>
          <div className={styles.heading}>
            {names.join(', ')}
          </div>
          <div>&nbsp;</div>
        </div>
        <div className={styles.chatRoom} id="chatRoom">
          {hasMore && (
            <div className={styles.loadMoreContainer}>
              <BlackButton onClick={loadMore} className={styles.loadMore}>
                Load More
              </BlackButton>
            </div>
          )}
          {chats.map(({ key, data: list }) => (
            <div key={key} className={styles.dateBlock}>
              <div className={styles.dateHeading}>{key}</div>
              {list.map(chat => (
                <div key={chat._id} className={styles.chat}>
                  {chat.by === 'you' ? (
                    <div className={styles.you}>
                      <div className={styles.message}>
                        {chat.message.data}
                        <div className={styles.at}>{formatAt(chat.at)}</div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.otherUser}>
                      <img src={chat.by?.picture || Man} alt="" />
                      <div className={styles.message}>
                        {chat.message.data}
                        <div className={styles.at}>{formatAt(chat.at)}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
          {isPeopleChat && chats.length === 0 && (
            <div className={styles.info}> Customer visited your store! </div>
          )}
        </div>
        <SendMessage
          roomId={roomId}
          refresh={poll}
        />
      </div>
    </Drawer>
  );
}

ChatRoomDrawer.propTypes = {
  roomId: PropTypes.string.isRequired,
};

ChatRoomDrawer.defaultProps = {};
