/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Button, Grid } from '@material-ui/core';
import Snackbar from 'services/snackbar';
import PropTypes from 'prop-types';
import { Becca } from 'api/index';
import cx from 'classnames';
import Icon from 'assets/images/products/create/media-del.svg';
import CircularProgress from '@material-ui/core/CircularProgress';
import Add from 'assets/images/products/create/add.svg';
import { compressImages } from 'utils/image';
import styles from './Upload.module.css';

function Upload({
  onSelect,
  items,
  type
}) {
  const images = items;
  const [uploading, setUploading] = useState(false);
  const id = new Date().getUTCMilliseconds();

  const isVideo = (item) => item.split('.').pop() === 'mp4';

  const uploadAsset = async (e) => {
    setUploading(true);
    try {
      const files = e?.target?.files;
      const nFiles = await compressImages([...files]);
      const allData = nFiles.map(async (x) => {
        const fileName = x?.name;
        try {
          const payload = new FormData();
          const ext = fileName.split('.')
            .pop();
          const size = Math.round((x?.size / 1024));
          if (ext !== 'mp4' && size > 5 * 1024) {
            Snackbar.show(`${fileName} is too big! Max 5 Mb allowed`, 'error');
            return;
          }
          if (ext === 'mp4' && size > 50 * 1024) {
            Snackbar.show(`${fileName} is too big! Max 50 Mb allowed`, 'error');
            return;
          }
          payload.append('name', fileName);
          payload.append('purpose', 'shop');
          payload.append('type', 'image');
          payload.append('file', x);
          const { url } = await Becca.uploadAsset(payload);
          const newItems = {
            url,
            ext
          };
          return newItems;
          // setImages(newItems);
        } catch (e) {
          setUploading(false);
          Snackbar.show(`${fileName} failed to upload `, 'error');
        }
      });
      const res = await Promise.all(allData);
      const filtered = res.filter(x => x);
      const newItems = [...items, ...filtered];
      onSelect(newItems);
      setUploading(false);
    } catch (e) {
      setUploading(false);
      Snackbar.show('Upload error, Please retry', 'error');
    }
  };

  const deleteImage = (index) => {
    const newItems = [...images];
    newItems.splice(index, 1);
    onSelect(newItems);
  };

  return (
    <Grid container>
      {images.length === 0 && (
        <Grid item xs={12}>
          <input
            accept="image/*, video/mp4"
            className={styles.input}
            onChange={(e) => {
              uploadAsset(e);
            }}
            multiple
            id={id}
            type="file"
          />
          <label htmlFor={id}>
            <Button
              component="span"
              color="primary"
              disabled={uploading}
              className={cx(styles.card1)}
            >
              <div className={styles.flex}>
                <div>
                  Upload multiple photo or video of your product
                </div>
                {uploading
                  ? <CircularProgress className={styles.progress} />
                  : <img className={styles.addImg} src={Add} alt="" />}
              </div>
            </Button>
          </label>
        </Grid>
      )}
      {images.length > 0 && (
        <Grid container spacing={1} className="fullWidth">
          {images.map((x, i) => (
            <Grid item xs={4}>
              <Button className={styles.card}>
                {isVideo(x?.url) && (
                  <video
                    muted
                    playsInline={true}
                    className={styles.img}
                    src={x.url}
                    alt=""
                  />
                )}
                {!isVideo(x?.url) && (
                  <img className={styles.img} src={x.url} alt="" />
                )}
                <img
                  role="none"
                  onClick={() => deleteImage(i)}
                  className={styles.del}
                  src={Icon}
                  alt="" />
              </Button>
            </Grid>
          ))}
          <Grid item xs={4}>
            <input
              accept="image/*, video/mp4"
              className={styles.input}
              onChange={(e) => {
                uploadAsset(e);
              }}
              multiple
              id={id}
              type="file"
            />
            <label htmlFor={id}>
              <Button
                component="span"
                color="primary"
                disabled={uploading}
                className={cx(type !== 'variant' ? styles.card : styles.bg, styles.border)}
              >
                {uploading ? <CircularProgress className={styles.progress} /> : <img src={Add} alt="" />}
              </Button>
            </label>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

Upload.propTypes = {
  items: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default Upload;
