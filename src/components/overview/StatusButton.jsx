import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'phoenix-components';

export function StatusButton({ status }) {
  const newStatus = status === 'pending' || status === 'created' ? 'live' : status;
  return (
    <Badge dot rounded variant={newStatus === 'live' ? 'secondary' : 'primary'}>
      {newStatus}
    </Badge>
  );
}

StatusButton.propTypes = {
  status: PropTypes.string.isRequired,
};
