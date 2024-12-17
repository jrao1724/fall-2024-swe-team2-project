import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4a4a4a',  // Dark grey as primary color
    },
    secondary: {
      main: '#ffb74d',  // Orange for secondary color
    },
    background: {
      default: '#f5f5f5',  // Light grey for background
      paper: '#ffffff',    // White background for paper
    },
    text: {
      primary: '#1e1e1e',  // Darker text
      secondary: '#5a5a5a',  // Greyish text
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    fontSize: 14,
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',  // Disable uppercase in buttons
    },
  },
});

export default theme;
