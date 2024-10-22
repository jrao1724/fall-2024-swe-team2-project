import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Chip, Grid2, Paper } from '@mui/material';
import '@fontsource/dancing-script';
import '@fontsource/poppins';

const ViewRecipe = () => {
  // Sample data
  const ingredients = [
    '100 ml milk',
    '50 g butter',
    '3 eggs',
    '1 tbs cocoa',
    '2 tsp baking soda',
    'a pinch of salt',
  ];

  const restrictions = ['eggetarian', 'low fat', 'contains dairy'];
  
  const directions = `Preheat your oven to 180°C (350°F) and line a muffin tin with cupcake liners. In a bowl, mix sugar, flour, cocoa powder, baking powder, baking soda, and a pinch of salt. Add 1 egg, 50ml of milk, 50ml of vegetable oil, and 1/2 tsp of vanilla extract. Beat until smooth. Bake for 15-18 minutes, or until a toothpick inserted into the center comes out clean. Let the cupcakes cool in the pan for a few minutes before transferring to a wire rack to cool completely.`;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#292828', 
        minHeight: '100vh',
        padding: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '90%',
          maxWidth: '900px',
          border: '2px solid grey', 
          borderRadius: '8px',
          backgroundColor: '#fff',
        }}
      >
        {/* Image and Overlapping Title */}
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="300"
            image={process.env.PUBLIC_URL + '/swepicstock.png'}
            alt="Recipe Image"
          />
          <Card
            sx={{
              position: 'absolute',
              bottom: -50, // Overlapping the image
              left: '50%',
              transform: 'translateX(-50%)',
              width: '80%',
              borderRadius: 2,
              boxShadow: 3,
              textAlign: 'center',
              backgroundColor: '#fff',
              padding: 2,
            }}
          >
            <Typography variant="h4" component="div" fontWeight="bold" style={{ fontFamily: 'Dancing Script' }}>
              Chocolate Cupcake
            </Typography>
          </Card>
        </Box>

        {/* Recipe Details */}
        <CardContent sx={{ marginTop: 8 }}>
          {/* Servings and Time */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              marginBottom: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="body1">
              <strong>Servings:</strong> 2
            </Typography>
            <Typography variant="body1">
              <strong>Time to Completion:</strong> 45 min
            </Typography>
          </Box>

          {/* Ingredients and Directions Section */}
          <Grid2 container spacing={3} sx={{ marginBottom: 4 }}>
            {/* Ingredients */}
            <Grid2 item xs={12} md={6}>
              <Box
                sx={{
                  border: '1px solid grey',
                  borderRadius: 2,
                  padding: 2,
                  backgroundColor: '#f9f9f9',
                }}
              >
                <Typography variant="h6" gutterBottom style={{ fontFamily: 'Poppins' }}>
                  Ingredients
                </Typography>
                {ingredients.map((ingredient, index) => (
                  <Chip
                    color='secondary'
                    key={index}
                    label={ingredient}
                    variant="outlined"
                    sx={{ margin: 0.5 }}
                  />
                ))}
              </Box>
            </Grid2>

            {/* Directions as a Paragraph */}
            <Grid2 item xs={12} md={6}>
              <Box
                sx={{
                  border: '1px solid grey',
                  borderRadius: 2,
                  padding: 2,
                  backgroundColor: '#f9f9f9',
                  textAlign: 'center', // Center-align the paragraph
                }}
              >
                <Typography variant="h6" gutterBottom style={{ fontFamily: 'Poppins' }}>
                  Directions
                </Typography>
                <Typography variant="body1" sx={{ textAlign: 'center', padding: '10px' }}>
                  {directions}
                </Typography>
              </Box>
            </Grid2>
          </Grid2>

          {/* Restriction & Dietary Info */}
          <Box
            sx={{
              border: '1px solid grey',
              borderRadius: 2,
              padding: 2,
              backgroundColor: '#f9f9f9',
              textAlign: 'left',
            }}
          >
            <Typography variant="h6" gutterBottom style={{ fontFamily: 'Poppins' }}>
              Restriction & Dietary Info
            </Typography>
            {restrictions.map((restriction, index) => (
                  <Chip
                    color='secondary'
                    key={index}
                    label={restriction}
                    variant="outlined"
                    sx={{ margin: 0.5 }}
                  />
                ))}
          </Box>
        </CardContent>
      </Paper>
    </Box>
  );
};

export default ViewRecipe;
