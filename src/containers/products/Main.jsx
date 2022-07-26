import React, { lazy } from 'react';
import {
  Route, Switch, useHistory, useLocation, useRouteMatch
} from 'react-router-dom';
import { useDesktop } from 'contexts';
import { Tabs } from 'phoenix-components/lib/containers';
import styles from './Main.module.css';

const Create = lazy(
  () => import(/* webpackChunkName: "create-product" */ './CreateProduct'),
);

const List = lazy(
  () => import(/* webpackChunkName: "products-list" */ './List'),
);

const Catalog = lazy(
  () => import(/* webpackChunkName: "catalog-list" */ './Catalog/List'),
);

const CatalogDetail = lazy(
  () => import(/* webpackChunkName: "catalog-details" */ './Catalog/View'),
);

const Variants = lazy(
  () => import(/* webpackChunkName: "variants" */ 'containers/variants/Variants'),
);

const UserProfile = lazy(
  () => import(/* webpackChunkName: "user-post-profile" */ 'containers/userProfile/UserProfile'),
);

const ReviewPage = lazy(() => import(/* webpackChunkName: "ratings-sku" */
  './Ratings'
));

const tabs = [
  {
    label: 'Products',
    value: '/products',
  },
  {
    label: 'Collections',
    value: '/products/catalog',
  },
  {
    label: 'Gallery',
    value: '/products/profile',
  }
];

function Main() {
  const history = useHistory();
  const { pathname } = useLocation();
  const { path } = useRouteMatch();
  const isDesktop = useDesktop();
  const catalogPath = '/products/catalog';
  const postsPath = '/products/profile';
  const productsPath = '/products';

  const show = pathname.indexOf(catalogPath) > -1 || pathname === postsPath || pathname === productsPath;

  const handleChange = (value) => {
    history.push({
      pathname: value,
    });
  };

  return (
    <>
      {!isDesktop && (
        <div>
          {show && (
            <div className={styles.topBar}>
              <div>
                <Tabs
                  value={pathname.indexOf(catalogPath) > -1 ? catalogPath : pathname}
                  onChange={handleChange}
                  onBack={() => {
                    history.push('/');
                  }}
                  items={tabs}
                />
              </div>
            </div>
          )}
          <Switch>
            <Route exact path={path}>
              <List />
            </Route>
            <Route exact path={`${path}/catalog`}>
              <Catalog />
            </Route>
            <Route path={`${path}/catalog/:id`}>
              <CatalogDetail />
            </Route>
            <Route path={`${path}/create`}>
              <Create />
            </Route>
            <Route path={`${path}/variants`}>
              <Variants />
            </Route>
            <Route path={`${path}/product/:id`}>
              <Create />
            </Route>
            <Route path={`${path}/rating/:id`}>
              <ReviewPage />
            </Route>
            <Route path={`${path}/profile`}>
              <UserProfile />
            </Route>
          </Switch>
        </div>
      )}
      {isDesktop && (
        <div>
          <Switch>
            <Route exact path={path}>
              <List />
            </Route>
            <Route exact path={`${path}/catalog`}>
              <Catalog />
            </Route>
            <Route path={`${path}/catalog/:id`}>
              <CatalogDetail />
            </Route>
            <Route path={`${path}/create`}>
              <Create />
            </Route>
            <Route path={`${path}/variants`}>
              <Variants />
            </Route>
            <Route path={`${path}/product/:id`}>
              <Create />
            </Route>
            <Route path={`${path}/rating/:id`}>
              <ReviewPage />
            </Route>
            <Route path={`${path}/profile`}>
              <UserProfile />
            </Route>
          </Switch>
        </div>
      )}
    </>
  );
}

export default Main;
