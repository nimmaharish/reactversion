import CONFIG from 'config';
import axios from './client';

const getCountry = async () => {
  const { data } = await axios.get('https://api.bigdatacloud.net/data/ip-geolocation', {
    params: {
      key: CONFIG.BIGDATACLOUD.key,
      localityLanguage: 'en',
    },
  });
  return data?.country ?? {};
};

const External = {
  getCountry,
};

export default External;
