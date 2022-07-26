/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import SnackBar from 'services/snackbar';
import Snackbar from 'services/snackbar';
import { Becca } from 'api';
import Loader from 'services/loader';
import { compressImages } from 'utils/image';
import { inParallelWithLimit } from 'utils/parallel';
import closeIcon from 'assets/v2/common/closeBlack.svg';
import { Clickable } from 'phoenix-components';
import addIcon from 'assets/images/products/create/add.svg';
import styles from './UploadImage.module.css';

export function UploadImage({
  item,
  onSetImage
}) {
  const { images = [] } = item;

  const onAdd = async (e) => {
    if (images.length >= 8) {
      SnackBar.show('Maximum of 8 images is allowed', 'warning');
      return;
    }
    Loader.show();
    try {
      const files = await compressImages([...e.target.files]);
      if (files.length) {
        const uploaded = await inParallelWithLimit(files, 3, async file => {
          const fileName = file?.name;
          try {
            const payload = new FormData();
            payload.append('name', fileName);
            payload.append('purpose', 'shop');
            payload.append('type', 'image');
            payload.append('file', file);
            const { url } = await Becca.uploadAsset(payload);
            return url;
          } catch (e) {
            Snackbar.show(`${fileName} failed to upload `, 'error');
          }
        });
        onSetImage([...uploaded, ...images].filter(x => x)
          .slice(0, 8));
      }
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const onDeleteImage = (idx) => () => {
    onSetImage(images.filter((_, i) => i !== idx));
  };

  return (
    <div className={styles.container}>
      <label>
        <div className={styles.label}>
          <img src={addIcon} alt="" />
        </div>
        <input
          type="file"
          className={styles.file}
          accept="image/*"
          multiple={true}
          onChange={onAdd}
        />
      </label>
      <div className={styles.images}>
        {images.map((x, idx) => (
          <div className={styles.imageContainer}>
            <img className={styles.image} src={x} alt="" />
            <Clickable
              onClick={onDeleteImage(idx)}
            >
              <img className={styles.close} src={closeIcon} alt="" />
            </Clickable>
          </div>
        ))}
      </div>
    </div>
  );
}

UploadImage.propTypes = {
  item: PropTypes.object.isRequired,
  onSetImage: PropTypes.func.isRequired,
};

UploadImage.defaultProps = {};
