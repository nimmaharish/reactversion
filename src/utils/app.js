import Loader from 'services/loader';
import { inSeries } from 'utils/parallel';

export async function updateWebApp() {
  Loader.show();
  try {
    if ('caches' in window) {
      const keys = await caches.keys();
      await inSeries(keys, key => caches.delete(key));
      window.location.reload(true);
    }
  } catch (e) {
    console.error(e);
  } finally {
    Loader.hide();
  }
}
