import React from 'react';
import PropTypes from 'prop-types';
import { Grid, InfiniteLoader } from 'react-virtualized';
import { useShoppablePosts } from 'hooks/posts';
import carouselIcon from 'assets/images/profile/carouselIcon.svg';
import videoIcon from 'assets/images/profile/videoIcon.svg';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import styles from './ShopPostsGrid.module.css';

export function ShopPostsGrid({ top }) {
  const [posts, loadMore, hasMore] = useShoppablePosts({}, { updatedAt: -1 });
  const rowCount = hasMore ? 10000 : posts.length;
  const isLoaded = i => !!posts[i];
  const history = useHistory();
  const params = useQueryParams();

  const topBar = top?.current?.getBoundingClientRect()?.top || 120;
  const height = window.screen.height - topBar - 100;
  const cellWidth = window.screen.width / 3;

  const openPost = (id) => () => {
    params.set('post', id);
    history.push({
      search: params.toString(),
    });
  };

  const onSectionRendered = (onRowsRendered) => ({
    columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex
  }) => {
    const startIndex = rowStartIndex * 3 + columnStartIndex;
    const stopIndex = rowStopIndex * 3 + columnStopIndex;

    onRowsRendered({
      startIndex,
      stopIndex
    });
  };

  // eslint-disable-next-line react/no-multi-comp
  const renderIcon = (post) => {
    switch (post.postType) {
      case 'image carousel':
        return <img src={carouselIcon} alt="" />;
      case 'video':
        return <img src={videoIcon} alt="" />;
      default:
        return <div>&nbsp;</div>;
    }
  };

  // eslint-disable-next-line react/no-multi-comp
  const renderCell = (el) => {
    const idx = el.rowIndex * 3 + el.columnIndex;
    if (idx >= posts.length) {
      return null;
    }
    const post = posts[idx];
    return (
      <div key={el.key} style={el.style}>
        <div
          className={styles.container}
          style={{
            backgroundSize: 'contain',
            backgroundImage: `url(${post.preview})`,
          }}
          onClick={openPost(post.pid)}
        >
          <div className={styles.inner}>
            <div className={styles.iconContainer}>
              {renderIcon(post)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <InfiniteLoader
      loadMoreRows={loadMore}
      isRowLoaded={isLoaded}
      rowCount={rowCount}
      minimumBatchSize={10}
    >
      {({ onRowsRendered, registerChild }) => (
        <Grid
          onSectionRendered={onSectionRendered(onRowsRendered)}
          ref={registerChild}
          cellRenderer={renderCell}
          columnCount={3}
          columnWidth={cellWidth}
          height={height}
          rowCount={Math.ceil(rowCount / 3)}
          rowHeight={cellWidth}
          width={window.screen.width}
        />
      )}
    </InfiniteLoader>
  );
}

ShopPostsGrid.propTypes = {
  top: PropTypes.any.isRequired,
};

ShopPostsGrid.defaultProps = {};
