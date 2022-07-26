import React from 'react';
import PropTypes from 'prop-types';
import { convertValidityToString } from 'containers/subscriptions/utils';
import { Clickable } from 'phoenix-components';
import cx from 'classnames';
import styles from './Radios.module.css';
// import {reverse} from 'lodash';

function Radios({
  selected,
  setSelected,
  price,
}) {
  return (
    <div className={styles.container}>
      {price.map(p => (
        <Clickable
          className={cx(styles.options, selected === p._id ? styles.active : styles.inActive)}
          onClick={() => setSelected(p)}>
          {convertValidityToString(p.validity)}
        </Clickable>
      ))}
    </div>
  );
}

Radios.propTypes = {
  setSelected: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
  price: PropTypes.array
};

Radios.defaultProps = {
  price: [],
};

export default Radios;
