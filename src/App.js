import React, { useState } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Container from 'Container';
import ErrorBoundary from 'layouts/ErrorBoundary';
import SnackBar from 'components/shared/SnackBar';
import Loader from 'components/shared/Loader';
import SwiperCore, { Lazy, Pagination } from 'swiper';
import './App.css';
import { UpdateAlert } from 'components/updateAlert';
import { Theme } from 'phoenix-components';
import { AppContext } from 'contexts';
import { useIsDesktopJs } from 'hooks/device';
import { TranslateButton } from 'components/global/TranslateButton';
import _ from 'lodash';
import Ratings from 'components/reviewProduct/Ratings';
import theme from './theme';

SwiperCore.use([Pagination, Lazy]);

function App() {
  const isDesktop = useIsDesktopJs();
  const [language, setLanguage] = useState(() => {
    const lang = localStorage.getItem('language');
    return _.isEmpty(lang) ? 'en' : lang;
  });

  const onSetLanguage = (lang) => {
    localStorage.setItem('language', lang);
    setLanguage(lang);
  };

  return (
    <AppContext.Provider
      value={{
        isDesktop,
        language,
        setLanguage: onSetLanguage
      }}>
      <ThemeProvider theme={theme}>
        <Theme>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <ErrorBoundary>

              <Container />
              <SnackBar />
              <Loader />
              <UpdateAlert />
              <Ratings />
              <TranslateButton />
            </ErrorBoundary>
          </MuiPickersUtilsProvider>
        </Theme>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
