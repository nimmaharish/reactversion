import React from 'react';
import { useFormikContext } from 'formik';

export function DebugValues() {
  const { values } = useFormikContext();
  if (process.env.REACT_APP_ENV !== 'development') {
    return null;
  }

  return (
    <pre>
      {JSON.stringify(values, null, 2)}
    </pre>
  );
}

DebugValues.propTypes = {};

DebugValues.defaultProps = {};
