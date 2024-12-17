import React from 'react';
import { Container, Box, Typography, Button, Grid2 } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import '@fontsource/dancing-script';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  // return (
  //   <Container component="main" maxWidth="xs">
  //     <Typography variant="h4" align="center" gutterBottom>
  //       Welcome to Campus Cuisine Exchange
  //     </Typography>
  //     <Grid2 container spacing={2} direction="column" alignItems="center">
  //       <Grid2 item>
  //         <Button variant="contained" color="primary" onClick={handleLogin}>
  //           Log In
  //         </Button>
  //       </Grid2>
  //       <Grid2 item>
  //         <Button variant="outlined" color="secondary" onClick={handleSignUp}>
  //           Sign Up
  //         </Button>
  //       </Grid2>
  //     </Grid2>
  //   </Container>
  // );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url('/background.jpg')`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
        padding: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 2, 
        }}
      >
        <LocalPizzaIcon
          sx={{
            fontSize: 40,
            color: '#006073', 
            marginRight: 2, 
          }}
        />
        <FastfoodIcon
          sx={{
            fontSize: 60,
            color: '#006073', 
          }}
        />
        <RamenDiningIcon
          sx={{
            fontSize: 40,
            color: '#006073', 
            marginLeft: 2, 
          }}
        />
      </Box>

      <Container
        component="main"
        maxWidth="xs"
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: 4,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          padding: 4,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h4"
          style = {{fontFamily: 'Dancing Script'}}
          sx={{
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 2,
          }}
        >
          Campus Cuisine Exchange
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 'bold',
            color: '#666',
            marginBottom: 3,
          }}
        >
          Discover and share amazing food experiences on campus.
        </Typography>
        <Grid2 container spacing={2} justifyContent="center" direction="column">
          <Grid2 item xs={12}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleLogin}
              sx={{
                padding: '10px 20px',
                boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                textTransform: 'none',
                backgroundColor: '#007BFF', 
                '&:hover': {
                  backgroundColor: '#0056b3', 
                },
              }}
            >
              Log In
            </Button>
          </Grid2>
          <Grid2 item xs={12}>
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={handleSignUp}
              sx={{
                padding: '10px 20px',
                borderColor: '#888',
                color: '#555',
                textTransform: 'none',
                ':hover': {
                  borderColor: '#555',
                  backgroundColor: '#f7f7f7',
                },
              }}
            >
              Sign Up
            </Button>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default LandingPage;
