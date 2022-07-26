import { useEffect, useState } from 'react';
import Loader from 'services/loader';
import { Factory, Hedwig, Becca } from 'api';
import Snackbar from 'services/snackbar';
import _ from 'lodash';
import moment from 'moment';
import { useIdle } from './idleTimeout';

export function useInfiniteChats(filters = {}, sorts = {}) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [unread, setUnread] = useState(0);
  const isUserIdle = useIdle();

  const loadMore = async ({ stopIndex = 10 } = {}) => {
    if (loading) {
      return;
    }
    const newPage = Math.floor(stopIndex / 10);
    if (newPage <= page) {
      return;
    }
    if (!hasMore) {
      return;
    }
    try {
      setLoading(true);
      const data = await Factory.getChatRooms(page, filters, sorts);
      setChats(_.uniqBy([...chats, ...data.rooms], '_id'));
      setUnread(data.unread || 0);
      if (data.length === 0) {
        setHasMore(false);
      }
      setPage(page + 1);
    } catch (e) {
      console.error(e);
    } finally {
      Loader.hide();
      setLoading(false);
    }
  };

  const refresh = async () => {
    if (loading) {
      return;
    }
    try {
      setHasMore(true);
      setPage(0);
      setLoading(true);
      const data = await Factory.getChatRooms(0, filters, sorts);
      setChats(data.rooms);
      setUnread(data.unread || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [JSON.stringify(filters), JSON.stringify(sorts)]);

  return [chats, loadMore, hasMore, loading, refresh, unread, isUserIdle];
}

function morphChats(chats) {
  return _.sortBy(Object.entries(
    _.groupBy(chats, c => moment(c.at).format('DD/MM/YYYY'))
  ).map(([key, data]) => ({
    key,
    data,
  })), s => moment(s.key));
}

export function useInfiniteRoom(roomId) {
  const [chats, setChats] = useState([]);
  const [names, setNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const readMessages = async chats => {
    try {
      const ids = chats.filter(x => !x.read).map(x => x._id);
      if (ids.length === 0) {
        return;
      }
      await Hedwig.readChat(roomId, ids);
    } catch (e) {
      Snackbar.showError(e);
      console.error(e);
    }
  };

  const loadMore = async () => {
    if (loading) {
      return;
    }
    if (!hasMore) {
      return;
    }
    try {
      setLoading(true);
      if (page === 0) {
        Loader.show();
      }
      const data = await Hedwig.getChat(roomId, page);
      readMessages(data);
      setChats(_.sortBy(_.uniqBy([...chats, ...data], '_id'), c => moment(c.at)));
      setNames(_.uniq([...names, ...data.filter(s => s.by !== 'you').map(s => s.by.userName)]));
      if (data.length === 0) {
        setHasMore(false);
      }
      setPage(page + 1);
    } catch (e) {
      console.error(e);
      Snackbar.show('Error Occurred', 'error');
    } finally {
      Loader.hide();
      setLoading(false);
    }
  };

  const poll = async () => {
    try {
      const data = await Hedwig.getChat(roomId, 0);
      setChats(_.sortBy(_.uniqBy([...chats, ...data], '_id'), c => moment(c.at)));
      setNames(_.uniq([...names, ...data.filter(s => s.by !== 'you').map(s => s.by.userName)]));
      readMessages(data);
    } catch (e) {
      console.error(e);
      Snackbar.show('Error Occurred', 'error');
    }
  };

  const refresh = () => {
    setPage(0);
    setHasMore(true);
    setChats([]);
    setTimeout(loadMore, 500);
  };
  useEffect(() => {
    const interval = setInterval(poll, 60000);
    refresh();
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [roomId]);

  return [
    morphChats(chats),
    names,
    loadMore,
    poll,
    hasMore,
    loading,
    refresh
  ];
}

export function useInfinitePeopleChats(filters = {}, sorts = {}) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [unread, setUnread] = useState(0);

  const loadMore = async ({ stopIndex = 10 } = {}) => {
    if (loading) {
      return;
    }
    const newPage = Math.floor(stopIndex / 10);
    if (newPage <= page) {
      return;
    }
    if (!hasMore) {
      return;
    }
    try {
      setLoading(true);
      const data = await Becca.getPeopleChatRooms(page, sorts);
      setChats(_.uniqBy([...chats, ...data.rooms], '_id'));
      setUnread(data.unread);
      if (data.length === 0) {
        setHasMore(false);
      }
      setPage(page + 1);
    } catch (e) {
      console.error(e);
    } finally {
      Loader.hide();
      setLoading(false);
    }
  };

  const refresh = async () => {
    if (loading) {
      return;
    }
    try {
      setHasMore(true);
      setPage(0);
      setLoading(true);
      const data = await Becca.getPeopleChatRooms(0, sorts);
      setChats(data.rooms);
      setUnread(data.unread);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [JSON.stringify(filters), JSON.stringify(sorts)]);

  return [chats, loadMore, hasMore, loading, refresh, unread];
}
