import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../constants';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try{
      const response = await fetch(`${API_BASE_URL}/apis/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: username, 
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        console.log('Login submitted', { username, password });
        navigate('/home');
      } else {
        console.error('Login failed: RESPONSE NOT OK');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  // return (
  //   <Container component="main" maxWidth="xs">
  //     <Typography variant="h5" align="center" gutterBottom>
  //       Log In
  //     </Typography>
  //     <form onSubmit={handleLogin}>
  //       <TextField
  //         variant="outlined"
  //         margin="normal"
  //         required
  //         fullWidth
  //         label="User Name"
  //         type="username"
  //         autoComplete="username"
  //         value={username}
  //         onChange={(e) => setUsername(e.target.value)}
  //         autoFocus
  //       />
  //       <TextField
  //         variant="outlined"
  //         margin="normal"
  //         required
  //         fullWidth
  //         label="Password"
  //         type="password"
  //         autoComplete="current-password"
  //         value={password}
  //         onChange={(e) => setPassword(e.target.value)}
  //       />
  //       <Button type="submit" variant="contained" color="primary" fullWidth>
  //         Log In
  //       </Button>
  //     </form>
  //   </Container>
  // );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url('/background.jpg')`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 4,
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Log In
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ color: '#666', marginBottom: 3 }}
        >
          Enter your credentials to access your account
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="User Name"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            sx={{
              marginBottom: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              marginBottom: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              padding: '10px',
              textTransform: 'none',
              fontSize: '1rem',
              borderRadius: 2,
              backgroundColor: '#007BFF',
              '&:hover': {
                backgroundColor: '#0056b3',
              },
            }}
          >
            Log In
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;