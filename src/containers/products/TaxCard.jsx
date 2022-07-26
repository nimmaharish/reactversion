import React from 'react';
import { Switch } from 'phoenix-components/lib/formik';
import PropTypes from 'prop-types';
import { useField } from 'formik';
import styles from './TaxCard.module.css';

export function TaxCard({ tax }) {
  const [{ value: ids }, , helpers] = useField('taxes.ids');

  const isIncluded = ids.includes(tax._id);

  const onChange = () => {
    const items = ids || [];
    if (isIncluded) {
      helpers.setValue(items.filter(t => t !== tax._id));
      return;
    }
    items.push(tax._id);
    helpers.setValue(items);
  };

  return (
    <div className={styles.taxCard}>
      <div className={styles.taxTitle}>
        {tax.title}
      </div>
      <div className={styles.right}>
        <Switch active={isIncluded} onChange={onChange} />
      </div>
    </div>
  );
}

TaxCard.propTypes = {
  tax: PropTypes.object.isRequired,
};

TaxCard.defaultProps = {
};
