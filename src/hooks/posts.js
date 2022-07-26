import { useEffect, useState } from 'react';
import Loader from 'services/loader';
import { Nikon } from 'api';
import { uniqBy, uniq } from 'lodash';
import Snackbar from 'services/snackbar';

export function usePost(id) {
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!id) {
      return;
    }
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      setPost(await Nikon.getPost(id));
    } catch (e) {
      console.error(e);
      Snackbar.show('error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [id]);

  return [post, loading, refresh];
}

export function usePosts(func, filters = {}, sorts = {}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      if (page === 0) {
        Loader.show();
      }
      const data = await func(page, filters, sorts);
      const uniquePosts = uniqBy([...posts, ...data], 'pid');
      setPosts(uniquePosts);
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

  const loadMore = async ({ stopIndex = 15 } = {}) => {
    if (loading) {
      return;
    }
    const newPage = Math.floor(stopIndex / 15);
    if (newPage <= page) {
      return;
    }
    if (!hasMore) {
      return;
    }
    await load();
  };

  const refresh = async () => {
    try {
      setLoading(true);
      const data = await func(0, filters, sorts);
      const uniquePosts = uniqBy([...data], 'pid');
      setPosts(uniquePosts);
      setPage(0);
      setHasMore(true);
      setLoading(false);
    } catch (e) {
      console.error(e);
      Snackbar.show('Error Occurred', 'error');
    }
  };

  useEffect(() => {
    refresh();
  }, [func, JSON.stringify(filters), JSON.stringify(sorts)]);

  return [posts, loadMore, hasMore, loading, refresh];
}

export function useLivePosts(filters = {}, sorts = {}) {
  return usePosts(Nikon.getLivePosts, filters, sorts);
}

export function useDraftPosts(filters = {}, sorts = {}) {
  return usePosts(Nikon.getDraftPosts, filters, sorts);
}

export function useShoppablePosts(filters = {}, sorts = {}) {
  return usePosts(Nikon.getShoppablePosts, filters, sorts);
}

export function usePostsMedia(initialPosts = [], initialPage = 0, filters = {}, sorts = {}) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      if (page === 0) {
        Loader.show();
      }
      const data = await Nikon.getPostsMedia(page, filters, sorts);
      const uniquePosts = uniq([...posts, ...data]);
      setPosts(uniquePosts);
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

  const loadMore = async ({ stopIndex = 15 } = {}) => {
    if (loading) {
      return;
    }
    const newPage = Math.floor(stopIndex / 15);
    if (newPage <= page) {
      return;
    }
    if (!hasMore) {
      return;
    }
    await load();
  };

  const refresh = async () => {
    try {
      setLoading(true);
      const data = await Nikon.getPostsMedia(0, filters, sorts);
      const uniquePosts = uniq([...data]);
      setPosts(uniquePosts);
      setPage(0);
      setHasMore(true);
      setLoading(false);
    } catch (e) {
      console.error(e);
      Snackbar.show('Error Occurred', 'error');
    }
  };

  useEffect(() => {
    refresh();
  }, [JSON.stringify(filters), JSON.stringify(sorts)]);

  return [posts, loadMore, hasMore, loading, refresh];
}
