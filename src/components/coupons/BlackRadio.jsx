import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Radio } from '@material-ui/core';

export const BlackRadio = withStyles({
  root: {
    color: 'var(--black60)',
    '&$checked': {
      color: 'var(--primary)',
    },
  },
  checked: {},
// eslint-disable-next-line react/jsx-props-no-spreading
})((props) => <Radio color="default" {...props} />);
