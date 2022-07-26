import React, { useEffect, useState } from 'react';
import { setCallback } from 'services/loader';
import { Loading } from 'components/shared/Loading';

function Loader() {
  const [show, setShow] = useState(false);
  let timer = null;
  const callback = val => {
    if (val === true) {
      if (timer) {
        clearTimeout(timer);
      }
      setShow(true);
      timer = setTimeout(() => {
        setShow(false);
      }, 120 * 1000);
    } else {
      if (timer) {
        clearTimeout(timer);
      }
      setShow(false);
    }
  };

  useEffect(() => {
    setCallback(callback);
  }, [setShow]);

  if (!show) {
    return null;
  }

  return (
    <Loading />
  );
}

export default Loader;
