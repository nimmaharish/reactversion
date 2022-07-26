import Loader from 'services/loader';
import Storage from 'services/storage';

let counter = 0;

export const loaderInterceptor = (axios) => {
  axios.interceptors.request.use(config => {
    if (counter === 0) {
      Loader.show();
    }
    counter++;
    return config;
  }, error => Promise.reject(error));

  axios.interceptors.response.use(res => {
    counter--;
    if (counter === 0) {
      Loader.hide();
    }
    return Promise.resolve(res);
  }, err => {
    counter--;
    if (counter === 0) {
      Loader.hide();
    }
    return Promise.reject(err);
  });
};

export const authInterceptor = (axios) => {
  axios.interceptors.request.use(config => {
    config.headers.Authorization = Storage.getItem('token');
    return config;
  }, error => error);

  axios.interceptors.response.use(res => res, err => Promise.reject(err));
};
