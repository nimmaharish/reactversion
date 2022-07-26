import React from 'react';
import { useField } from 'formik';
import { useBankDetailsByIFSC } from 'hooks/bank';
import { Grid } from '@material-ui/core';
import { ReactInput } from 'phoenix-components';
import styles from 'containers/profile/bank/BankDetails.module.css';

function BankDetail() {
  const [{ value }] = useField('ifsc');
  const details = useBankDetailsByIFSC(value || '');

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <ReactInput
          label="Branch"
          inputClass={styles.input}
          nestedInputClass={styles.nested}
          readonly={true}
          placeholder="Branch Name"
          value={details.branch || ''}
          className={styles.textField}
          disabled={true}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={6}>
        <ReactInput
          label="City"
          inputClass={styles.input}
          nestedInputClass={styles.nested}
          readonly={true}
          placeholder="City Name"
          value={details.city || ''}
          className={styles.textField}
          disabled={true}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={6}>
        <ReactInput
          label="State"
          inputClass={styles.input}
          nestedInputClass={styles.nested}
          readonly={true}
          placeholder="State Name"
          value={details.state || ''}
          className={styles.textField}
          disabled={true}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={6}>
        <ReactInput
          label="Bank"
          inputClass={styles.input}
          nestedInputClass={styles.nested}
          readonly={true}
          placeholder="Bank Name"
          value={details.bank || ''}
          className={styles.textField}
          disabled={true}
          variant="outlined"
        />
      </Grid>
    </Grid>
  );
}

export default BankDetail;
