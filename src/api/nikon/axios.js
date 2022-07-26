import Axios from 'axios';
import CONFIG from 'config';
import { authInterceptor } from 'api/interceptors';

export const connector = Axios.create({
  baseURL: CONFIG.NIKON.host,
  timeout: 30000,
});

authInterceptor(connector);
