import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'components/shared/Drawer';
import { usePostsMedia } from 'hooks/posts';
import { Button, Clickable } from 'phoenix-components';
import viewMoreIcon from 'assets/v2/products/viewMore.svg';
import addIcon from 'assets/images/products/create/add.svg';
import selectedIcon from 'assets/v2/products/selectedPost.svg';
import { useToggle } from 'hooks/common';
import { Grid, InfiniteLoader } from 'react-virtualized';
import styles from './ImagePicker.module.css';

export function MediaDrawer({
  onClose,
  posts: initialPosts,
  accept,
  isMulti,
  onImageSelect,
  images,
  onChange
}) {
  const [posts, loadMore, hasMore] = usePostsMedia(initialPosts, 1);
  const [state, setState] = useState(images);
  const [open, toggleOpen] = useToggle(false);

  const rowCount = hasMore ? 10000 : posts.length;
  const height = window.screen.height - 200;
  const cellWidth = window.screen.width / 3 - 8;
  const isLoaded = i => !!posts[i];

  const set = new Set(state.map(x => x.url));

  const onAddImage = (url) => () => {
    const exists = state.findIndex(s => s.url === url);
    if (exists >= 0) {
      setState(state.filter((_p, idx) => idx !== exists));
      return;
    }
    setState([...state, {
      url,
      caption: ''
    }]);
  };

  const onSubmit = () => {
    onChange(state);
  };

  const onSectionRendered = (onRowsRendered) => ({
    columnStartIndex,
    columnStopIndex,
    rowStartIndex,
    rowStopIndex
  }) => {
    const startIndex = rowStartIndex * 3 + columnStartIndex;
    const stopIndex = rowStopIndex * 3 + columnStopIndex;

    onRowsRendered({
      startIndex,
      stopIndex
    });
  };

  // eslint-disable-next-line react/no-multi-comp
  const renderCell = (el) => {
    const idx = el.rowIndex * 3 + el.columnIndex;
    if (idx >= posts.length) {
      return null;
    }
    const p = posts[idx];
    return (
      <div key={el.key} style={el.style}>
        <div key={idx} className={styles.mediaPostGrid}>
          <Clickable onClick={onAddImage(p)}>
            <img className={styles.mediaImage} src={p} alt="" />
          </Clickable>
          {set.has(p) && (
            <img src={selectedIcon} className={styles.mediaSelected} alt="" />
          )}
        </div>
      </div>
    );
  };

  return (
    <Drawer title="Select Images" onClose={onClose}>
      <div className={styles.mediaContainer}>
        <div className={styles.mediaHeading}>Choose from library</div>
        {!open && (
          <div>
            <div className={styles.mediaPosts}>
              {posts.slice(0, 8)
                .map((p, idx) => (
                  <div key={idx} className={styles.mediaPost}>
                    <Clickable onClick={onAddImage(p)}>
                      <img className={styles.mediaImage} src={p} alt="" />
                    </Clickable>
                    {set.has(p) && (
                      <img src={selectedIcon} className={styles.mediaSelected} alt="" />
                    )}
                  </div>
                ))}
              <Clickable className={styles.mediaPost} onClick={toggleOpen}>
                <div className={styles.mediaViewMore}>
                  <img src={viewMoreIcon} alt="" />
                  <div>View more</div>
                </div>
              </Clickable>
            </div>
            <div className={styles.mediaSeparator}>
              <div />
              <div>Or</div>
              <div />
            </div>
            <div className={styles.mediaSelect}>
              <label className={styles.addBlock}>
                <img src={addIcon} alt="" />
                <input
                  className={styles.input}
                  type="file"
                  accept={accept}
                  onChange={onImageSelect}
                  multiple={isMulti}
                />
              </label>
              <div className={styles.mediaSelectLabel}>
                Take a photo / choose from gallery
              </div>
            </div>
          </div>
        )}
        {open && (
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
              <Grid
                onSectionRendered={onSectionRendered(onRowsRendered)}
                ref={registerChild}
                cellRenderer={renderCell}
                columnCount={3}
                columnWidth={cellWidth}
                height={height}
                rowCount={Math.ceil(rowCount / 3)}
                rowHeight={124}
                width={window.screen.width - 16}
              />
            )}
          </InfiniteLoader>
        )}
        <div className={styles.padNextButton} />
        <Button
          label="Next"
          size="large"
          fullWidth={true}
          primary={true}
          onClick={onSubmit}
        />
      </div>
    </Drawer>
  );
}

MediaDrawer.propTypes = {
  onClose: PropTypes.func.isRequired,
  images: PropTypes.array.isRequired,
  posts: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  accept: PropTypes.string,
  isMulti: PropTypes.bool,
  onImageSelect: PropTypes.func.isRequired,
};

MediaDrawer.defaultProps = {
  accept: undefined,
  isMulti: false,
};
