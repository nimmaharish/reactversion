import React from 'react';
import YouTubeIcon from 'assets/images/youtubeThumb.png';
import WebView from 'services/webview';
import styles from './Youtube.module.css';

export default function Youtube() {
  const url = 'https://www.youtube.com/playlist?list=PLDtQW8umhwA_jRrKb_MUA9LKdZM929uVy';

  return (
    <>
      <div className={styles.section}>
        <img
          src={YouTubeIcon}
          alt=""
          className={styles.img}
          onClick={() => {
            if (WebView.isWebView()) {
              WebView.openUrl(url);
              return;
            }
            window.open(url, '_blank');
          }}
        />
      </div>
    </>

  );
}
