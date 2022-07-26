import React from 'react';
import PropTypes from 'prop-types';
import { Drawer } from 'components/shared/Drawer';
import { Button } from 'phoenix-components';
import styles from './KnowMoreDialog.module.css';

export function KnowMoreDialog({
  title, list, onAction, description
}) {
  return (
    <Drawer title={title}>
      <div className={styles.drawer}>
        <div>{description}</div>
        <ul className={styles.list}>
          {list.map((x, i) => <li className={styles.item}>{`${i + 1}) ${x}`}</li>)}
        </ul>
        <div className="flexCenter">
          <Button
            onClick={onAction}
            type="large"
            label="Connect"
          />
        </div>
      </div>
    </Drawer>
  );
}

KnowMoreDialog.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  onAction: PropTypes.func.isRequired,
};

KnowMoreDialog.defaultProps = {};
