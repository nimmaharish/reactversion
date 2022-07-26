import React, { useRef } from 'react';
import { Clickable } from 'phoenix-components';
import addIcon from 'assets/overview/addIcon.svg';
import DeleteIcon from 'assets/images/socialMedia/delete.png';
import editIcon from 'assets/overview/edit.svg';
import { MediaDrawer } from 'components/common/MediaDrawer';
import { useToggle } from 'hooks/common';
import { usePostsMedia } from 'hooks/posts';
import { useField } from 'formik';
import Loader from 'services/loader';
import Snackbar from 'services/snackbar';
import { compressImages } from 'utils/image';
import { Becca } from 'api';
import styles from './CustomImage.module.css';

export function CustomImage() {
  const [open, toggleOpen] = useToggle();
  const [posts] = usePostsMedia();
  const [{ value = '' }, , { setValue }] = useField('background.imageValue');

  const ref = useRef();

  const onFileAdd = async (e) => {
    Loader.show();
    try {
      const files = await compressImages([...e.target.files]);
      if (files.length) {
        const [file] = files;
        const fileName = file?.name;
        const payload = new FormData();
        payload.append('name', fileName);
        payload.append('purpose', 'shop');
        payload.append('type', 'helloBar');
        payload.append('file', file);
        const { url } = await Becca.uploadAsset(payload);
        setValue(url);
      }
    } catch (e) {
      Snackbar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const onImageSelect = (e) => {
    toggleOpen();
    onFileAdd(e);
  };

  const onDrawerSelect = (images) => {
    toggleOpen();
    if (images.length > 0) {
      setValue(images[0].url);
    }
  };

  const onOpen = () => {
    if (posts.length > 0) {
      toggleOpen();
      return;
    }
    if (ref?.current) {
      ref.current.click();
    }
  };

  return (
    <>
      {open && (
        <MediaDrawer
          onChange={onDrawerSelect}
          accept="image/*"
          isMulti={false}
          onClose={toggleOpen}
          posts={posts}
          images={[]}
          onImageSelect={onImageSelect}
        />
      )}
      <input
        className={styles.input}
        type="file"
        accept="image/*"
        onChange={onFileAdd}
        multiple={false}
        ref={ref}
      />
      {value?.length === 0 && (
        <div className={styles.textColor}>
          <div className={styles.title}>
            Add Custom Banner Image
          </div>
          <div className="spacer" />
          <Clickable
            className="flexCenter"
            onClick={onOpen}
          >
            <>
              <img
                src={addIcon}
                alt=""
                className={styles.imgA} />
              Add Image
            </>
          </Clickable>
        </div>
      )}

      {value.length > 0 && (
        <>
          <div className={styles.containerI}>
            <div className={styles.titleI}>
              Selected Custom Banner Image
            </div>
            <div className={styles.imgContainer} style={{ backgroundImage: `url(${value})` }}>
            </div>
            <div className={styles.imgS}>
              <Clickable
                className={styles.delete}
                onClick={() => setValue('')}
              >
                <img
                  src={DeleteIcon}
                  alt=""
                  className={styles.imgD}
                />
              </Clickable>
              <Clickable
                className={styles.edit}
                onClick={onOpen}
              >
                <img
                  src={editIcon}
                  alt=""
                  className={styles.imgE}
                />
              </Clickable>
            </div>
          </div>
        </>
      )}
    </>
  );
}

CustomImage.propTypes = {};

CustomImage.defaultProps = {};
