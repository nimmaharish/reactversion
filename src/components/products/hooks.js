import { useEffect, useState } from 'react';
import Loader from 'services/loader';
import SnackBar from 'services/snackbar';
import { Becca } from 'api';
import { useHistory } from 'react-router-dom';
import { unMarshallPayload } from 'components/products/variantUtils';

export function useProductDetails(id) {
  const [product, setProduct] = useState(null);
  const history = useHistory();

  const fetchDetails = async () => {
    Loader.show();
    try {
      const data = await Becca.getVariants(id);
      setProduct(unMarshallPayload(data));
    } catch (e) {
      history.goBack();
      SnackBar.showError(e);
    } finally {
      Loader.hide();
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  return [product, fetchDetails];
}
