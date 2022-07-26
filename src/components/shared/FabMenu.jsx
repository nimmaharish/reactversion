import React, { useState, useRef, useEffect } from 'react';
import MdClose from 'assets/images/products/create/add1.svg';
import one from 'assets/images/products/insta.svg';
import two from 'assets/images/products/gallery.svg';
import three from 'assets/images/products/camera.svg';
import { PostType } from 'constants/posts';
import { inParallelWithLimit } from 'utils/parallel';
import { compressImages } from 'utils/image';
import { Clickable } from 'phoenix-components';
import PropTypes from 'prop-types';
import EventManager from 'utils/events';
import WebView from 'services/webview';
import { get } from 'lodash';
import MdAdd from 'assets/images/products/create/add1.svg';
import {
  MainButton,
  ChildButton,
  FloatingMenu,
  Directions,
} from 'react-floating-button-menu';
import cx from 'classnames';
import 'react-floating-button-menu/dist/index.css';
import { InstaMessage } from 'components/userProfile/InstaMessage';
import {
  useIsInstantSyncEnabled
} from 'contexts/userContext';
import { useShop } from 'contexts';
import { useQueryParams } from 'hooks';
import { useHistory } from 'react-router-dom';
import SnackBar from 'services/snackbar';
import Loader from 'services/loader';
import { UploadProgress } from 'components/shared/UploadProgress';
import { Nikon } from 'api';
import { useDesktop } from 'contexts';
import { useProfile } from 'hooks/profile';
import { marshallData, getInitialValues } from '../posts/utils';
import styles from './FabMenu.module.css';

export const FabMenu = ({ refresh }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(false);

  const isInstantSyncEnabled = useIsInstantSyncEnabled();
  const history = useHistory();
  const [timer, setTimer] = useState({
    current: 1,
    label: 'Uploading'
  });
  const isDesktop = useDesktop();
  const cameraRef = useRef();
  const localRef = useRef();
  const shop = useShop();
  const [profile, refreshProfile] = useProfile();
  const [openPopup, setOpenPopup] = useState(false);
  const enabled = profile?.loginRequired ?? true;

  const getInstaUrl = () => {
    const url = new URL('https://api.instagram.com/oauth/authorize');
    url.searchParams.set('client_id', '1129552074233709');
    url.searchParams.set('redirect_uri', `${document.location.protocol}//${document.location.host}/instagram`);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'user_profile,user_media');
    url.searchParams.set('force_authentication', '1');
    return url.toString();
  };

  const params = useQueryParams();

  useEffect(() => {
    if (!progress) {
      refresh();
      refreshProfile();
    }
  }, [progress]);

  const closeSyncPopup = () => {
    setOpenPopup(false);
    history.replace('/overview');
  };

  const importInstagram = async () => {
    try {
      const acc = await Nikon.getInstagramAccount();
      if (!acc?.loginRequired) {
        return;
      }
      if (!WebView.isWebView()) {
        window.location.href = getInstaUrl();
        return;
      }
      Loader.show();
      const { code } = await WebView.instagramLogin();
      EventManager.emitEvent('instagram_account_synced');
      await Nikon.syncInstagramProfile(code, 'https://seller.windo.live/instagram');
      setOpenPopup(true);
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  const syncNow = async () => {
    if (!isInstantSyncEnabled) {
      params.set('openPlans', 'generic');
      history.push({
        search: params.toString(),
      });
      return;
    }
    if (!enabled) {
      Loader.show();
      try {
        await Nikon.syncInstagramNow();
        SnackBar.show('Your posts will be synced with in next few minutes', 'success');
      } catch (e) {
        SnackBar.showError(e);
      } finally {
        Loader.hide();
      }
    }
    importInstagram();
  };

  const handleClick = (value) => {
    if (value === 'insta') {
      syncNow();
    }
    if (value === 'camera') {
      cameraRef.current.click();
    }
    if (value === 'gallery') {
      localRef.current.click();
    }
    setIsOpen(!isOpen);
  };

  const isValidFile = (file) => {
    const validExtensions = ['mp4', 'mov', 'jpeg', 'jpg', 'png'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'mp4' || ext === 'mov') {
      const isValidSize = Math.round((file?.size / (1024 * 1024))) <= 50;
      return validExtensions.includes(ext) && isValidSize;
    }
    const isValidSize = Math.round((file?.size / (1024 * 1024))) <= 5;
    return validExtensions.includes(ext) && isValidSize;
  };

  const uploadAsset = async (e) => {
    const targetFiles = Array.from(e.target.files);
    const filesToSend = targetFiles.filter(file => isValidFile(file));
    const err = 'Maximum upload size per image is 5mb, per video is 50 mb';
    if (filesToSend.length === 0) {
      SnackBar.show(err, 'error');
      return;
    }
    try {
      setProgress(true);
      // filter only images which is less than 5MB
      const files = await compressImages([...filesToSend]);
      const exts = ['mp4', 'mov'];
      await inParallelWithLimit(files, 5, async file => {
        const payload = getInitialValues();
        const ext = file.name.toLowerCase().split('.').pop().toLowerCase();
        payload.type = exts.includes(ext) ? PostType.VIDEO : PostType.IMAGES;
        if (exts.includes(ext)) {
          payload.video = file;
        } else {
          payload.images = [file];
        }
        const data = marshallData(payload, shop);
        const label = 'Uploading';
        // const label = `Uploading ${timer.current} / ${filesToSend.length}.`;
        const diff = targetFiles.length - filesToSend.length;
        const failed = `${diff} files not uploading`;
        await Nikon.createPost(data);
        setTimer(() => ({
          current: get(timer, 'current') + 1,
          label: diff <= 0 ? label : `${failed}, ${err} ${label}`
        }));
      });
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      setProgress(false);
    }
  };

  const menuItems = () => {
    if (!isOpen) {
      return <></>;
    }
    const items = [
      {
        label: 'Take a product shot',
        value: 'camera',
        icon: three,
      },
      {
        label: 'Add products from local to gallery',
        value: 'gallery',
        icon: two,
      },
      {
        label: 'Add products from Instagram',
        value: 'insta',
        icon: one,
      },
    ];
    const itemsToShow = () => {
      if (isDesktop) {
        return items.filter(x => x.value !== 'camera');
      }
      return items;
    };
    return itemsToShow().map((x) => (
      <ChildButton
        onClick={() => handleClick(x.value)}
        icon={(
          <div
            className={cx(styles.menuItem, `${styles[x.value]}`)}
          >
            <img className={styles.icon} src={x.icon} alt={x.value} />
            <div className={styles.label}>
              {x.label}
            </div>
          </div>
        )}
      />
    ));
  };

  return (
    <div
      className={cx(styles.relative, { [styles.close]: !isOpen })}
    >
      {openPopup && <InstaMessage closeSyncPopup={closeSyncPopup} />}
      <input
        ref={cameraRef}
        accept="image/png,image/jpeg,video/mp4"
        hidden
        capture
        type="file"
        onChange={(e) => {
          uploadAsset(e);
        }} />
      <input
        ref={localRef}
        accept="image/png,image/jpeg,video/mp4"
        hidden
        multiple
        type="file"
        onChange={(e) => {
          uploadAsset(e);
        }}
      />
      <FloatingMenu
        slideSpeed={500}
        isOpen={isOpen}
        spacing={8}
        className={!isOpen && styles.menu}
        direction={Directions.Up}
      >
        <MainButton
          className={cx(styles.fab, { [styles.fabclose]: isOpen })}
          isOpen={isOpen}
          iconResting={(
            <Clickable
              // className={styles.fab}
              onClick={() => {}}>
              <img src={MdAdd} alt="" />
            </Clickable>
          )}
          iconActive={(
            <Clickable
              // className={styles.fab}
              onClick={() => {}}>
              <img src={MdClose} alt="" />
            </Clickable>
          )}
          background="linear-gradient(45deg, var(--primary) 50%, var(--primary) 50%)"
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}
          size={56}
        />
        {menuItems()}
      </FloatingMenu>
      {progress && <UploadProgress type="circular" text={timer.label} progress={progress} />}
    </div>
  );
};

FabMenu.propTypes = {
  refresh: PropTypes.func.isRequired,
};
