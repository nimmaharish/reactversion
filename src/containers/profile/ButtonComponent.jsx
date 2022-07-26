/* eslint-disable react/jsx-props-no-spreading */
import React, { forwardRef } from 'react';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';

const ButtonComponent = forwardRef(({
  color, type, text, style, onclick, size, starticon, fullwidth, ...props
}, ref) => (
  <Button
    color={color}
    variant="contained"
    type={type}
    size={size}
    className={style}
    onClick={onclick}
    startIcon={starticon}
    fullWidth={fullwidth}
    ref={ref}
    {...props}
  >
    {text}
  </Button>
));

ButtonComponent.propTypes = {
  color: PropTypes.string,
  type: PropTypes.string,
  text: PropTypes.string.isRequired,
  style: PropTypes.string,
  onclick: PropTypes.func.isRequired,
  size: PropTypes.string,
  fullwidth: PropTypes.bool,
  starticon: PropTypes.any,
};

ButtonComponent.defaultProps = {
  style: '',
  type: 'submit',
  color: 'primary',
  size: 'medium',
  starticon: undefined,
  fullwidth: false,
};

export default ButtonComponent;
