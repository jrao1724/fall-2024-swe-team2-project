import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const SignUpPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [groupAssociation, setGroupAssociation] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (event) => {
    event.preventDefault();
    // Add signup logic here
    console.log('Sign Up submitted', { firstName, lastName, email, password, userType, groupAssociation });

    const form = event.currentTarget;

    if (form.checkValidity()) {
        // Form is valid, navigate to login
        navigate('/login');
      }

  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h5" align="center" gutterBottom>
        Sign Up
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
        />

        {/* User Type Selection */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>User Type</InputLabel>
          <Select
            value={userType}
            onChange={(e) => {
              setUserType(e.target.value);
              setGroupAssociation(''); // Reset group association when changing user type
            }}
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="foodBankCustomer">Food Bank Customer</MenuItem>
            <MenuItem value="studentGroupMember">Student Group Member</MenuItem>
          </Select>
        </FormControl>

        {/* Group Association Field (Conditionally Rendered) */}
        {(userType === 'foodBankCustomer' || userType === 'studentGroupMember') && (
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            label="Group Association"
            value={groupAssociation}
            onChange={(e) => setGroupAssociation(e.target.value)}
            autoComplete="organization"
          />
        )}

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Sign Up
        </Button>
      </form>
    </Container>
  );
};

export default SignUpPage;
