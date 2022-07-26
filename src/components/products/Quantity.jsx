import React from 'react';
import cx from 'classnames';
import {
  FormikInput, Clickable,
} from 'phoenix-components';
import { Switch } from 'phoenix-components';
import { useField } from 'formik';
import styles from './Quantity.module.css';

const TABS = [
  {
    label: 'Limited',
    value: 'finite',
  },
  {
    label: 'Unlimited',
    value: 'infinite',
  },
];

export default function Quantity() {
//   const isDesktop = useDesktop();
  const [{ value: enabled }, , { setValue }] = useField('quantity.enabled');
  // eslint-disable-next-line array-bracket-spacing
  const [{ value: quantity }, , ] = useField('quantity');
  // eslint-disable-next-line array-bracket-spacing
  const [{ value: type }, , { setValue: setType } ] = useField('quantity.type');

  const operator = (a, b) => {
    if (quantity.minQuantity >= quantity.group) {
      return a + b;
    }
    return quantity.group * b;
  };

  const getMinValue = () => (quantity.minQuantity > quantity.group ? quantity.minQuantity : quantity.group);

  const getString = () => {
    if (type === 'infinite') {
      return 'unlimited';
    }
    let index = 0;
    const options = [];
    while (index <= quantity.maxQuantity) {
      const temp = {};
      const minValue = getMinValue();
      temp.value = operator(minValue, index);
      temp.label = operator(minValue, index);
      options.push(temp);
      // eslint-disable-next-line operator-assignment
      index = +(index + (quantity.minQuantity >= quantity.group ? quantity.group : 1));
      if (index === 0) {
        index = quantity.maxQuantity + 1;
      }
    }
    const list = options.filter(x => x.value <= quantity.maxQuantity && x.value > 0).map(x => x.value);
    if (list.length > 4) {
      return `${list[0]}, ${list[1]}, ${list[2]} ... upto ${list[list.length - 1]} items`;
    }
    return list.join(',');
  };

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        Order Quantity
        <Switch
          active={enabled}
          onChange={() => {
            setValue(!enabled);
          }}
        />
      </div>
      <div className={styles.title1}>
        <FormikInput
          variant="outlined"
          name="quantity.minQuantity"
          type="number"
          label="Minimum Quantity"
          placeholder="e.g.1"
        />
        <div className={styles.head1}>Maximum Order Quantity</div>
        <div className={styles.title}>
          <div className={styles.tabs}>
            {TABS.map(t => (
              <Clickable
                onClick={() => {
                  setType(t.value);
                }}
                className={cx(styles.tab, { [styles.active]: t.value === (type || 'infinite') })}
              >
                {t.label}
              </Clickable>
            ))}
          </div>
        </div>
      </div>
      <div>
        {type === 'finite' && (
          <>
            <FormikInput
              variant="outlined"
              name="quantity.maxQuantity"
              type="number"
              label="Maximum Quantity"
              placeholder="e.g.1"
            />
            <FormikInput
              variant="outlined"
              name="quantity.group"
              type="number"
              label="Group Of"
              placeholder="1"
            />
            <div className={styles.helperT}>
              {`Customers can order quantities: ${getString()}`}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
