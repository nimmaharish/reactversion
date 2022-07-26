import React, { useEffect } from 'react';
import {
  Drawer, makeStyles, Tab, Tabs
} from '@material-ui/core';
import { useInfiniteChats, useInfinitePeopleChats, useQueryParams } from 'hooks';
import { useHistory, useLocation } from 'react-router-dom';
import { InfiniteLoader, List } from 'react-virtualized';
import { ChatTile } from 'components/chat/ChatTile';
import { Loading } from 'components/shared/Loading';
import { ChatRoomDrawer } from 'components/chat/ChatRoomDrawer';
import emptyChat from 'assets/v2/chat/emptyChat.svg';
import chevronLeft from 'assets/images/chat/arrowBack.svg';
import { ChatIcon } from 'components/chat/ChatIcon';
import PropTypes from 'prop-types';
import styles from './ChatDrawer.module.css';

const useStyles = makeStyles(() => ({
  indicator: {
    backgroundColor: 'var(--primary)',
    height: '4px',
    top: '36px'
  },
  tabsWrapper: {
    height: '60px',
  },
  root: {
    textTransform: 'capitalize'
  }
}));

export function ChatDrawer({ isFixed }) {
  const queryParams = useQueryParams();
  const location = useLocation();
  const hide = location.pathname === '/products';
  const history = useHistory();
  const open = queryParams.has('chat');
  const roomId = queryParams.get('chat');
  const type = queryParams.get('type') || 'people';
  const classes = useStyles();
  const value = type === 'orders' ? 1 : 0;
  const [chats, loadMore, hasMore, loading, refreshOrderChats, orderUnread] = useInfiniteChats();
  const [
    peopleChats, peopleLoadMore,
    peopleHasMore, peopleLoading, refreshPeopleChats, peopleUnread
  ] = useInfinitePeopleChats({}, {
    updatedAt: -1,
  });

  useEffect(() => {
    if (type === 'people') {
      refreshPeopleChats();
    } else if (type === 'orders') {
      refreshOrderChats();
    }
  }, [type]);

  const refresh = () => {
    const el = document.getElementById('root');
    if ((el?.getAttribute('isIdle') === 'true')) {
      return;
    }
    refreshPeopleChats();
    refreshOrderChats();
  };

  useEffect(() => {
    if (!open) {
      const interval = setInterval(refresh, 30000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [open]);

  useEffect(() => {
    refreshPeopleChats();
    refreshOrderChats();
  }, [open]);

  const handleChange = (event, newValue) => {
    queryParams.set('type', newValue === 1 ? 'orders' : 'people');
    history.push({ search: queryParams.toString() });
  };

  const rowCount = hasMore ? 10000 : chats.length;
  const peopleRowCount = peopleHasMore ? 10000 : peopleChats.length;

  const isLoaded = i => !!chats[i];
  const isPeopleLoaded = i => !!peopleChats[i];

  const height = window.screen.height - 120;

  // eslint-disable-next-line react/no-multi-comp
  const renderItem = (chat) => {
    const room = chats[chat.index];
    return (
      <div key={chat.key} style={chat.style} className={styles.chatContainer}>
        <ChatTile type="order" room={room} />
      </div>
    );
  };

  // eslint-disable-next-line react/no-multi-comp
  const renderPeopleItem = (chat) => {
    const room = peopleChats[chat.index];
    return (
      <div key={chat.key} style={chat.style} className={styles.chatContainer}>
        <ChatTile type="people" room={room} />
      </div>
    );
  };

  if (value === 1 && chats.length === 0 && loading && open) {
    return <Loading />;
  }

  if (value === 0 && peopleChats.length === 0 && peopleLoading && open) {
    return <Loading />;
  }

  if (!open && !hide) {
    return <ChatIcon isFixed={isFixed} unread={peopleUnread + orderUnread} />;
  }

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={() => history.goBack()}
    >
      <div className={styles.container} id="chatSection">
        <div className={styles.topBar}>
          <div
            onClick={() => {
              queryParams.delete('chat');
              queryParams.delete('type');
              history.push({ search: queryParams.toString() });
            }}>
            <img className={styles.back} src={chevronLeft} alt="" />
          </div>
          <div className={styles.heading}>
            Chats
          </div>
          <div>&nbsp;</div>
        </div>
        <Tabs
          centered
          value={value}
          onChange={handleChange}
          className={classes.tabsWrapper}
          TabIndicatorProps={{ className: classes.indicator }}
        >
          <Tab
            classes={{ root: classes.root }}
            label={peopleUnread > 0 ? `People (${peopleUnread}+)` : 'People'}
          />
          <Tab
            label={orderUnread > 0 ? `Orders (${orderUnread}+)` : 'Orders'}
            classes={{ root: classes.root }}
          />
        </Tabs>
        {chats.length > 0 && value === 1 && (
          <InfiniteLoader
            loadMoreRows={loadMore}
            isRowLoaded={isLoaded}
            rowCount={rowCount}
            minimumBatchSize={10}
          >
            {({
              onRowsRendered,
              registerChild
            }) => (
              <List
                height={height}
                onRowsRendered={onRowsRendered}
                ref={registerChild}
                rowCount={chats.length}
                rowHeight={80}
                rowRenderer={renderItem}
                width={window.screen.width}
              />
            )}
          </InfiniteLoader>
        )}
        {peopleChats.length > 0 && value === 0 && (
          <InfiniteLoader
            loadMoreRows={peopleLoadMore}
            isRowLoaded={isPeopleLoaded}
            rowCount={peopleRowCount}
            minimumBatchSize={10}
          >
            {({
              onRowsRendered,
              registerChild
            }) => (
              <List
                height={height}
                onRowsRendered={onRowsRendered}
                ref={registerChild}
                rowCount={peopleChats.length}
                rowHeight={80}
                rowRenderer={renderPeopleItem}
                width={window.screen.width}
              />
            )}
          </InfiniteLoader>
        )}
        {(chats.length === 0 || peopleChats.length === 0) && (
          <div className={styles.emptyChat}>
            <img src={emptyChat} alt="" />
            <div className={styles.emptyProductText}>
              Looks like you've not started any conversations yet!
            </div>
          </div>
        )}
      </div>
      {roomId?.length > 0 && (
        <ChatRoomDrawer roomId={roomId} />
      )}
    </Drawer>
  );
}

ChatDrawer.propTypes = {
  isFixed: PropTypes.bool
};

ChatDrawer.defaultProps = {
  isFixed: true
};
