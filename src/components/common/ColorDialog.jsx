import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogActions, DialogContent
} from '@material-ui/core';
import { SketchPicker } from 'react-color';
import _ from 'lodash';
import { useDesktop } from 'contexts';
import { Button } from 'phoenix-components';
import styles from './ColorDialog.module.css';

export function ColorDialog({
  onChange,
  color
}) {
  const isDesktop = useDesktop();
  const [state, setState] = useState(color);

  return (
    <>
      {!isDesktop && (
        <Dialog open={true} maxWidth="md" fullWidth>
          <DialogContent>
            <SketchPicker
              color={_.isEmpty(state) ? undefined : state}
              onChange={clr => setState(clr.hex)}
              width="95%"
            />
          </DialogContent>
          <DialogActions>
            <Button
              primary={false}
              onClick={() => onChange(color)}
              label="Cancel"
              className={styles.button}
            />
            <Button
              primary={true}
              onClick={() => onChange(state)}
              label="Save"
              className={styles.button}
            />
          </DialogActions>
        </Dialog>
      )}
      {isDesktop && (
        <Dialog open={true} maxWidth="sm">
          <div>
            <SketchPicker
              color={_.isEmpty(state) ? undefined : state}
              onChange={clr => setState(clr.hex)}
              width="95%"
            />
          </div>
          <div className={styles.container}>
            <Button
              primary={false}
              fullWidth
              onClick={() => onChange(color)}
              label="Cancel"
              className={styles.button1}
            />
            <Button
              primary={true}
              fullWidth
              onClick={() => onChange(state)}
              label="Save"
              className={styles.button1}
            />
          </div>
        </Dialog>
      )}
    </>
  );
}

ColorDialog.propTypes = {
  color: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

ColorDialog.defaultProps = {
  color: undefined,
};
