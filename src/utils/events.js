import CONFIG from 'config';
import * as Sentry from '@sentry/react';

function setGlobalData(data = {}) {
  window.__WINDO_DATA = {
    ...data,
    env: CONFIG.ENV,
  };
}

function patchGlobalData(data = {}) {
  if (!window.__WINDO_DATA) {
    window.__WINDO_DATA = {};
  }
  window.__WINDO_DATA = {
    env: CONFIG.ENV,
    ...window.__WINDO_DATA,
    ...data,
  };
}

function resetGlobalData() {
  window.__WINDO_DATA = {};
}

function emitEvent(name, data = {}) {
  try {
    if (!window.dataLayer) {
      window.dataLayer = [];
    }
    window.dataLayer.push({
      event: 'custom_event',
      eventLabel: name,
      eventData: data,
    });
  } catch (e) {
    Sentry.captureException(e);
  }
}

async function loadMoEngage(data) {
  if (window._Moengage) {
    return window._Moengage;
  }

  if (!window.moe) {
    const script = document.createElement('script');
    // eslint-disable-next-line max-len
    script.innerHTML = '(function(i,s,o,g,r,a,m,n){i.moengage_object=r;t={};q=function(f){return function(){(i.moengage_q=i.moengage_q||[]).push({f:f,a:arguments})}};f=[\'track_event\',\'add_user_attribute\',\'add_first_name\',\'add_last_name\',\'add_email\',\'add_mobile\',\'add_user_name\',\'add_gender\',\'add_birthday\',\'destroy_session\',\'add_unique_user_id\',\'moe_events\',\'call_web_push\',\'track\',\'location_type_attribute\'],h={onsite:["getData","registerCallback"]};for(k in f){t[f[k]]=q(f[k])}for(k in h)for(l in h[k]){null==t[k]&&(t[k]={}),t[k][h[k][l]]=q(k+"."+h[k][l])}a=s.createElement(o);m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m);i.moe=i.moe||function(){n=arguments[0];return t};a.onload=function(){if(n){i[r]=moe(n)}}})(window,document,\'script\',\'https://cdn.moengage.com/webpush/moe_webSdk.min.latest.js\',\'Moengage\')';
    window.document.body.appendChild(script);
  }

  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (window.moe) {
        clearInterval(interval);
        window._Moengage = window.moe({
          app_id: CONFIG.MOENGAGE.id,
          debug_logs: CONFIG.ENV === 'production' ? 0 : 1,
        });
        window._Moengage.add_user_name(data.name);
        if (data.email) {
          window._Moengage.add_email(data.email);
        }
        if (data.phone) {
          window._Moengage.add_mobile(data.phone);
        }
        if (data.id) {
          window._Moengage.add_unique_user_id(data.id);
        }
        resolve();
      }
    }, 1000);
  });
}

async function initMoEngageWeb(data) {
  try {
    await loadMoEngage(data);
  } catch (e) {
    Sentry.captureException(e);
  }
}

async function trackMoengageEvent(event, data) {
  try {
    if (window._Moengage) {
      const moe = window._Moengage;
      await moe.track_event(event, data);
    }
  } catch (e) {
    Sentry.captureException(e);
  }
}

async function waitForFB() {
  return new Promise(resolve => {
    if (!window.fbq) {
      let counter = 0;
      const interval = setInterval(() => {
        if (counter > 10) {
          clearInterval(interval);
          resolve();
          return;
        }
        if (window.fbq) {
          clearInterval(interval);
          resolve();
        }
        counter++;
      }, 1000);
    } else {
      resolve();
    }
  });
}

async function initFbWeb(data) {
  await waitForFB();
  if (window.fbq) {
    if (data.email) {
      window.fbq('init', CONFIG.FB.id, {
        em: data.email,
      });
    }
  }
}

async function trackFbEvent(event, data) {
  try {
    if (window.fbq) {
      window.fbq('trackCustom', event, data);
    }
  } catch (e) {
    Sentry.captureException(e);
  }
}

async function initializeWebEvents(data) {
  await initMoEngageWeb(data);
  await initFbWeb(data);

  window._logEvent = async (event, eventData) => {
    await Promise.all([
      trackMoengageEvent(event, eventData),
      trackFbEvent(event, eventData)
    ]);
  };
}

const EventManager = {
  setGlobalData,
  resetGlobalData,
  patchGlobalData,
  emitEvent,
  initializeWebEvents,
};

export default EventManager;
