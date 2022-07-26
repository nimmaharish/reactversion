import React from 'react';
import { useQueryParams } from 'hooks';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Drawer } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import chevronLeft from 'assets/images/chat/arrowBack.svg';
import { usePost } from 'hooks/posts';
import Player from 'components/shared/Player/Carousel';
import { Loading } from 'components/shared/Loading';
import delIcon from 'assets/images/post/del.svg';
import Loader from 'services/loader';
import { Nikon } from 'api';
import SnackBar from 'services/snackbar';
import { CreateProductDialog } from 'components/userProfile/CreateProductDialog';
import { useToggle } from 'hooks/common';
import { SideDrawer } from 'components/shared/SideDrawer';
import { Button } from 'phoenix-components';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import { useDesktop } from 'contexts';
import styles from './PostDrawer.module.css';

export function PostDrawer() {
  const params = useQueryParams();
  const history = useHistory();
  const id = params.get('post');
  const [post, loading] = usePost(id);
  const [openProduct, toggleProduct] = useToggle();
  const [openDel, toggleOpenDel] = useToggle(false);
  const isDesktop = useDesktop();

  if (!id) {
    return null;
  }

  if (loading) {
    return (
      <Loading />
    );
  }

  const media = [...(post.images ?? [])].map(i => ({
    ...i,
    type: 'image'
  }));

  if (post.video) {
    media.push({
      url: post.video,
      type: 'video'
    });
  }

  const delPost = async () => {
    if (!post?.pid) {
      history.goBack();
      return;
    }
    try {
      Loader.show();
      await Nikon.deletePosts([post.pid]);
      history.goBack();
    } catch (e) {
      SnackBar.show('something went wrong, try again', 'error');
    } finally {
      Loader.hide();
    }
  };

  return (
    <>
      {isDesktop ? (
        <SideDrawer
          onClose={() => history.goBack()}
          backButton={true}
          title="Post"
        >
          <div className={styles.containerDesk}>
            <Swiper
              grabCursor={true}
              initialSlide={0}
              spaceBetween={30}
              watchOverflow={true}
              className={styles.swiper}
              centeredSlides={true}
              pagination={{ clickable: true }}
              slidesPerView="auto"
            >
              {media.map((el, i) => (
                <SwiperSlide
                  key={i}
                  className={styles.slide}
                >
                  {el.type === 'image' ? (
                    <img
                      className={styles.image}
                      src={el.url}
                      alt=""
                    />
                  ) : (
                    <div>
                      <Player item={el} className={styles.video} />
                    </div>
                  )}
                </SwiperSlide>
              ))}
              <img
                className={styles.del}
                onClick={() => toggleOpenDel(!openDel)}
                src={delIcon}
                alt=""
              />
            </Swiper>
            {openDel && (
              <DeleteAlert
                title="Delete Post"
                subTitle="Sure you want to delete the posts"
                onCancel={() => toggleOpenDel(!openDel)}
                primary="Delete"
                onDelete={delPost}
              />
            )}
            <div className={styles.main}>
              <div className={styles.description}>
                {post.desc}
              </div>
              <div className={styles.hashTags}>
                {(post.hashTags || []).map(tag => (
                  <div className={styles.hashTag}>{tag}</div>
                ))}
              </div>
              <div className="flexCenter">

                <Button
                  label="Add as Product"
                  onClick={toggleProduct}
                />
              </div>
            </div>
            {openProduct && (
              <CreateProductDialog
                onClose={toggleProduct}
                id={id}
              />
            )}
          </div>
        </SideDrawer>
      ) : (
        <Drawer
          anchor="bottom"
          open={true}
          onClose={() => history.goBack()}
        >
          <div className={styles.container}>
            <div className={styles.topBar}>
              <div onClick={history.goBack}>
                <img className={styles.back} src={chevronLeft} alt="" />
              </div>
            </div>

            <Swiper
              grabCursor={true}
              initialSlide={0}
              spaceBetween={30}
              watchOverflow={true}
              className={styles.swiper}
              centeredSlides={true}
              pagination={{ clickable: true }}
              slidesPerView="auto"
            >
              {media.map((el, i) => (
                <SwiperSlide
                  key={i}
                  className={styles.slide}
                >
                  {el.type === 'image' ? (
                    <img
                      className={styles.image}
                      src={el.url}
                      alt=""
                    />
                  ) : (
                    <div>
                      <Player item={el} className={styles.video} />
                    </div>
                  )}
                </SwiperSlide>
              ))}
              <img
                className={styles.del}
                onClick={() => toggleOpenDel(!openDel)}
                src={delIcon}
                alt=""
              />
            </Swiper>
            {openDel && (
              <DeleteAlert
                title="Delete Post"
                subTitle="Sure you want to delete the posts"
                onCancel={() => toggleOpenDel(!openDel)}
                primary="Delete"
                onDelete={delPost}
              />
            )}
            <div className={styles.main}>
              <div className={styles.description}>
                {post.desc}
              </div>
              <div className={styles.hashTags}>
                {(post.hashTags || []).map(tag => (
                  <div className={styles.hashTag}>{tag}</div>
                ))}
              </div>
              <Button
                label="Add as Product"
                onClick={toggleProduct}
                fullWidth
              />
            </div>
          </div>
          {openProduct && (
            <CreateProductDialog
              onClose={toggleProduct}
              id={id}
            />
          )}
        </Drawer>
      )}
    </>
  );
}
