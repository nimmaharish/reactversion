import { useLocation } from 'react-router-dom';
import React, { lazy } from 'react';

const Main = lazy(() => import(/* webpackChunkName: "main-container" */ 'layouts/MainContainer'));
const LoggedInWeb = lazy(
  () => import(/* webpackChunkName: "loggedin-web-layout" */ 'layouts/LoggedInWeb'),
);

function LoggedInMainContainer() {
  const location = useLocation();

  if (location.pathname.startsWith('/web')) {
    return <LoggedInWeb />;
  }

  return <Main />;
}

export default LoggedInMainContainer;
