import Axios from 'axios';
import CONFIG from 'config';
import { authInterceptor } from 'api/interceptors';

export const connector = Axios.create({
  baseURL: CONFIG.BECCA.host,
  timeout: 60000,
});

authInterceptor(connector);
