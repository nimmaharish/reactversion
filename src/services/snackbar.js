let setMessage = () => {};
let clearMessage = () => {};

export const setCallbacks = (set, unset) => {
  setMessage = set;
  clearMessage = unset;
};

const defaultMessage = 'Something went wrong. Please try again';

const show = (message, severity = 'success', timeout = 4000) => {
  if (setMessage) {
    if (typeof message !== 'string') {
      message = defaultMessage;
    }
    setMessage(message, severity, timeout);
  }
};

const clear = () => clearMessage && clearMessage();

const showError = (err = defaultMessage) => {
  if (err?.response?.status < 500) {
    return show(
      err?.response?.data?.message || err, 'error'
    );
  }
  if (err.message) {
    return show(err.message, 'error');
  }
  return show(err, 'error');
};

const SnackBar = {
  show,
  clear,
  showError,
};

export default SnackBar;
