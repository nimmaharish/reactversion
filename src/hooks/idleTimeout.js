/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import { useEffect, useState } from 'react';

export function useIdle() {
  const [timer, setTimer] = useState(60); // 1 minute by default
  useEffect(() => {
    const myInterval = setInterval(() => {
      const el = document.getElementById('root');
      if (timer > 0) {
        setTimer(timer - 1);
        if (el) {
          el.setAttribute('isIdle', false);
        }
      } else if (el) {
        el.setAttribute('isIdle', true);
      }
    }, 1000);
    const resetTimeout = () => {
      setTimer(15);
    };
    const events = [
      'load',
      'mousemove',
      'mousedown',
      'click',
      'scroll',
      'keypress'
    ];
    for (const i in events) {
      window.addEventListener(events[i], resetTimeout);
    }
    return () => {
      clearInterval(myInterval);
      for (const i in events) {
        window.removeEventListener(events[i], resetTimeout);
      }
    };
  });

  return timer === 0;
}
