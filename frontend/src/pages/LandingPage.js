import React from 'react';
import { Container, Typography, Button, Grid2 } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Welcome to Campus Cuisine Exchange
      </Typography>
      <Grid2 container spacing={2} direction="column" alignItems="center">
        <Grid2 item>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Log In
          </Button>
        </Grid2>
        <Grid2 item>
          <Button variant="outlined" color="secondary" onClick={handleSignUp}>
            Sign Up
          </Button>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default LandingPage;
