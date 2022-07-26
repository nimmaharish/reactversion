import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Header from 'containers/products/Header';
// import { ImagePicker } from 'components/common/ImagePicker';
import { Avatar, Drawer } from '@material-ui/core';
import AddIcon from 'assets/images/products/catalog/add1.svg';
import AddPrimary from 'assets/images/products/catalog/addPrimary.svg';
import { Becca } from 'api/index';
import { useDesktop } from 'contexts';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import Icon from 'assets/images/products/create/media-del.svg';
import cx from 'classnames';
import { Button, ReactInput, Clickable } from 'phoenix-components';
import { isEmpty } from 'lodash';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import styles from './Add.module.css';

export function Add({
  url,
  setUrl,
  caption,
  setCaption,
  updateShop,
  onBack,
  type,
  catalogs
}) {
  const isDesktop = useDesktop();
  const [isTouched, setIsTouched] = useState(false);
  const inputRef = useRef();

  let err = 'catalog name exists';
  if (isEmpty(catalogs.find(x => x.caption.toLowerCase() === caption?.trim()?.toLowerCase())) || !isTouched) {
    err = '';
  }

  const uploadAsset = async (e) => {
    try {
      Loader.show();
      const files = e?.target?.files;
      const file = files && files[0];
      const payload = new FormData();
      payload.append('name', file.name);
      payload.append('purpose', 'shop');
      payload.append('type', 'image');
      payload.append('file', file);
      const { url } = await Becca.uploadAsset(payload);
      setUrl(url);
      SnackBar.show('upload success');
    } catch (e) {
      SnackBar.show('upload failed', 'error');
    } finally {
      Loader.hide();
    }
  };

  const getTitle = () => {
    if (type === 'create') {
      return 'Create Collection';
    }
    return 'Update Collection';
  };

  const getBtnTitle = () => {
    if (type === 'create') {
      return 'Add Collection';
    }
    return 'Update Collection';
  };

  return (
    <>
      {!isDesktop
    && (
      <Drawer
        anchor="bottom"
        open={true}
        onClose={() => onBack()}
        PaperProps={{
          classes: {
            root: styles.paper,
          }
        }}
      >
        <Header onBack={() => onBack()} title={getTitle()} />
        <div className={styles.padd}>
          <div className={styles.heading}>
            Add catalog image or icon
          </div>
          <div
            className={cx('relative')}
          >
            <input
              // label="Upload high-resolution photos
              //              and videos of your product"
              ref={inputRef}
              accept="image/*"
              hidden
              id="icon-button-file"
              type="file"
              onChange={(e) => {
                uploadAsset(e);
              }} />
            <Avatar
              onClick={() => {
              // eslint-disable-next-line no-unused-expressions
              inputRef?.current?.click();
              }}
              className={cx(styles.catalogImg, { [styles.emptyImg]: !url })}
              variant="rounded"
              src={url || AddIcon}
            />
            {url.length > 0 && (
              <img
                role="none"
                onClick={() => setUrl('')}
                className={styles.del}
                src={Icon}
                alt="" />
            )}
          </div>
          <ReactInput
            value={caption}
            placeholder="Elevate your Collection with a stellar name"
            label="Collection Name"
            setValue={(e) => {
              setIsTouched(true);
              setCaption(e);
            }}
            helperText={err}
            helperTextClass={styles.error}
          />
          <div className={cx('fullWidth', 'textCenter', styles.button)}>
            <Button
              fullWidth
              onClick={() => {
                if (err.length > 0) {
                  onBack();
                  return;
                }
                updateShop();
              }}
              label={getBtnTitle()}
            />
          </div>
        </div>
      </Drawer>
    )}
      {isDesktop
    && (
      <Drawer
        anchor="right"
        open={true}
        onClose={() => onBack()}
        PaperProps={{
          classes: {
            root: styles.paper,
          }
        }}
      >
        <div className={styles.container1}>
          <Clickable>
            <img className={styles.backIcon} src={chevronLeftDesk} alt="" onClick={() => onBack()} />
          </Clickable>
          <div className={styles.containerText1}>
            Create Collection
          </div>
        </div>
        {/* <Header onBack={() => onBack()} title={getTitle()} /> */}
        <div className={styles.content}>
          <div className={styles.heading1}>
            Choose a cover image for your Collection
          </div>
          <div
            className={styles.relative}
          >
            <input
              ref={inputRef}
              accept="image/*"
              hidden
              id="icon-button-file"
              type="file"
              onChange={(e) => {
                uploadAsset(e);
              }} />

            <Avatar
              onClick={() => {
              // eslint-disable-next-line no-unused-expressions
              inputRef?.current?.click();
              }}
              className={cx(styles.catalogImg, { [styles.emptyImg]: !url })}
              variant="rounded"
              src={url || AddPrimary}
            />
            {url.length > 0 && (
              <img
                role="none"
                onClick={() => setUrl('')}
                className={styles.del1}
                src={Icon}
                alt="" />
            )}
          </div>
          <ReactInput
            value={caption}
            placeholder="Elevate your Collection with a stellar name"
            label="Collection Name"
            setValue={(e) => {
              setIsTouched(true);
              setCaption(e);
            }}
            helperText={err}
            helperTextClass={styles.error}
          />
          <div className={cx('fullWidth', 'textCenter', styles.button1)}>
            <Button
              onClick={() => {
                if (err.length > 0) {
                  onBack();
                  return;
                }
                updateShop();
              }}
              label={getBtnTitle()}
            />
          </div>
        </div>
      </Drawer>
    )}
    </>
  );
}

Add.propTypes = {
  url: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  setUrl: PropTypes.func.isRequired,
  setCaption: PropTypes.func.isRequired,
  updateShop: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  catalogs: PropTypes.array.isRequired,
};

Add.defaultProps = {};
