import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import PropTypes from 'prop-types';

function Accordion({ children }) {
  return (
    <InfiniteScroll
      pageStart={0}
      threshold={1000}
      useWindow={false}
      initialLoad={false}
      loadMore={() => {
        setTimeout(() => {
        }, 300);
      }}
    >
      {children}
    </InfiniteScroll>
  );
}

Accordion.propTypes = {
  children: PropTypes.any.isRequired,
};

export default Accordion;
