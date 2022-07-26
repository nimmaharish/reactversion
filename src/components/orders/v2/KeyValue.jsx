import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import cx from 'classnames';
import cmStyles from './Common.module.css';

export function KeyValue({
  title,
  value,
  valueClass,
  titleWidth,
  valueWidth,
  titleClass,
}) {
  return (
    <>
      <Grid item xs={titleWidth} className={cx(cmStyles.title, titleClass)}>
        {title}
      </Grid>
      <Grid item xs={valueWidth} className={cx(cmStyles.value, valueClass)}>
        <span>:</span>
        <span>
          {value}
        </span>
      </Grid>
    </>
  );
}

KeyValue.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
  valueClass: PropTypes.string,
  titleClass: PropTypes.string,
  titleWidth: PropTypes.number,
  valueWidth: PropTypes.number,
};

KeyValue.defaultProps = {
  title: '',
  value: '',
  valueClass: '',
  titleClass: '',
  titleWidth: 4,
  valueWidth: 8,
};
