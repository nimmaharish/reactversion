import React, { useEffect } from 'react';
import { Loading } from 'components/shared/Loading';
import { useQueryParams } from 'hooks';
import { useHistory } from 'react-router-dom';
import URL from 'utils/url';
import Storage from 'services/storage';

function NonLoggedInWeb() {
  const params = useQueryParams();
  const history = useHistory();
  useEffect(() => {
    if (!params.has('token')) {
      history.replace('/');
    }
    try {
      const { token } = URL.getTokenData(params.get('token'));
      if (!token) {
        history.replace('/');
      }
      Storage.setItem('token', token);
      window.location.reload();
    } catch (e) {
      history.replace('/');
    }
  }, []);

  return (
    <Loading />
  );
}

NonLoggedInWeb.propTypes = {};

NonLoggedInWeb.defaultProps = {};

export default NonLoggedInWeb;
