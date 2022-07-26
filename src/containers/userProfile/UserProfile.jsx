import React, { useRef } from 'react';
import { TopBar } from 'components/userProfile/TopBar';
import { LivePostsGrid } from 'components/userProfile/LivePostsGrid';
import { PostDrawer } from 'components/userProfile/PostDrawer';
import { useProfile } from 'hooks/profile';
import { FabMenu } from 'components/shared/FabMenu';
import { InstaImport } from 'components/userProfile/InstaImport';
import noPosts from 'assets/overview/newOrder.svg';
import { CreateProductDialog } from 'components/userProfile/CreateProductDialog';
import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks';
import { useDesktop } from 'contexts';
import styles from './UserProfile.module.css';

export default function UserProfile() {
  const ref = useRef();
  const [profile, refresh] = useProfile();
  const history = useHistory();
  const params = useQueryParams();
  const openProduct = params.get('createProduct');
  const isDesktop = useDesktop();
  // const [, , , , refreshProducts] = useLivePosts({}, { createdOn: -1 });
  const goBack = () => {
    history.goBack();
  };

  return (
    <>
      {isDesktop ? (
        <div className={styles.container}>
          {profile?.posts > 0 ? (
            <>
              <TopBar profile={profile} refresh={refresh} />
              <div className={styles.section}>
                <div className={styles.media}>
                  Media
                  <span>
                    (
                    {profile?.posts || 0}
                    )
                  </span>
                </div>
                <div ref={ref} />
                <LivePostsGrid top={ref} refreshProfile={refresh} />
              </div>
              <PostDrawer />
            </>
          ) : (
            <div className={styles.containerDesktop}>
              <div className="flexCenter">
                <div className={styles.noPostContainer}>
                  <div className={styles.importButton}>
                    <InstaImport onClose={refresh} profile={profile} page="posts" />
                  </div>
                  <img className={styles.noPostImg} src={noPosts} alt="" />
                  <div className={styles.noPostText}>
                    Bring your Instagram posts to life right here in your Gallery!
                  </div>
                </div>
              </div>
              {profile?.posts === 0 && (
                <FabMenu refresh={refresh} />
              )}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.container}>
          {profile?.posts > 0 ? (
            <>
              <TopBar profile={profile} refresh={refresh} />
              <div className={styles.section}>
                <div className={styles.media}>
                  Media
                  <span>
                    (
                    {profile?.posts || 0}
                    )
                  </span>
                </div>
                <div ref={ref} />
                <LivePostsGrid top={ref} refresh={refresh} />
              </div>
              <PostDrawer />
            </>
          ) : (
            <div className={styles.noPostContainer}>
              <div className={styles.importButton}>
                <InstaImport onClose={refresh} profile={profile} page="posts" />
              </div>
              <img className={styles.noPostImg} src={noPosts} alt="" />
              <div className={styles.noPostText}>
                Bring your Instagram posts to life right here in your Gallery!
              </div>
              {profile?.posts === 0 && (
                <FabMenu refresh={refresh} />
              )}
            </div>
          )}
        </div>
      )}
      {openProduct?.length > 0 && (
        <CreateProductDialog
          onClose={goBack}
          id={openProduct}
        />
      )}
    </>

  );
}
