import Axios from 'axios';
import CONFIG from 'config';
import { authInterceptor } from 'api/interceptors';

export const connector = Axios.create({
  baseURL: CONFIG.POLYGON.host,
  timeout: 60000,
});

authInterceptor(connector);
