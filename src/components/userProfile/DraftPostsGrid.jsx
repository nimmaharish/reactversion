import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, InfiniteLoader } from 'react-virtualized';
import { useDraftPosts } from 'hooks/posts';
import carouselIcon from 'assets/images/profile/carouselIcon.svg';
import videoIcon from 'assets/images/profile/videoIcon.svg';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import { useToggle } from 'hooks/common';
import cx from 'classnames';
import Loader from 'services/loader';
import { Nikon } from 'api';
import { SnackBar } from 'services';
import ButtonComponent from 'containers/profile/ButtonComponent';
import { useOpenCreateAsProduct } from 'hooks/userProfile';
import { useProfile } from 'hooks/profile';
import { InstaImport } from 'components/userProfile/InstaImport';
import updateIcon from 'assets/images/shared/updateAlert.svg';
import checkIcon from 'assets/images/profile/check.svg';
import styles from './DraftPostsGrid.module.css';

export function DraftPostsGrid({ top, from }) {
  const [posts, loadMore, hasMore, , refresh] = useDraftPosts({}, { updatedAt: -1 });
  const rowCount = hasMore ? 10000 : posts.length;
  const isLoaded = i => !!posts[i];
  const history = useHistory();
  const params = useQueryParams();
  const [checked, setChecked] = useState([]);
  const openProduct = useOpenCreateAsProduct();
  const [openDelete, toggleDelete] = useToggle(false);
  const [openLive, toggleLive] = useToggle(false);
  const [profile, refreshProfile] = useProfile();

  const checkedSet = new Set(checked);

  const topBar = top?.current?.getBoundingClientRect()?.top || 120;
  const height = window.screen.height - topBar - 100;
  const cellWidth = window.screen.width / 3;

  const openPost = (id) => () => {
    params.set('post', id);
    history.push({
      search: params.toString(),
    });
  };

  const makeLive = async () => {
    if (checkedSet.size === 0) {
      return;
    }
    try {
      Loader.show();
      await Nikon.livePosts([...checkedSet]);
      await refresh();
      setChecked([]);
      toggleLive();
    } catch (e) {
      SnackBar.show('something went wrong, try again', 'error');
    } finally {
      Loader.hide();
    }
  };

  const deletePosts = async () => {
    if (checkedSet.size === 0) {
      return;
    }
    try {
      Loader.show();
      await Nikon.deletePosts([...checkedSet]);
      await refresh();
      toggleDelete();
      setChecked([]);
    } catch (e) {
      SnackBar.show('something went wrong, try again', 'error');
    } finally {
      Loader.hide();
    }
  };

  const onCheck = (id) => (e) => {
    e.stopPropagation();
    if (checkedSet.has(id)) {
      checkedSet.delete(id);
      setChecked([...checkedSet]);
      return;
    }
    setChecked([...checkedSet, id]);
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
            <div className={styles.checkBoxContainer}>
              <div
                onClick={onCheck(post.pid)}
                className={cx(styles.radio, {
                  [styles.selected]: checkedSet.has(post.pid)
                })}
              >
                {checkedSet.has(post.pid) && <img src={checkIcon} alt="" />}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <ButtonComponent
            disabled={post.products?.length > 0}
            fullwidth
            style={styles.button}
            text="Add as Product"
            onclick={() => openProduct(post.pid)}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {checkedSet.size > 0 && (
        <div className={styles.unliveContainer}>
          <ButtonComponent
            onclick={toggleLive}
            style={styles.unlive}
            text="Update">
          </ButtonComponent>
          <ButtonComponent
            onclick={toggleDelete}
            style={styles.delete}
            text="Delete">
          </ButtonComponent>
        </div>
      )}
      {openDelete && <DeleteAlert title="Delete Posts?" onCancel={toggleDelete} onDelete={deletePosts} />}
      {openLive && (
        <DeleteAlert
          title={`Selected ${checkedSet.size} Posts`}
          subTitle={`Sure you want to Live ${checkedSet.size} posts ?`}
          onCancel={toggleLive}
          primary="Live"
          onDelete={makeLive}
          icon={updateIcon}
        />
      )}
      {posts.length > 0 && (
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
              rowHeight={cellWidth + 30}
              width={window.screen.width}
            />
          )}
        </InfiniteLoader>
      )}
      {from === 'Products' && posts.length === 0 && (
        <div className={styles.empty}>
          <InstaImport profile={profile} onClose={refreshProfile} page="posts" />
        </div>
      )}
    </>
  );
}

DraftPostsGrid.propTypes = {
  top: PropTypes.any.isRequired,
  from: PropTypes.string
};

DraftPostsGrid.defaultProps = {
  from: ''
};
