import React, { useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { Search } from 'phoenix-components';
import _ from 'lodash';
import chevRight from 'assets/overview/chevRightGreen.svg';
import { Drawer } from 'components/shared/Drawer';
import { SideDrawer } from 'components/shared/SideDrawer';
import { useDesktop, usePlan } from 'contexts';
import { useQueryParams } from 'hooks';
import { settingsRoutes } from './settings';
import { isSubscribed } from './utils';
import styles from './SettingsSearch.module.css';

export default function SettingsSearch() {
  const [value, setValue] = useState('');
  const plan = usePlan();
  const history = useHistory();
  const queryParams = useQueryParams();
  const isDesktop = useDesktop();
  const list = useMemo(() => {
    if (value === '') {
      return [];
    }
    return settingsRoutes.filter((item) => item?.title.toLowerCase().includes(value.toLowerCase()));
  }, [value]);

  const handleChange = _.debounce((value) => setValue(value), 500);

  const handleClick = (item) => {
    if (isSubscribed(item?.planName, plan?.name)) {
      Object.entries(item?.params).forEach(([key, value]) => queryParams.set(key, value));
      history.push({
        search: queryParams.toString(),
        pathname: isDesktop ? item?.route?.desktop : item?.route?.mobile,
      });
      return;
    }
    queryParams.set('openPlans', 'generic');
    queryParams.set('planName', item?.planName);
    history.push({
      search: queryParams.toString(),
    });
  };

  const Component = isDesktop ? SideDrawer : Drawer;

  return (
    <Component title="Search" onClose={history.goBack} backButton>
      <div className={styles.body}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputContainer}>
            <Search
              placeholder="Search"
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
        </div>
        {list.length > 0 && (
          <div className={styles.listCard}>
            <p className={styles.resultsText}>Search Results</p>
            <div className={styles.listContainer}>
              {list.map((item) => (
                <div key={item?.title} className={styles.item}>
                  <span className={styles.itemTitle}>{item?.title}</span>
                  <div className={styles.viewSection} onClick={() => handleClick(item)}>
                    <span className={styles.viewText}>
                      View
                    </span>
                    <img src={chevRight} alt="" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Component>
  );
}
