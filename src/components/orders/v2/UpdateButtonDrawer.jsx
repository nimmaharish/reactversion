import React from 'react';
import PropTypes from 'prop-types';
import { useOrder } from 'hooks';
import { OrderContext } from 'contexts/orderContext';
import { StatusDrawer } from 'components/orders/v2/StatusDrawer';

function UpdateButtonDrawer({
  id,
  onClose
}) {
  const [order, refresh] = useOrder(id);
  if (!order) {
    return null;
  }

  return (
    <OrderContext.Provider
      value={{
        order,
        refresh
      }}>
      <StatusDrawer onClose={onClose} />
    </OrderContext.Provider>
  );
}

UpdateButtonDrawer.propTypes = {
  id: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

UpdateButtonDrawer.defaultProps = {};

export default UpdateButtonDrawer;
