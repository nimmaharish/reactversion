import React, { useState } from 'react';
import { Button as MuiButton, Drawer } from '@material-ui/core';
import whatsappIcon from 'assets/v2/contact/whatsappGreen.svg';
import emailIcon from 'assets/v2/contact/email.svg';
import communityIcon from 'assets/v2/contact/community.svg';
import faqIcon from 'assets/v2/contact/faq.svg';
import WebViewUtils from 'services/webviewUtils';
import { useQueryParams } from 'hooks';
import { useDesktop } from 'contexts';
import { useHistory } from 'react-router-dom';
import FaqModel from 'containers/faq/Faq';
import helpIcon from 'assets/v2/overview/helpline/help.svg';
import helperIcon from 'assets/v2/overview/helpline/helper.svg';
import youtubeIcon from 'assets/overview/youtubeicon.svg';
import blogIcon from 'assets/overview/blogicon.svg';
import { Clickable } from 'phoenix-components';
import WebView from 'services/webview';
import PropTypes from 'prop-types';
import styles from './Helpline.module.css';

export function HelpLine({ isFloating, isDrawer, onClose }) {
  const params = useQueryParams();
  const isDesktop = useDesktop();
  const history = useHistory();
  const communityLink = 'https://www.facebook.com/groups/901392637394533/';
  const url = 'https://api.whatsapp.com/send/?phone=+918309690218&text=';
  const youtubeLink = 'https://www.youtube.com/channel/UCEFkdSXa1zSvTz-t7W2psJA';
  const blogLink = 'https://mywindo.shop/blog/resources/';
  const url1 = 'mailto:team@windo.live';
  const [downloadEl, setDownloadEl] = useState(null);
  const openFaq = params.has('openFaq') ? params.get('openFaq') : '';

  const openDownload = (e) => {
    setDownloadEl(e.currentTarget);
  };

  const closeDownload = () => {
    setDownloadEl(false);
  };

  const openLinks = (e, primary) => {
    let lnk;
    if (primary === 'youtube') {
      lnk = youtubeLink;
    } else if (primary === 'blog') {
      lnk = blogLink;
    } else if (primary === 'whatsapp') {
      lnk = url;
    } else if (primary === 'community') {
      lnk = communityLink;
    }
    if (WebView.isWebView()) {
      e.preventDefault();
      WebView.openUrl(lnk);
      return;
    }
    window.open(lnk);
  };

  return (
    <>
      <Drawer
        anchor="bottom"
        open={!!downloadEl || isDrawer}
        onClose={onClose || closeDownload}
        PaperProps={{
          classes: {
            root: styles.paper,
          }
        }}
      >
        {openFaq.length > 0 && <FaqModel />}
        <div className={styles.actions}>
          <div className={styles.label}>
            Have any Questions?
            <div className={styles.border} />
          </div>
          <div className={styles.buttons}>
            <MuiButton
              href={url1}
              target="_blank"
              onClick={WebViewUtils.openUrl('mailto:team@windo.live')}
              className={styles.yes}
            >
              <div className={styles.iconContainer}>
                <div className={styles.icon}>
                  <img src={emailIcon} className={styles.img} alt="" />
                </div>
                <div className={styles.actionLabel}>Mail Us</div>
              </div>
            </MuiButton>
            <MuiButton
              href={url}
              target="_blank"
              onClick={(e) => { openLinks(e, 'whatsapp'); }}
              className={styles.yes}
            >
              <div className={styles.iconContainer}>
                <div className={styles.icon}>
                  <img src={whatsappIcon} className={styles.img} alt="" />
                </div>
                <div className={styles.actionLabel}>Whatsapp</div>
              </div>
            </MuiButton>
            <MuiButton
              onClick={() => {
                params.set('openFaq', 'true');
                history.push({ search: params.toString() });
              }}
              className={styles.yes}
            >
              <div className={styles.iconContainer}>
                <div className={styles.icon}>
                  <img src={faqIcon} className={styles.img} alt="" />
                </div>
                <div className={styles.actionLabel}>FAQ</div>
              </div>
            </MuiButton>
            <MuiButton
              onClick={(e) => { openLinks(e, 'youtube'); }}
              className={styles.yes}
            >
              <div className={styles.iconContainer}>
                <div className={styles.icon}>
                  <img src={youtubeIcon} className={styles.img} alt="" />
                </div>
                <div className={styles.actionLabel}>Youtube</div>
              </div>
            </MuiButton>
            <MuiButton
              onClick={(e) => { openLinks(e, 'blog'); }}
              className={styles.yes}
            >
              <div className={styles.iconContainer}>
                <div className={styles.icon}>
                  <img src={blogIcon} className={styles.blogImage} alt="" />
                </div>
                <div className={styles.actionLabel}>Blog</div>
              </div>
            </MuiButton>
            <MuiButton
              onClick={(e) => { openLinks(e, 'community'); }}
              className={styles.yes}
            >
              <div className={styles.iconContainer}>
                <div className={styles.icon}>
                  <img src={communityIcon} className={styles.img} alt="" />
                </div>
                <div className={styles.actionLabel}>Community</div>
              </div>
            </MuiButton>
          </div>
        </div>
      </Drawer>
      {isFloating && (
        <>
          {isDesktop ? (
            <div className={styles.help}>
              <Clickable
                onClick={openDownload}
                className={styles.button}
              >
                <img src={helperIcon} alt="" />
              </Clickable>
            </div>
          ) : (
            <div className={styles.helpline}>
              <Clickable
                onClick={openDownload}
                className={styles.button}
              >
                <img src={helpIcon} alt="" />
              </Clickable>
            </div>
          )}
        </>
      )}
      {!isFloating && (
        <Clickable
          onClick={openDownload}
          className={styles.button}
        >
          <span className={styles.contactText}> Contact Us </span>
        </Clickable>
      )}
    </>
  );
}

HelpLine.propTypes = {
  isFloating: PropTypes.bool,
  isDrawer: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

HelpLine.defaultProps = {
  isFloating: false,
  isDrawer: false,
};
