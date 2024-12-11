// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import AddEditRecipe from './pages/AddEditRecipe';
import ViewRecipe from './pages/ViewRecipe';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/add_edit_recipe" element={<AddEditRecipe />} />
        <Route path="/view_recipe/:recipeId" element={<ViewRecipe />} />
      </Routes>
    </Router>
    </ThemeProvider>
    
  );
}

export default App;
