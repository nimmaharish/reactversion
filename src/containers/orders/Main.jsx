import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useDesktop } from 'contexts';
import List from './List';
import Ratings from './Ratings';
import ListDesktop from './ListDesktop';
import Multi from './Multi/View';
import ThankYou from './ThankYou';

function Main() {
  const { path } = useRouteMatch();
  const isDesktop = useDesktop();
  return (
    <Switch>
      {!isDesktop && (
        <Route exact path={path}>
          <List />
        </Route>
      )}
      {isDesktop && (
        <Route exact path={path}>
          <ListDesktop />
        </Route>
      )}
      <Route exact path={`${path}/reviews`}>
        <Ratings />
      </Route>
      <Route exact path={`${path}/multi`}>
        <Multi />
      </Route>
      <Route exact path={`${path}/thankyou`}>
        <ThankYou />
      </Route>
    </Switch>
  );
}

export default Main;
