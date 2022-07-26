import React, { useState, useRef } from 'react';
import { InfiniteLoader, List } from 'react-virtualized';
import WhiteMail from 'assets/logos/whitemail.svg';
import { Button } from 'phoenix-components';
import { useCustomersList, useQueryParams } from 'hooks';
import Header from 'components/orders/header/Header';
import { Header as DesktopHeader } from 'components/shared/Header';
import { useDesktop } from 'contexts';
import emptyOrder from 'assets/overview/newOrder.svg';
import { Picker } from 'components/shared/dateRangePicker/Picker';
import SnackBar from 'services/snackbar';
import { Search } from 'phoenix-components';
import { useHistory } from 'react-router-dom';
import { customDateFilters, getText } from 'containers/utils';
import { useOpenPlans } from 'contexts';
import {
  useIsCustomerCampaignEnabled,
} from 'contexts/userContext';
import _ from 'lodash';
import { dateFilters, getQueryFilters } from './utils';
import Filters from './Filters';
import UserDetailsCard from './UserDetailsCard';
import styles from './CustomerList.module.css';

function CustomerList() {
  const params = useQueryParams();

  const [checkedIds, setCheckedId] = useState([]);
  const [query, setQuery] = useState('');
  const [skuIds, setSkuIds] = useState(null);
  const [orderValue, setOrderValue] = useState({
    min: null,
    max: null,
  });
  const place = params.get('placed') || 'all';
  const isDesktop = useDesktop();
  const history = useHistory();
  const bodyRef = useRef();
  const isCustomerCampaignEnabled = useIsCustomerCampaignEnabled();
  const openPlans = useOpenPlans(false, 'generic', 'premium');
  const topBar = bodyRef?.current?.getBoundingClientRect()?.top || 120;
  const height = window.screen.height - topBar - 75;
  const width = bodyRef?.current?.clientWidth;

  const [dateRangeFilters, setDateRangeFilters] = useState({
    from: null,
    to: null
  });

  const onNameChange = _.debounce((e) => {
    setQuery(e.target.value);
  }, 500);

  const isEmptyFrom = dateRangeFilters.from === null;
  const isEmptyTo = dateRangeFilters.to === null;

  const dateTimeFilters = () => {
    if (place !== 'custom') {
      return dateFilters[place];
    }
    if (isEmptyFrom || isEmptyTo) {
      return {};
    }
    return customDateFilters(dateRangeFilters.from, dateRangeFilters.to);
  };

  const filters = {
    ...dateTimeFilters(),
    ...getQueryFilters(query),
    ...(skuIds ? { skuIds } : {}),
    ...{ orderValue },
  };
  const [customers, loadMore, hasMore, , , getCustomerAddress] = useCustomersList(filters);
  const rowCount = hasMore ? 10000 : customers.length;

  const trackCheckedIds = (id) => {
    const cpy = [...new Set(checkedIds)];
    if (checkedIds.includes(id)) {
      const items = cpy.splice(checkedIds.indexOf(id), 1);
      setCheckedId(items);
      return;
    }
    cpy.push(id);
    setCheckedId(cpy);
  };

  const handleBulkMail = () => {
    if (!isCustomerCampaignEnabled) {
      openPlans();
      return;
    }
    if (checkedIds.length === 0) {
      SnackBar.showError('Please select atleast one customer');
      return;
    }
    const emails = [...new Set(checkedIds.map(x => {
      const item = customers.find((y, i) => x === i);
      return item.email;
    }))];
    const url = `mailto:${emails.join(',')}`;
    window.open(url, '_blank');
  };

  const rendercustomers = (userDetails) => (
    <UserDetailsCard
      details={customers[userDetails.index]}
      index={userDetails.index}
      trackCheckedIds={trackCheckedIds}
      getAddressReq={getCustomerAddress}
    />
  );

  const isLoaded = i => !!customers[i];

  return (
    <div className={styles.body}>
      {isDesktop && <DesktopHeader title="Customer List" onBack={history.goBack} />}
      {!isDesktop && (
        <Header
          showFaq={false}
          title="Customer List"
          onBack={history.goBack}
        />
      )}
      {customers.length > 0 && (
        <>
          <div className={styles.sendMailDiv}>
            <div className={styles.helperText}>
              Select multiple customer to send bulk Emails
            </div>
            <Button
              startIcon={WhiteMail}
              label="Send Bulk Email"
              onClick={handleBulkMail}
              bordered={false}
              fullWidth
              size="large" />
          </div>

        </>
      )}
      <div className={styles.picker}>
        <Picker
          label={getText(dateRangeFilters)}
          onSelect={(e) => {
            setDateRangeFilters(e);
            params.set('placed', 'custom');
            history.push({ search: params.toString() });
          }}
          inputStyle={styles.padd0}
        />
      </div>
      <Filters setSkuIds={setSkuIds} setOrderValue={setOrderValue} />
      <div className={styles.paddLR}>
        <Search
          placeholder="Search by customer name"
          onChange={onNameChange}
        />
      </div>
      <div ref={bodyRef} className={styles.chatContainer}>
        {customers.length > 0 ? (
          <InfiniteLoader
            loadMoreRows={loadMore}
            isRowLoaded={isLoaded}
            rowCount={rowCount}
            minimumBatchSize={10}
          >
            {({
              onRowsRendered,
              registerChild
            }) => (
              <List
                height={height}
                onRowsRendered={onRowsRendered}
                ref={registerChild}
                rowCount={rowCount}
                rowHeight={80}
                rowRenderer={rendercustomers}
                width={isDesktop ? width : width - 32}
              />
            )}
          </InfiniteLoader>
        ) : (
          (
            <div className={styles.emptyOrders}>
              <img src={emptyOrder} alt="" />
              <div className={styles.emptyProductText}>
                You haven't received any orders yet!
              </div>

            </div>
          )
        )}
      </div>
    </div>
  );
}

export default CustomerList;
