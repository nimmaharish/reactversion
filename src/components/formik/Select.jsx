/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem } from '@material-ui/core';
import cx from 'classnames';
import { Select as BaseSelect } from 'formik-material-ui';
import { useField } from 'formik';
import styles from './Select.module.css';

export function Select({
  className,
  menuClassName,
  name,
  options,
  ...props
}) {
  const [, meta, helpers] = useField(name);

  return (
    <BaseSelect
      className={cx(styles.select, className)}
      value={meta.value}
      onChange={e => helpers.setValue(e.target.value)}
      {...props}
    >
      {options.map(({
        value,
        label,
        ...menuProps
      }) => (
        <MenuItem
          key={value}
          className={cx(styles.menuItem, menuClassName)}
          value={value}
          {...menuProps}
        >
          {label}
        </MenuItem>
      ))}
    </BaseSelect>
  );
}

Select.propTypes = {
  className: PropTypes.string,
  menuClassName: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
};

Select.defaultProps = {
  className: '',
  menuClassName: '',
};
