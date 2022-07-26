import React, { useRef } from 'react';
import { Drawer } from 'components/shared/Drawer';
import ButtonComponent from 'containers/profile/ButtonComponent';
import editIcon from 'assets/images/featureRequests/requestIcon.svg';
import noRequestsIcon from 'assets/images/featureRequests/noRequests.svg';
import { FeatureRequestModal } from 'components/featureRequests/FeatureRequestModal';
import { useToggle } from 'hooks/common';
import { RequestCard } from 'components/featureRequests/RequestCard';
import { useQueryParams } from 'hooks';
import { useFeatureRequests } from 'hooks/featureRequest';
import { InfiniteLoader, List } from 'react-virtualized';
import styles from './FeatureRequest.module.css';

const FilterMap = {
  raised: {
    status: {
      $in: ['created', 'processing']
    }
  },
  resolved: {
    status: 'processed',
  }
};

export function FeatureRequest() {
  const [openModel, toggleModel] = useToggle();
  const params = useQueryParams();
  // const history = useHistory();
  const state = params.get('type') || 'raised';
  const top = useRef();
  const [requests, loadMore, hasMore, , refresh] = useFeatureRequests({
    ...(FilterMap[state] || FilterMap.raised)
  }, {
    updatedAt: -1,
  });
  // eslint-disable-next-line react/no-multi-comp
  const renderItem = (item) => (
    <div key={item.key} style={item.style}>
      <RequestCard data={requests[item.index]} />
    </div>
  );

  const onModelClose = () => {
    toggleModel();
    refresh();
  };

  const rowCount = hasMore ? 10000 : requests?.length || 0;

  const isLoaded = i => !!requests[i];
  const topBar = top?.current?.getBoundingClientRect()?.top || 200;

  const height = window.screen.height - topBar - 16;

  return (
    <Drawer title="Feature Request">
      {openModel && <FeatureRequestModal onClose={onModelClose} />}
      <div className={styles.container}>
        <ButtonComponent
          text="Request For Premium Features"
          starticon={
            <img className={styles.editIcon} src={editIcon} alt="" />
          }
          onclick={toggleModel}
          fullwidth={true}
          style={styles.editButton}
        />
      </div>
      <div ref={top} />
      {requests?.length > 0 ? (
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
              rowCount={requests.length}
              rowHeight={136}
              rowRenderer={renderItem}
              width={window.screen.width}
            />
          )}
        </InfiniteLoader>
      ) : (
        <div className={styles.noRequests}>
          <img src={noRequestsIcon} alt="" />
          <div>
            {state === 'raised' ? 'No requests from you.' : 'No requests are resolved yet.'}
          </div>
        </div>
      )}
    </Drawer>
  );
}

FeatureRequest.propTypes = {};

FeatureRequest.defaultProps = {};
