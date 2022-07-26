// GLOBAL gapi
/* eslint-disable no-undef */
const waitForGapi = () => new Promise(resolve => {
  const interval = setInterval(() => {
    if (gapi) {
      resolve();
      clearInterval(interval);
    }
  }, 1000);
});

const GAuth = {
  waitForGapi,
};

export default GAuth;
