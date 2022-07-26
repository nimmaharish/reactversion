import { useEffect, useState } from 'react';
import { Becca } from 'api';
import Snackbar from 'services/snackbar';

export function useToggle(initial = false) {
  const [state, setState] = useState(initial);

  const toggle = () => setState(pState => !pState);

  return [state, toggle, setState];
}

export function useHashTags(query = '') {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!query.length < 3) {
      return;
    }
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      setTags(await Becca.getHashTags(query));
    } catch (e) {
      console.error(e);
      Snackbar.show('something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [query]);

  return [tags, loading, refresh];
}

export function useCategories() {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      setCategories(await Becca.getCategories());
    } catch (e) {
      console.error(e);
      Snackbar.show('something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return [categories, loading, refresh];
}

export function useUiConfig(name) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      setData(await Becca.getUiConfig(name));
    } catch (e) {
      console.error(e);
      Snackbar.show('something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [name]);

  return [data, loading, refresh];
}

export function useSeo() {
  return useUiConfig('seo');
}

export function useChatSettings() {
  return useUiConfig('chat');
}

export function useExpressCheckoutSettings() {
  return useUiConfig('expressCheckout');
}

export function useLayoutConfig() {
  return useUiConfig('layoutConfig');
}

export function useThemeConfig() {
  const [themeConfig, setThemeConfig] = useState({});
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      setThemeConfig(await Becca.getUiConfig('themeConfig'));
    } catch (e) {
      console.error(e);
      Snackbar.show('something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return [themeConfig, setThemeConfig, loading, refresh];
}
