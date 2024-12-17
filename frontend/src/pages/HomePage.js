import React, { useState } from 'react';
import { AppBar, Toolbar, Tabs, Tab, Typography, Button, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Recipes from './Recipes';
import GroceryMarketplace from './GroceryMarketplace';
import ExploreRecipes from './ExploreRecipes';
import '@fontsource/dancing-script';

// const TabPanel = (props) => {
//   const { children, value, index, ...other } = props;

//   return (
//     <div
//       role="tabpanel"
//       hidden={value !== index}
//       id={`tabpanel-${index}`}
//       aria-labelledby={`tab-${index}`}
//       {...other}
//     >
//       {value === index && (
//         <Box p={3}>
//           {children}
//         </Box>
//       )}
//     </div>
//   );
// };

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
        <Box sx={{ p: 3, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 2 }}>
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

  // return (
  //   <Container maxWidth="lg">
  //     {/* App Bar */}
  //     <AppBar position="static" color="primary">
  //       <Toolbar>
  //         <Tabs value={tabValue} textColor="secondary" indicatorColor="secondary" onChange={handleTabChange} aria-label="recipe tabs">
  //           <Tab label="Recipes" id="tab-0" aria-controls="tabpanel-0" />
  //           <Tab label="Grocery Marketplace" id="tab-1" aria-controls="tabpanel-1" />
  //         </Tabs>
  //         <Typography variant="h6" style={{ flexGrow: 1 }}></Typography>
  //         <Button color="inherit" onClick={handleLogout}>Logout</Button>
  //       </Toolbar>
  //     </AppBar>

  //     {/* Tab Panels */}
  //     <TabPanel value={tabValue} index={0}>
  //       <Recipes />
  //     </TabPanel>

  //     <TabPanel value={tabValue} index={1}>
  //       <GroceryMarketplace />
  //     </TabPanel>
  //   </Container>
  // );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundImage: 'url(/background.jpg)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(90deg, #00848f, #006073)',
          boxShadow: 3,
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            style= {{fontFamily: 'Dancing Script'}}
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              letterSpacing: 1,
            }}
          >
            Campus Cuisine Exchange
          </Typography>
          <Button
            variant="outlined"
            sx={{
              color: '#ffffff',
              borderColor: '#ffffff',
              '&:hover': {
                backgroundColor: '#ffffff',
                color: '#3f51b5',
              },
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 'bold',
              textTransform: 'none',
              '&:hover': {
                color: '#2196f3',
              },
            },
            '& .Mui-selected': {
              color: '#2196f3',
            },
          }}
        >
          <Tab label="My Account" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Grocery Marketplace" id="tab-1" aria-controls="tabpanel-1" />
          <Tab label="Explore" id="tab-0" aria-controls="tabpanel-2" />
        </Tabs>
      </Container>

      <Container
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          mt: 4,
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: 2,
          p: 3,
          my: 4,
        }}
      >
        <TabPanel value={tabValue} index={0}>
          <Recipes />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <GroceryMarketplace />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <ExploreRecipes />
        </TabPanel>
      </Container>

      <Box
        component="footer"
        sx={{
          mt: 'auto',
          py: 2,
          textAlign: 'center',
          backgroundColor: 'linear-gradient(90deg, #00848f, #006073)',
          color: '#ffffff',
        }}
      >
        <Typography variant="body2">
          © 2024 Campus Cuisine Exchange. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;
