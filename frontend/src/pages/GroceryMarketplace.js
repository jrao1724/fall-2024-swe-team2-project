import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import SellGroceries from './SellGroceries';
import BuyGroceries from './BuyGroceries';

const GroceryMarketplace = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Box>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        centered
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="Sell Groceries" />
        <Tab label="Buy Groceries" />
      </Tabs>
      <Box sx={{ p: 3 }}>
        {tabIndex === 0 && <SellGroceries />}
        {tabIndex === 1 && (
          <Typography variant="body1">
            <BuyGroceries />
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default GroceryMarketplace;