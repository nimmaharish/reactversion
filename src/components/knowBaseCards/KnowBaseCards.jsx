import React from 'react';
import PropTypes from 'prop-types';
import WebView from 'services/webview';
import chevronRight from 'assets/v2/common/chevronGreyRight.svg';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import styles from './KnowBaseCards.module.css';
import { KnowledgeBaseData } from './utils';

function Kbc({
  type
}) {
  const {
    name, content, videoUrl, blogUrl, icon
  } = KnowledgeBaseData[type];

  const handleRoute = (status) => {
    const url = status === 'video' ? videoUrl : blogUrl;
    try {
      Loader.show();
      if (WebView.isWebView()) {
        WebView.openUrl(url);
        return;
      }
      window.open(url, '_blank');
    } catch (e) {
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  return (
    <div className={styles.main} onClick={handleRoute}>
      <div className={styles.con1}>
        <div className={styles.hb} />
        <img src={icon} alt="" className={styles.icon} />
      </div>
      <div className={styles.con2}>
        <div className={styles.hexa} />
        <div className={styles.cardDetails}>
          <div className={styles.crdContent}>
            <div className={styles.name}>{name}</div>
            <div className={styles.content}>
              {content}
              {' '}
              {videoUrl && (
                <span onClick={() => { handleRoute('video'); }} className={styles.link}>
                  View Video
                </span>
              )}
            </div>
          </div>
        </div>
        <img src={chevronRight} alt="" className={styles.chevron} />
      </div>
    </div>
  );
}

Kbc.propTypes = {
  type: PropTypes.string.isRequired,
};

export default Kbc;
