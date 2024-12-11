import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import API_BASE_URL from '../constants';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [groupAssociation, setGroupAssociation] = useState('');
  const navigate = useNavigate();

  const [emailError, setEmailError] = useState('');

  const handleSignUp = async (event) => {
    event.preventDefault();

    // Email validation: check if it ends with '@nyu.edu'
    if (!email.endsWith('@nyu.edu')) {
      setEmailError('domain must be @nyu.edu');
      return; // Stop further execution if validation fails
    }

    setEmailError(''); // Clear the error if validation passes

    const userData = {
      username: username,
      password: password,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_number: phoneNumber,
      address: address,
      role: role,
    };
    console.log('Sending User Data:', JSON.stringify(userData));
    
    
    try {
      const response = await fetch(`${API_BASE_URL}/apis/rest/users/addUser/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/login');
        console.log('Sign up successful:', data);
      } else {
        console.error(`Sign Up Failed: ${data.msg}`);
      }
    } catch (error) {
      console.error('Sign up error:', error);
    } 

  };

  // return (
  //   <Container component="main" maxWidth="xs">
  //     <Typography variant="h5" align="center" gutterBottom>
  //       Sign Up
  //     </Typography>
  //     <form onSubmit={handleSignUp}>
  //       <TextField
  //         variant="outlined"
  //         margin="normal"
  //         required
  //         fullWidth
  //         label="First Name"
  //         autoComplete="given-name"
  //         value={firstName}
  //         onChange={(e) => setFirstName(e.target.value)}
  //       />
  //       <TextField
  //         variant="outlined"
  //         margin="normal"
  //         required
  //         fullWidth
  //         label="Last Name"
  //         autoComplete="family-name"
  //         value={lastName}
  //         onChange={(e) => setLastName(e.target.value)}
  //       />
  //       <TextField
  //         variant="outlined"
  //         margin="normal"
  //         required
  //         fullWidth
  //         label="User Name"
  //         autoComplete="username"
  //         value={username}
  //         onChange={(e) => setUsername(e.target.value)}
  //       />
  //       <TextField
  //         variant="outlined"
  //         margin="normal"
  //         required
  //         fullWidth
  //         label="Email Address"
  //         type="email"
  //         autoComplete="email"
  //         value={email}
  //         onChange={(e) => setEmail(e.target.value)}
  //         error={!!emailError}
  //         helperText={emailError}
  //       />
  //       <TextField
  //         variant="outlined"
  //         margin="normal"
  //         required
  //         fullWidth
  //         label="Phone Number"
  //         type="tel"
  //         autoComplete="tel"
  //         value={phoneNumber}
  //         onChange={(e) => setPhoneNumber(e.target.value)}
  //       />
  //       <TextField
  //         variant="outlined"
  //         margin="normal"
  //         required
  //         fullWidth
  //         label="Address"
  //         autoComplete="address-line1" 
  //         value={address}
  //         onChange={(e) => setAddress(e.target.value)}
  //       />
  //       <TextField
  //         variant="outlined"
  //         margin="normal"
  //         required
  //         fullWidth
  //         label="Password"
  //         type="password"
  //         autoComplete="new-password"
  //         value={password}
  //         onChange={(e) => setPassword(e.target.value)}
  //       />

  //       {/* User Type Selection */}
  //       <FormControl fullWidth margin="normal" required>
  //         <InputLabel>User Type</InputLabel>
  //         <Select
  //           value={role}
  //           onChange={(e) => {
  //             setRole(e.target.value);
  //             setGroupAssociation(''); // Reset group association when changing user type
  //           }}
  //         >
  //           <MenuItem value="student">Student</MenuItem>
  //           <MenuItem value="foodBankCustomer">Food Bank Customer</MenuItem>
  //           <MenuItem value="studentGroup">Student Group</MenuItem>
  //           <MenuItem value="vendor">Vendor</MenuItem>
  //         </Select>
  //       </FormControl>

  //       {/* Group Association Field (Conditionally Rendered) */}
  //       {(role === 'foodBankCustomer' || role === 'studentGroup' || role === 'vendor') && (
  //         <TextField
  //           variant="outlined"
  //           margin="normal"
  //           fullWidth
  //           label="Group Association"
  //           value={groupAssociation}
  //           onChange={(e) => setGroupAssociation(e.target.value)}
  //           autoComplete="organization"
  //         />
  //       )}

  //       <Button type="submit" variant="contained" color="primary" fullWidth>
  //         Sign Up
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
          maxWidth: 600,
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Sign Up
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ color: '#666', marginBottom: 3 }}
        >
          Fill in the details to create a new account!
        </Typography>
        <form onSubmit={handleSignUp}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="First Name"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Last Name"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="User Name"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Phone Number"
            type="tel"
            autoComplete="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Address"
            autoComplete="address-line1"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: 3 }}
          />
          <FormControl fullWidth margin="normal" required sx={{ marginBottom: 3 }}>
            <InputLabel>User Type</InputLabel>
            <Select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setGroupAssociation('');
              }}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="foodBankCustomer">Food Bank Customer</MenuItem>
              <MenuItem value="studentGroup">Student Group</MenuItem>
              <MenuItem value="vendor">Vendor</MenuItem>
            </Select>
          </FormControl>
          {(role === 'foodBankCustomer' || role === 'studentGroup' || role === 'vendor') && (
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Group Association"
              value={groupAssociation}
              onChange={(e) => setGroupAssociation(e.target.value)}
              autoComplete="organization"
              sx={{ marginBottom: 3 }}
            />
          )}
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
            Sign Up
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default SignUpPage;