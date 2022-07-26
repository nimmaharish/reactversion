import React from 'react';
import PencilIcon from 'assets/v2/settings/edit.svg';
import PropTypes from 'prop-types';
import cx from 'classnames';
import _ from 'lodash';
import { defaultItems } from './utils';
import styles from './Card.module.css';

export function Card({
  image, title, description, showEdit, onClick
}) {
  const isCustomImage = _.flatten(
    defaultItems.map(x => x.items.map(y => y))
  ).filter(x => x.image === image).length === 0;
  return (
    <div
      onClick={onClick}
      className={cx(styles.card,
        {
          [styles.noRight]: !showEdit,
          [styles.custom]: isCustomImage
        })}
      style={{ backgroundImage: `url(${image})` }}
    >
      {showEdit && <img className={styles.edit} src={PencilIcon} alt="" />}
      <div className={styles.cardTitle}>
        {title || 'Title Your Banner Here'}
      </div>
      <div className={styles.cardDesc}>
        {description || 'Make your banner text crisp, catchy and concise'}
      </div>
    </div>
  );
}

Card.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  showEdit: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

Card.defaultProps = {};
