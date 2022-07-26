import {
  BrowserRouter as Router, Route, Switch
} from 'react-router-dom';
import React, { lazy, Suspense, useState } from 'react';
import Storage from 'services/storage';
import { Loading } from 'components/shared/Loading';
import { useCheckForWebUpdate } from 'hooks/sync';

const Main = lazy(() => import(/* webpackChunkName: "main-container" */ 'layouts/LoggedInMainContainer'));
const Login = lazy(() => import(/* webpackChunkName: "login" */ 'containers/login/Login'));
const NonLoggedInWeb = lazy(() => import(/* webpackChunkName: "non-logged-in-web" */ 'layouts/NonLoggedInWeb'));

function Container() {
  useCheckForWebUpdate();
  const [loggedIn, setLogin] = useState(Storage.isLoggedIn());

  return (
    <Router>
      <Suspense
        fallback={(
          <Loading />
        )}>
        {loggedIn ? (
          <Main />
        ) : (
          <Switch>
            <Route path="/web/*">
              <NonLoggedInWeb />
            </Route>
            <Route path="*">
              <Login onLogin={() => setLogin(true)} />
            </Route>
          </Switch>
        )}
      </Suspense>
    </Router>
  );
}

export default Container;
