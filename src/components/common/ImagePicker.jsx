import React, { useState } from 'react';
import PropTypes from 'prop-types';
import addIcon from 'assets/images/products/create/add.svg';
import { FilePreview } from 'components/common/FilePreview';
import { compressImages } from 'utils/image';
import Snackbar from 'services/snackbar';
import Loader from 'services/loader';
import { Becca } from 'api';
import { inParallelWithLimit } from 'utils/parallel';
import { Clickable } from 'phoenix-components';
import { usePostsMedia } from 'hooks/posts';
import { useToggle } from 'hooks/common';
import { MediaDrawer } from 'components/common/MediaDrawer';
import styles from './ImagePicker.module.css';

export function ImagePicker({
  images,
  onChange,
  accept,
  isMulti,
  label,
  showCover,
  size,
  videos,
}) {
  const [posts] = usePostsMedia();
  const [open, toggleDrawer] = useToggle(false);
  const [err, setErr] = useState();
  const [err8, setErr8] = useState();

  const removeImage = (index) => {
    onChange(images.filter((_i, idx) => idx !== index));
  };

  const onCoverSelect = (index) => {
    const otherItems = images.filter((_i, idx) => idx !== index);
    const selectedItems = images.filter((_i, idx) => idx === index);
    onChange([...selectedItems, ...otherItems]);
  };

  const onFileAdd = async (e) => {
    Loader.show();
    setErr(false);
    setErr8(false);
    try {
      if (e?.target?.files.length > 7 || images.length > 7) {
        setErr(false);
        setErr8(true);
        return;
      }
      const files = await compressImages([...e.target.files]);
      if (files.length) {
        let uploaded = await inParallelWithLimit(files, 3, async file => {
          const fileName = file?.name;
          try {
            const payload = new FormData();
            const ext = fileName.split('.')
              .pop();
            payload.append('name', fileName);
            payload.append('purpose', 'shop');
            payload.append('type', 'image');
            payload.append('file', file);
            const { url } = await Becca.uploadAsset(payload);
            return {
              url,
              ext
            };
          } catch (e) {
            Snackbar.show(`${fileName} failed to upload `, 'error');
          }
        });

        uploaded = uploaded.filter(x => x)
          .map((x) => ({
            url: x.url,
            caption: ''
          }));
        onChange([...images, ...uploaded]);
      }
      if (files.length === 0) {
        setErr(true);
      }
    } catch (e) {
      Snackbar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const onImageSelect = async (e) => {
    toggleDrawer();
    await onFileAdd(e);
  };

  const onDrawerSelect = (images) => {
    toggleDrawer();
    onChange(images);
  };
  if (images.length === 0) {
    if (posts.length === 0) {
      return (
        <>
          {open && (
            <MediaDrawer
              onChange={onDrawerSelect}
              accept={accept}
              isMulti={isMulti}
              onClose={toggleDrawer}
              posts={posts}
              images={images}
              onImageSelect={onImageSelect}
            />
          )}
          <label>
            <div className={styles.container}>
              <div className={styles.labelDesktop}>
                {label}
              </div>
              <img src={addIcon} alt="" />
            </div>
            <input
              className={styles.input}
              type="file"
              accept={accept}
              onChange={onFileAdd}
              multiple={isMulti}
            />
          </label>
        </>
      );
    }
    return (
      <>
        {open && (
          <MediaDrawer
            onChange={onDrawerSelect}
            accept={accept}
            isMulti={isMulti}
            onClose={toggleDrawer}
            posts={posts}
            images={images}
            onImageSelect={onImageSelect}
          />
        )}
        <Clickable fullWidth className={styles.container1} onClick={toggleDrawer}>
          <div className={styles.container}>
            <div className={styles.labelDesktop}>
              {label}
            </div>
            <img src={addIcon} alt="" />
          </div>
          {!err && (
            <div className={styles.info}> Maximum image upload size is 5MB and 50MB for video </div>
          )}
          {err && (
            <div className={styles.error}>
              File is too big! Max image upload size is 5MB and 50MB for video
            </div>
          )}
        </Clickable>
      </>
    );
  }

  return (
    <>
      {open && (
        <MediaDrawer
          onChange={onDrawerSelect}
          accept={accept}
          isMulti={isMulti}
          onClose={toggleDrawer}
          posts={posts}
          images={images}
          onImageSelect={onImageSelect}
        />
      )}
      <div className={styles.row}>
        {images.map((image, idx) => (
          <FilePreview
            key={idx}
            premium={size !== -1 && idx > size - 1}
            onDelete={removeImage}
            index={idx}
            item={image}
            onCoverClick={showCover ? onCoverSelect : null}
            videos={videos}
          />
        ))}
        {posts.length === 0 && (
          <label className={styles.addBlock}>
            <img src={addIcon} alt="" />
            <input
              className={styles.input}
              type="file"
              accept={accept}
              onChange={onFileAdd}
              multiple={isMulti}
            />
          </label>
        )}
        {posts.length > 0 && (
          <Clickable className={styles.addBlock} onClick={toggleDrawer}>
            <img src={addIcon} alt="" />
          </Clickable>
        )}
        <Clickable fullWidth className={styles.container1}>
          {err8 && (
            <div className={styles.error}>
              Maximum 8 Files Is Allowed
            </div>
          )}
        </Clickable>
      </div>
    </>
  );
}

ImagePicker.propTypes = {
  images: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  accept: PropTypes.string,
  isMulti: PropTypes.bool,
  showCover: PropTypes.bool,
  label: PropTypes.string,
  size: PropTypes.number,
  videos: PropTypes.bool,
};

ImagePicker.defaultProps = {
  accept: undefined,
  isMulti: false,
  showCover: false,
  label: 'Upload multiple photos or videos of your product',
  size: -1,
  videos: true,
};
