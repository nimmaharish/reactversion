import React, { useState, } from 'react';
import { Grid, TextField } from '@material-ui/core';
import { keyBy, mapValues } from 'lodash';
import AddCircleIcon from '@material-ui/icons/AddCircle';

function Pairs() {
  const [pairs, setPairs] = useState([]);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const getVariants = (item, isValues) => {
    const sending = mapValues(keyBy(item, 'key'), 'value');
    if (isValues) {
      return Object.values(sending)
        .join('/');
    }
    const keys = Object.keys(sending)
      .join('/');
    return keys;
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div>
          {`${getVariants(pairs, false)} - ${getVariants(pairs, true)}`}
        </div>
      </Grid>
      <Grid item xs={3}>
        <TextField
          label="key"
          helperText="e.g Color"
          variant="standard"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          type={(key.toLowerCase() === 'color' || key.toLocaleLowerCase === 'colour') ? 'color' : 'text'}
          label="value"
          helperText="e.g Blue"
          variant="standard"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Grid>
      <Grid item xs={3} className="flexCenter">
        <AddCircleIcon
          onClick={() => {
            if (key.length > 0 && value.length > 0) {
              const newPairs = [...pairs];
              newPairs.push({
                key,
                value
              });
              setPairs(newPairs);
              // const sending = mapValues(keyBy(newPairs, 'key'), 'value');
              // onSave(sending);
              setKey('');
              setValue('');
            }
          }} />
      </Grid>
    </Grid>
  );
}

// Pairs.propTypes = {
//   onSave: PropTypes.func.isRequired,
// };

export default Pairs;
