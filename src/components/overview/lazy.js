import { lazy } from 'react';

export const QRCode = lazy(() => import(/* webpackChunkName: "overview-scan-qr-code" */
  './QRCode'
));

export const QrPopUp = lazy(() => import(/* webpackChunkName: "overview-scan-qr-code-popup" */
  './QrPopUp'
));
