import { useHistory } from 'react-router-dom';
import { useQueryParams } from 'hooks/location';

export function useOpenCreateAsProduct() {
  const history = useHistory();
  const params = useQueryParams();

  const open = id => {
    params.set('createProduct', id);
    history.push({
      search: params.toString(),
    });
  };

  return open;
}
