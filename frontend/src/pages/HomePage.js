import React, { useState } from 'react';
import { AppBar, Toolbar, Tabs, Tab, Typography, Button, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Recipes from './Recipes';
import MealPlan from './MealPlan';
import GroceryMarketplace from './GroceryMarketplace';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
};

const HomePage = () => {
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    navigate('/login'); // Navigate back to login page after clicking logout
  };

  return (
    <Container maxWidth="lg">
      {/* App Bar */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Tabs value={tabValue} textColor="secondary" indicatorColor="secondary" onChange={handleTabChange} aria-label="recipe tabs">
            <Tab label="Recipes" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Meal Plan" id="tab-1" aria-controls="tabpanel-1" />
            <Tab label="Grocery Marketplace" id="tab-2" aria-controls="tabpanel-2" />
          </Tabs>
          <Typography variant="h6" style={{ flexGrow: 1 }}></Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        <Recipes />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <MealPlan />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <GroceryMarketplace />
      </TabPanel>
    </Container>
  );
};

export default HomePage;
