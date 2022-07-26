import React from 'react';
import { useShop } from 'hooks';
import { useUser } from 'hooks/user';
import { UserContext } from 'contexts';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Subscriptions } from 'containers/web/Subscriptions';

function Container() {
  const [shop, refreshShop] = useShop();
  const [user, refreshUser] = useUser();
  return (
    <UserContext.Provider
      value={{
        shop,
        refreshShop,
        user,
        refreshUser,
      }}
    >
      <Switch>
        <Route path="/web/subscriptions">
          <Subscriptions />
        </Route>
        <Redirect to="/" path="*" />
      </Switch>
    </UserContext.Provider>
  );
}

export default Container;
