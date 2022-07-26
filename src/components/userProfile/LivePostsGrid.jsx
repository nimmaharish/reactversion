import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, InfiniteLoader } from 'react-virtualized';
import { useLivePosts } from 'hooks/posts';
import carouselIcon from 'assets/images/profile/carouselIcon.svg';
import videoIcon from 'assets/images/profile/videoIcon.svg';
import cx from 'classnames';
import { SnackBar } from 'services';
import Loader from 'services/loader';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import Player from 'components/shared/Player/Carousel';
import { useToggle } from 'hooks/common';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import { Button } from 'phoenix-components';
import { Nikon } from 'api';
import { useDesktop } from 'contexts';
import { useOpenCreateAsProduct } from 'hooks/userProfile';
import checkIcon from 'assets/images/profile/check.svg';
import { Clickable } from 'phoenix-components';
import { FooterButton } from 'components/common/FooterButton';
import { FabMenu } from 'components/shared/FabMenu';
import styles from './LivePostsGrid.module.css';

export function LivePostsGrid({
  top,
  refresh
}) {
  const [posts, loadMore, hasMore, , refreshPosts] = useLivePosts({}, { createdOn: -1 });
  const [checked, setChecked] = useState([]);
  const [openDelete, toggleDelete] = useToggle(false);
  const history = useHistory();
  const params = useQueryParams();
  const openProduct = useOpenCreateAsProduct();
  const rowCount = hasMore ? 10000 : posts.length;
  const isLoaded = i => !!posts[i];
  const checkedSet = new Set(checked);
  const isDesktop = useDesktop();

  const topBar = top?.current?.getBoundingClientRect()?.top || 120;
  const height = isDesktop
    ? window.screen.height - topBar - 78 - 60 - (checkedSet.size > 0 ? 48 : 0)
    : window.screen.height - topBar - 20 - (checkedSet.size > 0 ? 48 : 0);
  const cellWidth = isDesktop ? (window.screen.width - 320 - 60 - 300) / 4 : (window.screen.width - 16) / 3;

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

  const deletePosts = async () => {
    if (checkedSet.size === 0) {
      return;
    }
    try {
      Loader.show();
      await Nikon.deletePosts([...checkedSet]);
      await refreshPosts();
      refresh();
      toggleDelete();
      setChecked([]);
    } catch (e) {
      SnackBar.show('something went wrong, try again', 'error');
    } finally {
      Loader.hide();
    }
  };

  const openPost = (id) => () => {
    params.set('post', id);
    history.push({
      search: params.toString(),
    });
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

  // eslint-disable-next-line react/no-multi-comp
  const renderCell = (el) => {
    const idx = el.rowIndex * (isDesktop ? 4 : 3) + el.columnIndex;
    if (idx >= posts.length) {
      return null;
    }
    const post = posts[idx];
    return (
      <div key={el.key} style={el.style}>
        <div className={styles.post}>
          <div
            className={styles.container}
            // style={{
            //   backgroundSize: 'cover',
            //   backgroundImage: `url(${post.preview})`,
            // }}
            onClick={openPost(post.pid)}
          >
            <div className={styles.inner}>
              {post.postType !== 'video' && (
                <img className={styles.img} src={post.preview} alt="" />
              )}
              {post.postType === 'video' && (
                <Player isPreview={false} item={{ url: post.video }} className={styles.img} />
              )}
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
            <Clickable
              className={styles.button}
              onClick={() => openProduct(post.pid)}
            >
              Add as Product
            </Clickable>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {openDelete
      && (
        <DeleteAlert
          title="Are you sure want to delete selected Posts?"
          onCancel={toggleDelete}
          onDelete={deletePosts}
        />
      )}
      {posts.length > 0 && (
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
              columnCount={isDesktop ? 4 : 3}
              columnWidth={isDesktop ? cellWidth : cellWidth}
              height={height}
              rowCount={Math.ceil(rowCount / (isDesktop ? 1 : 3))}
              rowHeight={184}
              style={{ display: 'flex' }}
              width={isDesktop ? window.screen.width - 650 : window.screen.width}
            />
          )}
        </InfiniteLoader>
      )}
      <FabMenu refresh={refreshPosts} />
      {checkedSet.size > 0 && (
        <div className={styles.unliveContainer}>
          {checkedSet.size > 0 && (
            <FooterButton>
              <div className={styles.btns}>
                <Button
                  label="Delete"
                  size="large"
                  primary={false}
                  onClick={toggleDelete}
                />
                <Button
                  label="Add as Product"
                  size="large"
                  onClick={async () => {
                    const videos = [];
                    const images = [];
                    checkedSet.forEach((x) => {
                      const post = posts.find(y => y.pid === x);
                      const {
                        desc, postType, preview, video, images: postImages, pid
                      } = post;
                      if (postType === 'video') {
                        videos.push({
                          caption: desc, postType, url: video, pid
                        });
                      }
                      if (postType === 'image carousel') {
                        // eslint-disable-next-line array-callback-return
                        postImages.map(y => {
                          images.push({
                            caption: y.caption, postType: 'image', url: y.url, pid
                          });
                        });
                      }
                      if (postType === 'image') {
                        images.push({
                          caption: desc, postType, url: preview, pid
                        });
                      }
                    });
                    if ([...videos, ...images].length > 8) {
                      SnackBar.show('You can add maximum upload 8 files', 'error');
                      return;
                    }
                    if ([...videos, ...images].length === 1) {
                      const { pid } = [...videos, ...images][0];
                      openProduct(pid);
                      return;
                    }
                    history.push({ pathname: '/products/create', state: { images, videos } });
                  }}
                />
              </div>
            </FooterButton>
          )}
        </div>
      )}
    </>
  );
}

LivePostsGrid.propTypes = {
  top: PropTypes.any.isRequired,
  refresh: PropTypes.func.isRequired,
};
LivePostsGrid.defaultProps = {};
