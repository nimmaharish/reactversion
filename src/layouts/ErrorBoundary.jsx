import React, { Component } from 'react';
import * as Sentry from '@sentry/react';
import PropTypes from 'prop-types';
import {
  Dialog, DialogContent, DialogActions, Button
} from '@material-ui/core';
import { updateWebApp } from 'utils/app';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // eslint-disable-next-line no-unused-vars
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // eslint-disable-next-line no-unused-vars
  componentDidCatch(error, errorInfo) {
    if (error?.isAxiosError) {
      return;
    }
    Sentry.captureException(error);
  }

  onClick = async () => {
    try {
      await updateWebApp();
    } catch (e) {
      document.location.reload(true);
    }
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <Dialog open={true} fullWidth>
          <DialogContent className="textCenter bold">
            Something went wrong.
          </DialogContent>
          <DialogActions>
            <Button
              color="secondary"
              variant="contained"
              fullWidth
              onClick={this.onClick}
            >
              Try again.
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.any.isRequired,
};

export default ErrorBoundary;
