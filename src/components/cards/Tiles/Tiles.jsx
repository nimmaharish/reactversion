import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { Chip } from 'phoenix-components';
import { isEmpty } from 'lodash';
import styles from './Tiles.module.css';

function Tiles({
  item,
  onSelect,
  title,
  selected,
  isSub
}) {
  const selectedItems = selected;

  const handleChange = (isSelected, value) => {
    if (isSelected) {
      const items = selectedItems.concat(value);
      onSelect(items);
    } else {
      const items = selectedItems.filter(x => x !== value);
      onSelect(items);
    }
  };

  const isSelected = (item) => {
    const res = selectedItems.indexOf(item?.value) > -1;
    return res;
  };

  if (isEmpty(item)) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={cx(!isSub ? styles.title : styles.title1)}>
        {title}
      </div>
      <div className={styles.list}>
        {item.map((x) => (
          <div
            className={cx(styles.item)}
          >
            <Chip
              label={x.label}
              selected={isSelected(x)}
              clearIcon
              primary={true}
              onSelect={() => handleChange(!isSelected(x), x.value)}
            />
          </div>
          // <li
          //   className={cx(styles.item, isSelected(x) && styles.active)}
          //   key={i}
          //   role="presentation"
          //   onClick={() => handleChange(!isSelected(x), x.value)}
          // >
          //   {x.label}
          // </li>
        ))}
      </div>
    </div>
  );
}

Tiles.propTypes = {
  onSelect: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  isSub: PropTypes.bool.isRequired,
  item: PropTypes.array.isRequired,
  selected: PropTypes.array.isRequired,
};

export default Tiles;
