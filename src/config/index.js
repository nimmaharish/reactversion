import meta from '../meta.json';

const CONFIG = Object.freeze({
  BUILD: {
    version: meta.version,
    date: meta.date,
  },
  GAUTH: {
    CLIENT_ID: process.env.REACT_APP_GAUTH_CLIENT_ID
  },
  BECCA: {
    host: process.env.REACT_APP_BECCA_HOST
  },
  HEIMDALL: {
    host: process.env.REACT_APP_HEIMDALL_HOST
  },
  HEDWIG: {
    host: process.env.REACT_APP_HEDWIG_HOST
  },
  FACTORY: {
    host: process.env.REACT_APP_FACTORY_HOST,
  },
  NIKON: {
    host: process.env.REACT_APP_NIKON_HOST,
  },
  SNITCH: {
    host: process.env.REACT_APP_SNITCH_HOST,
  },
  PIGGY: {
    host: process.env.REACT_APP_PIGGY_HOST,
  },
  CASHFREE: {
    host: process.env.REACT_APP_CASHFREE_HOST,
  },
  STRIPE: {
    key: process.env.REACT_APP_STRIPE_KEY,
  },
  BIGDATACLOUD: {
    key: process.env.REACT_APP_BIGDATACLOUD_API_KEY
  },
  GMAPS: {
    key: process.env.REACT_APP_GMAPS_API_KEY,
  },
  ENV: process.env.REACT_APP_ENV,
  TINYMCE: {
    key: 'jk7y6v6dbe2h16qh13q5klle5sz76ddgevc6ph3v1sa4bgu1'
  },
  MOENGAGE: {
    id: process.env.REACT_APP_MOENGAGE_APP_ID,
  },
  FB: {
    id: process.env.REACT_APP_FB_APP_ID,
  },
  POLYGON: {
    host: process.env.REACT_APP_POLYGON_HOST
  },
});

export default Object.freeze(CONFIG);
