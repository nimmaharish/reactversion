import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';

function Infinite({
  children, loadMore, hasMore
}) {
  return (
    <InfiniteScroll
      pageStart={0}
      hasMore={hasMore}
      threshold={500}
      useWindow={false}
      initialLoad={false}
      loadMore={(e) => {
        setTimeout(() => {
          loadMore(e);
        }, 300);
      }}
    >
      {children}
    </InfiniteScroll>
  );
}

Infinite.propTypes = {
  children: PropTypes.any.isRequired,
  loadMore: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired
};

export default Infinite;
