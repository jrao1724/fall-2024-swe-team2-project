import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Chip, Stack, Paper, Rating, Button, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import API_BASE_URL from '../constants';
import { refreshAccessToken } from '../apiRefresh';
import '@fontsource/dancing-script';
import '@fontsource/poppins';

const ViewRecipe = () => {
  
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    if (isSaved) return; // Prevent multiple saves
  
    try {
      const makeRequest = async (token) => {
        const response = await fetch(`${API_BASE_URL}/apis/rest/recipes/saveRecipe/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ recipe_id: recipeId }),
        });
        return response;
      };
  
      let accessToken = localStorage.getItem('accessToken') || (await refreshAccessToken());
      let response = await makeRequest(accessToken);
  
      if (response.status === 401) {
        accessToken = await refreshAccessToken();
        response = await makeRequest(accessToken);
      }
  
      if (response.ok) {
        setIsSaved(true); // Update state to reflect the recipe has been saved
      } else {
        console.error('Failed to save the recipe.');
      }
    } catch (error) {
      console.error('An unexpected error occurred while saving the recipe:', error);
    }
  };
  
  console.log(recipeId);
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const makeRequest = async (token) => {
          const response = await fetch(`${API_BASE_URL}/apis/rest/recipes/recipeInfo/${recipeId}/`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          return response;
        };

        let accessToken = localStorage.getItem('accessToken') || (await refreshAccessToken());
        let response = await makeRequest(accessToken);

        if (response.status === 401) {
          accessToken = await refreshAccessToken();
          response = await makeRequest(accessToken);
        }

        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setRecipe(data);
          setRating(data.user_rating || 0); // Assuming backend includes rating
        } else {
          setError('Failed to fetch recipe details.');
        }
      } catch (err) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  useEffect(() => {
    const rateRecipe = async () => {
      try{
        if (!rating || !recipeId) return; // Skip if rating is not set yet
        const makeRequest = async (token) => {
          const response = await fetch(`${API_BASE_URL}/apis/rest/recipes/rateRecipe/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ recipe_id: recipeId, rating: rating }),
          });
          return response;
        };
        let accessToken = localStorage.getItem('accessToken') || (await refreshAccessToken());
        let response = await makeRequest(accessToken);

        if (response.status === 401) {
          accessToken = await refreshAccessToken();
          response = await makeRequest(accessToken);
        }

        if (!response.ok) {
          console.error('Failed to rate the recipe.');
        }

      } catch (error) {
        console.error('An unexpected error occurred while rating the recipe:', error);
      }
    };

    rateRecipe();
  }, [rating, recipeId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: 'center', padding: 4 }}>
        {error}
      </Typography>
    );
  }

  if (!recipe) {
    return (
      <Typography sx={{ textAlign: 'center', padding: 4 }}>
        No recipe found.
      </Typography>
    );
  }

  const { recipe_name, difficulty_level, quickness, time_unit, description} = recipe;
  const ingredients = recipe.ingredients ? recipe.ingredients.split(",").map((item) => item.trim()) : [];
  const restrictions = recipe.restrictions_display || [];
  const allergens = recipe.allergens_display || [];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 4,
        backgroundImage: 'url(/background.jpg)',
        backgroundSize: 'cover',
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
            image={process.env.PUBLIC_URL + '/swepicstock.png'} //this will accept recipe.image when api returns image
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
              {recipe_name}
            </Typography>
          </Card>
        </Box>

        {/* Recipe Details */}
        <CardContent sx={{ marginTop: 8 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              marginBottom: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="body1">
              <strong>Difficulty:</strong> {difficulty_level}
            </Typography>
            <Typography variant="body1">
              <strong>Time to Completion:</strong> {quickness} {time_unit}
            </Typography>
          </Box> 
          <Stack spacing={2}>
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
                {description}
              </Typography>
            </Box>
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
                Restriction & Allergens
              </Typography>
              {restrictions && 
                restrictions.map((restriction, index) => (
                    <Chip
                      color='secondary'
                      key={index}
                      label={restriction}
                      variant="outlined"
                      sx={{ margin: 0.5 }}
                    />
                  ))}
              {allergens && 
                allergens.map((restriction, index) => (
                    <Chip
                      color='secondary'
                      key={index}
                      label={restriction}
                      variant="outlined"
                      sx={{ margin: 0.5 }}
                    />
                  ))}
            </Box>  
          </Stack>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: 2,
            }}
          >
            <Typography variant="h6" gutterBottom style={{ fontFamily: 'Poppins' }}>Rate This Recipe</Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              precision={1}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSave}
              disabled={isSaved}
            >
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </Box>
          
        </CardContent>
      </Paper>
    </Box>
  );
};

export default ViewRecipe;
