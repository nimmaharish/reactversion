let callback = () => {};

export const setCallback = cb => {
  callback = cb;
};

const show = () => {
  if (callback) {
    callback(true);
  }
};

const hide = () => {
  if (callback) {
    callback(false);
  }
};

const Loader = {
  show,
  hide,
};

export default Loader;
