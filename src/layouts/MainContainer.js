import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import loader from 'assets/images/loader.gif';
import { isEmpty } from 'lodash';
import { useShop } from 'hooks';
import { Loading } from 'components/shared/Loading';
import { useCheckForUpdate, useSyncFcmToken } from 'hooks/sync';
import { useUser } from 'hooks/user';
import { useStartEventsCapture } from 'hooks/events';

const LoggedInContainer = lazy(
  () => import(/* webpackChunkName: "loggedin-container" */ 'layouts/LoggedInContainer'),
);

const CreateShop = lazy(
  () => import(/* webpackChunkName: "create-shop-container" */ 'containers/shop/CreateShop'),
);

function MainContainer() {
  useCheckForUpdate();
  useSyncFcmToken();
  const [shop, refresh, loading, loaded] = useShop(false);
  const [user, refreshUser] = useUser();
  useStartEventsCapture(user, shop);

  if (loading || !loaded) {
    return (
      <Loading />
    );
  }

  const renderComponent = () => {
    if (isEmpty(shop)) {
      return (
        <Switch>
          <Route path="*" exact>
            <CreateShop />
          </Route>
        </Switch>
      );
    }

    return (
      <LoggedInContainer shop={shop} refresh={refresh} user={user} refreshUser={refreshUser} />
    );
  };

  return (
    <Suspense
      fallback={(
        <div className="loader">
          <img src={loader} height="100px" width="100px" alt="" />
        </div>
      )}>

      {renderComponent()}
    </Suspense>
  );
}

export default MainContainer;
