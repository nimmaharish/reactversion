import React from 'react';
import PropTypes from 'prop-types';
import { Grid, } from '@material-ui/core';
import { useField } from 'formik';
import { FormikInput } from 'phoenix-components';
import { Radio } from 'phoenix-components/lib/formik';

export function CreateProduct({
  prefix
}) {
  const getName = name => (prefix ? `${prefix}.${name}` : name);
  const [availableType] = useField(getName('availableType'));

  return (
    <>
      <FormikInput
        name={getName('title')}
        fullWidth
        label="Name"
        placeholder="Product Name"
      />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormikInput
            name={getName('discountedAmount')}
            fullWidth
            label="Price"
            placeholder="0"
            type="number"
          />
        </Grid>
        <Grid item xs={6}>
          <FormikInput
            name={getName('amount')}
            fullWidth
            label="Strike-off Price"
            helperText="(Optional)"
            placeholder="0"
            type="number"
          />
        </Grid>
        <Grid item xs={6}>
          <div>Availability</div>
          <br />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Radio
                name={getName('availableType')}
                value="finite"
                label="Limited Stock"
              />
            </Grid>
            <Grid item xs={12}>
              <Radio
                name={getName('availableType')}
                value="infinite"
                label="Always In-Stock"
              />
            </Grid>
          </Grid>
        </Grid>
        {availableType.value === 'finite' && (
          <Grid item xs={6}>
            <FormikInput
              name={getName('available')}
              fullWidth
              label="Quantity"
              type="number"
              placeholder="0"
            />
          </Grid>
        )}
      </Grid>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div>Customizable</div>
        </Grid>
        <Grid item xs={6}>
          <Radio name={getName('customizable')} value="true" label="Yes" />
        </Grid>
        <Grid item xs={6}>
          <Radio name={getName('customizable')} value="false" label="No" />
        </Grid>
      </Grid>
    </>
  );
}

CreateProduct.propTypes = {
  prefix: PropTypes.string,
};

CreateProduct.defaultProps = {
  prefix: null,
};
