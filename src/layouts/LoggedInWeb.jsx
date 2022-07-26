import React, { useEffect, useState } from 'react';
import { Loading } from 'components/shared/Loading';
import { useQueryParams } from 'hooks';
import { useHistory } from 'react-router-dom';
import URL from 'utils/url';
import Storage from 'services/storage';
import { WebContext } from 'contexts/webContext';
import Container from 'containers/web/Container';

function LoggedInWeb() {
  const params = useQueryParams();
  const history = useHistory();
  const [state, setState] = useState(null);

  useEffect(() => {
    if (!params.has('token')) {
      history.replace({
        search: '',
      });
      return;
    }
    try {
      const { token, ...data } = URL.getTokenData(params.get('token'));
      if (!token) {
        return;
      }
      setState(data);
      if (token !== Storage.getItem('token')) {
        Storage.setItem('token', token);
      }
      history.replace({
        search: '',
      });
    } catch (e) {
      history.replace({
        search: '',
      });
    }
  }, []);

  if (params.has('token')) {
    return (
      <Loading />
    );
  }

  return (
    <WebContext.Provider value={{ data: state }}>
      <Container />
    </WebContext.Provider>
  );
}

LoggedInWeb.propTypes = {};

LoggedInWeb.defaultProps = {};

export default LoggedInWeb;
