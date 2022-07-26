/* eslint-disable react/no-multi-comp */
import React, {
  useState,
  useEffect,
  useContext
} from 'react';
import {
  Grid, TextField, FormControlLabel, Checkbox
} from '@material-ui/core';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { useShop } from 'contexts';
import { ProductContext, UserContext } from 'contexts';
import styles from './Product.module.css';

function Package({
  dimension, weigh, delivery, setDeliveryCharges, setItemDimensions, setItemWeight
}) {
  const [length, setLength] = useState(dimension?.length || '');
  const [width, setWidth] = useState(dimension?.width || '');
  const [height, setHeight] = useState(dimension?.height || '');
  const [weight, setWeight] = useState(weigh || '');
  const [deliveryCharges, setDC] = useState(delivery);
  const {
    sp
  } = useContext(ProductContext);
  const context = useContext(UserContext);
  const shop = useShop();
  const deliveryValue = get(context, 'shop.delivery.charges', 0);

  const trigger = () => {
    const dimensions = { length, width, height };
    if (!setItemDimensions || !setItemWeight) {
      return;
    }
    setItemDimensions(dimensions);
    setItemWeight(weight);
    setDeliveryCharges(deliveryCharges);
  };

  const getCurrency = (number) => (`${shop?.currency} ${number || 0}`);

  const getLabel = () => {
    if (sp <= 0) {
      return '';
    }
    if (deliveryCharges) {
      return ` ( Customer total payable : ${getCurrency(parseFloat(sp) + parseFloat(deliveryValue))} ) `;
    }
    return ` ( Customer total payable : ${getCurrency(sp)} )`;
  };

  useEffect(() => {
    trigger();
  }, [length, width, height, weight, deliveryCharges]);

  return (
    <Grid container spacing={1} alignItems="baseline">
      <Grid item xs={12} className={styles.head}>
        Dimensions & Weight:
      </Grid>
      <Grid container spacing={2} className="fullWidth">
        <Grid item xs={3}>
          <TextField
            type="number"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            inputProps={{ min: 1, step: 1 }}
            variant="standard"
            fullWidth
            label="Length"
            placeholder="0"
            helperText="cm"
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            inputProps={{ min: 1, step: 1 }}
            variant="standard"
            fullWidth
            label="Width"
            placeholder="0"
            helperText="cm"
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            inputProps={{ min: 1, step: 1 }}
            variant="standard"
            fullWidth
            placeholder="0"
            label="Height"
            helperText="cm"
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            inputProps={{ min: 1, step: 1 }}
            variant="standard"
            fullWidth
            label="Weight"
            placeholder="0"
            helperText="gm"
          />
        </Grid>
      </Grid>
      <Grid item xs={12} className="">
        <FormControlLabel
          value="end"
          classes={{
            label: 'fs10'
          }}
          control={(
            <Checkbox
              checked={deliveryCharges}
              onChange={(e) => { setDeliveryCharges(e.target.checked); setDC(e.target.checked); }}
              color="primary"
            />
          )}
          label={`Delivery Charges Extra ${getLabel()}`}
          labelPlacement="end"
        />
      </Grid>
    </Grid>
  );
}

Package.propTypes = {
  setItemDimensions: PropTypes.func.isRequired,
  setItemWeight: PropTypes.func.isRequired,
  dimension: PropTypes.object.isRequired,
  weigh: PropTypes.object.isRequired,
  delivery: PropTypes.object.isRequired,
  setDeliveryCharges: PropTypes.func.isRequired,
};

export default Package;
