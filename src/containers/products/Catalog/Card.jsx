import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Becca } from 'api/index';
import { useHistory } from 'react-router-dom';
import { useToggle } from 'hooks/common';
import Loader from 'services/loader';
import { SnackBar } from 'services';
import { DeleteAlert } from 'components/shared/DeleteAlert';
import Delete from 'assets/images/products/catalog/delete.svg';
import styles from './Card.module.css';

export function ProductCard({ product, refresh }) {
  const history = useHistory();
  const image = _.get(product, 'images[0].url', '');
  const [openDelete, toggleDelete] = useToggle(false);

  const onClick = (e) => {
    if (e.target.id === 'target') {
      toggleDelete();
      return;
    }
    history.push(`/products/product/${product._id}`);
  };

  const deletePosts = async () => {
    try {
      Loader.show();
      await Becca.updateProduct(product._id, { catalogs: ['all'] });
      SnackBar.show('Product removed successfully from catalog.');
      refresh();
    } catch (e) {
      SnackBar.show('something went wrong, try again', 'error');
    } finally {
      Loader.hide();
    }
  };

  return (
    <>
      {openDelete
      && (
        <DeleteAlert
          title="Remove product from catalog?"
          onCancel={toggleDelete}
          onDelete={deletePosts}
          primary="Remove"
        />
      )}
      <div onClick={onClick} className={styles.root}>
        <img src={image} className={styles.img} alt="" />
        <div className="flexBetween">
          <div className={styles.name}>{product.title}</div>
          <img
            src={Delete}
            id="target"
            className={styles.del}
            alt="" />
        </div>
      </div>
    </>
  );
}

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
};

ProductCard.defaultProps = {};
