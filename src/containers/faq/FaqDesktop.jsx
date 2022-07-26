/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQueryParams } from 'hooks';
import { Button as MuiButton } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Loader from 'services/loader';
import { Becca } from 'api/index';
import SnackBar from 'services/snackbar';
import { startCase } from 'lodash';
import WindoInput from 'components/common/Input';
import { InputAdornment } from '@material-ui/core';
import cx from 'classnames';
import cuIcon from 'assets/v2/faq/chevUp.svg';
import cdIcon from 'assets/v2/faq/chevDown.svg';
import crIcon from 'assets/v2/faq/chevRight.svg';
import Storage from 'services/storage';
import recentIcon from 'assets/images/shared/recent.svg';
import SearchIcon from 'assets/images/shared/search.svg';
import whatsappIcon from 'assets/v2/contact/whatsappGreen.svg';
import communityIcon from 'assets/v2/contact/community.svg';
import youtubeIcon from 'assets/overview/youtubeicon.svg';
import blogIcon from 'assets/overview/blogicon.svg';
import emailIcon from 'assets/v2/contact/email.svg';
import WebViewUtils from 'services/webviewUtils';
import ViewDayIcon from 'assets/images/shared/qna.svg';
import WebView from 'services/webview';
import chevronLeftDesk from 'assets/v2/common/chevronPrimaryLeft.svg';
import Level from './Level';
import styles from './Faq.module.css';

function Faq({ showItems }) {
  const [defaultItems, setDefaultItems] = useState([]);
  const [response, setResponse] = useState([]);
  const [search, setSearch] = useState('');
  const recent = Storage.getFaqs();
  let searched = Object.values(response).flat();
  if (search.length > 0) {
    searched = searched.filter(x => (x.q.toLowerCase() || x.a.toLowerCase()).includes(search.toLowerCase()));
  }
  const [expanded, setExpanded] = useState([]);
  const communityLink = 'https://www.facebook.com/groups/901392637394533/';
  const url = 'https://api.whatsapp.com/send/?phone=+918309690218&text=';
  const youtubeLink = 'https://www.youtube.com/channel/UCEFkdSXa1zSvTz-t7W2psJA';
  const blogLink = 'https://mywindo.shop/blog/resources/';
  const url1 = 'mailto:team@windo.live';

  useEffect(() => {
    Loader.show();
    Becca.getFaqs().then((x = {}) => {
      setResponse(x);
      setDefaultItems(Object.keys(x).map(x => ({
        label: startCase(x),
        value: x
      })));
      Loader.hide();
    }).catch((e) => {
      console.log(e);
      Loader.hide();
      SnackBar.show('something went wrong', 'error');
    });
  }, []);

  const history = useHistory();
  const queryParams = useQueryParams();
  const level = queryParams.has('level') ? queryParams.get('level') : '';
  const title = defaultItems.find(x => x.value === level)?.label || '';

  const itemsToShow = showItems.length === 0 ? defaultItems : defaultItems.filter(x => showItems.includes(x.value));

  const getData = (value) => Object.values(response).flat().find(x => x.q === value);

  const getMark = (str, find) => {
    const reg = new RegExp(`(${find})`, 'gi');
    return str.replace(reg, '$1');
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
    <div className={styles.desktopContainer}>
      <div className={styles.div2}>
        <div onClick={() => history.goBack()} className={styles.maintitle}>
          <img className={styles.backIconForDesktop} src={chevronLeftDesk} alt="" />
          <div>&nbsp;</div>
          <div>&nbsp;</div>
          {title || 'FAQ'}
        </div>
        <div className={styles.desktopSearch}>
          Frequently Asked Questions (FAQ)
          <WindoInput
            value={search}
            className={styles.inputClass}
            labelClassName={styles.labelClass}
            placeholder="Search"
            setValue={(e) => setSearch(e)}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  className={styles.adorn}
                  position="start">
                  <img src={SearchIcon} alt="" />
                </InputAdornment>),
              classes: {
                input: cx(styles.slug),
              },
            }}
          />
        </div>
        {level.length > 0 && <Level title={title} value={level} />}
        {search.length === 0 && (
          <>
            {itemsToShow.map(x => (
              <>
                <div
                  className={styles.flex}
                  onClick={() => {
                    queryParams.set('level', x.value);
                    history.push({ search: queryParams.toString() });
                  }}>
                  <div className={styles.label}>
                    {x.label}
                  </div>
                  <img src={crIcon} alt="" />
                </div>
              </>
            ))}
            <div className={styles.contact}>
              <div className={styles.contactLabel}>
                For more information contact us on
              </div>
              <div className={styles.imgContainer}>
                <MuiButton
                  href={url1}
                  target="_blank"
                  onClick={WebViewUtils.openUrl('mailto:team@windo.live')}
                  className={styles.yes}
                >
                  <div className={styles.iconContainer}>
                    <div className={styles.icon}>
                      <img src={emailIcon} alt="" />
                    </div>
                    <div className={styles.actionLabel}>Email </div>
                  </div>
                </MuiButton>
                <div className={styles.no}></div>
                <MuiButton
                  href={url}
                  target="_blank"
                  onClick={(e) => { openLinks(e, 'whatsapp'); }}
                  className={styles.yes}
                >
                  <div className={styles.iconContainer}>
                    <div className={styles.icon}>
                      <img src={whatsappIcon} alt="" />
                    </div>
                    <div className={styles.actionLabel}>Whatsapp</div>
                  </div>
                </MuiButton>
                <MuiButton
                  onClick={(e) => { openLinks(e, 'youtube'); }}
                  className={styles.yes}
                >
                  <div className={styles.iconContainer}>
                    <div className={styles.icon}>
                      <img src={youtubeIcon} alt="" />
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
                      <img src={blogIcon} alt="" className={styles.blogIcon} />
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
                      <img src={communityIcon} alt="" />
                    </div>
                    <div className={styles.actionLabel}>Community</div>
                  </div>
                </MuiButton>
              </div>
            </div>
          </>
        )}
        {search.length > 0 && (
          <div className={styles.search}>
            {searched.map((x, i) => (
              <div
                className={styles.flex1}
                onClick={() => {
                  if (expanded.includes(i)) {
                    setExpanded(expanded.filter(x => x !== i));
                    return;
                  }
                  Storage.setFaqs(x.q);
                  setExpanded(expanded.concat(i));
                }}>
                <div className={styles.sub}>
                  <img src={ViewDayIcon} className={styles.single} alt="" />
                  {/* eslint-disable-next-line react/no-danger */}
                  <div
                    className={styles.label1}
                    dangerouslySetInnerHTML={{ __html: getMark(x.q, search) }}
                  />
                  {expanded.includes(i) && (
                    <img src={cuIcon} alt="" />
                  )}
                  {!expanded.includes(i) && (
                    <img src={cdIcon} alt="" />
                  )}
                </div>
                {expanded.includes(i) && (
                  <div
                    className={styles.answer}
                    dangerouslySetInnerHTML={{ __html: getMark(x.a, search) }}
                  >
                  </div>
                )}
              </div>
            ))}
            {recent.length > 0 && (
              <>
                <div className={styles.recent}>
                  <img src={recentIcon} className={styles.single} alt="" />
                  <span> Recent Search </span>
                </div>
                {recent.map((x, i) => (
                  <div
                    className={styles.flex1}
                    onClick={() => {
                      if (expanded.includes(((i + 1) * 1000))) {
                        setExpanded(expanded.filter(x => x !== ((i + 1) * 1000)));
                        return;
                      }
                      setExpanded(expanded.concat((i + 1) * 1000));
                    }}>
                    <div className={styles.sub}>
                      <img src={SearchIcon} className={styles.single} alt="" />
                      <div className={styles.label1}>
                        {getData(x)?.q}
                      </div>
                      {expanded.includes(((i + 1) * 1000)) && (
                        <img src={cuIcon} alt="" />
                      )}
                      {!expanded.includes(((i + 1) * 1000)) && (
                        <img src={cdIcon} alt="" />
                      )}
                    </div>
                    {expanded.includes((i + 1) * 1000) && (
                      <div className={styles.answer}>
                        {getData(x)?.a}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
            {searched.length === 0 && (
              <div className={styles.no}>No FAQ's found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

Faq.defaultProps = {
  showItems: []
};

Faq.propTypes = {
  showItems: PropTypes.array
};

export default Faq;
