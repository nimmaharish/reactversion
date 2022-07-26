import React, { useEffect, useState } from 'react';
import { loadTranslator, resetTranslatorBody } from 'utils/translate';
import SnackBar from 'services/snackbar';
import cookie from 'react-cookies';
import { useLanguage } from 'contexts';
import _ from 'lodash';

export function TranslateButton() {
  const [translator, setTranslator] = useState(null);
  const lang = useLanguage();

  const translatePage = async () => {
    try {
      if (translator) {
        document.location.reload();
        return;
      }
      const exists = cookie.load('googtrans');
      if (!_.isEmpty(exists) && exists !== `/en/${lang}`) {
        const { host } = window.location;
        cookie.remove('googtrans', {
          domain: host.includes('windo.live')
            ? '.windo.live' : host.includes('mywindo.shop') ? '.mywindo.shop' : 'localhost',
        });
      }
      cookie.save('googtrans', `/en/${lang}`, { path: '/' });
      const Translator = await loadTranslator();
      const tr = new Translator({
        pageLanguage: 'en',
        autoDisplay: false,
      }, 'globalTranslator');
      setTranslator(tr);
      resetTranslatorBody();
    } catch (e) {
      SnackBar.showError(e);
    }
  };

  useEffect(() => {
    if (lang !== 'en') {
      translatePage();
    }
    if (lang === 'en' && translator) {
      document.location.reload();
    }
  }, [lang]);

  if (lang === 'en') {
    return null;
  }

  return (
    <>
      <div>
        <div id="globalTranslator" />
      </div>
    </>
  );
}

TranslateButton.propTypes = {};

TranslateButton.defaultProps = {};
