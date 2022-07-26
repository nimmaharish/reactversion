import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Radio } from '@material-ui/core';

export const PrimaryRadio = withStyles({
  root: {
    color: 'black',
    '&$checked': {
      color: '#4B7BE5',
    },
  },
  checked: {},
// eslint-disable-next-line react/jsx-props-no-spreading
})((props) => <Radio color="default" {...props} />);
