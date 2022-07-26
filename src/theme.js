import { createTheme } from '@material-ui/core';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4B7BE5'
    },
    secondary: {
      main: '#ffffff'
    }
  },
  typography: {
    fontFamily: 'Outfit',
    htmlFontSize: 12,
    fontSize: 9
  },
  MuiSelect: { root: { '&.MuiFilledInput-input': { color: '#a2a2a2', }, }, },
  MuiButton: {
    contained: {
      backgroundColor: '#FFD538',
      borderRadius: '8px',
      color: 'var(--primary)'
    },
  },
  MuiFilledInput: {
    input: {
      padding: '6px',
    }
  },
  MuiFormLabel: {
    root: {
      textTransform: 'capitalize'
    }
  },
  overrides: {
    MuiDialog: {
      paper: {
        // border: '1px solid #FED538',
      }
    },
    MuiFormControlLabel: {
      label: {
        color: 'var(--black)'
      }
    }
  }
});

export default theme;
