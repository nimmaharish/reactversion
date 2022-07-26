import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import 'react-virtualized/styles.css';
import './index.css';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import CONFIG from 'config';
import { init as initApm } from '@elastic/apm-rum';
import App from './App';
import * as serviceWorker from './serviceWorker';

try {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.REACT_APP_ENV,
    integrations: [new Integrations.BrowserTracing()],
    ignoreErrors: [/Request failed/i, /XMLHttpRequest/i, /ChunkLoadError/i],
    tracesSampleRate: 0.2,
    release: process.env.REACT_APP_ENV === 'production'
      ? CONFIG.BUILD.version
      : `${process.env.REACT_APP_ENV}-${CONFIG.BUILD.version}`,
    enabled: process.env.REACT_APP_ENV !== 'development',
  });
} catch (e) {
  console.error(e);
}

try {
  if (process.env.REACT_APP_ENV !== 'development') {
    initApm({
      serviceName: 'phoenix',
      serverUrl: 'https://observability-prod-deployment.apm.ap-south-1.aws.elastic-cloud.com',
      serviceVersion: CONFIG.BUILD.version,
      environment: process.env.REACT_APP_ENV,
      enabled: true,
    });
  }
} catch (e) {
  console.error(e);
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

if (process.env.REACT_APP_ENV !== 'development') {
  serviceWorker.register();
} else {
  serviceWorker.unregister();
}
