import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Fab,
  Rating,
  Button,
  IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; 
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../constants';
import { refreshAccessToken } from '../apiRefresh';

const Recipes = () => {
  const navigate = useNavigate();
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [madeRecipes, setMadeRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const makeRequest = async (url, token) => {
          const response = await fetch(`${API_BASE_URL}${url}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          return response;
        };

        let accessToken = localStorage.getItem('accessToken') || await refreshAccessToken();

        let savedResponse = await makeRequest('/apis/rest/recipes/saved_recipes', accessToken);
        if (savedResponse.status === 401) {
          accessToken = await refreshAccessToken();
          savedResponse = await makeRequest('/apis/rest/recipes/saved_recipes', accessToken);
        }
        const savedData = await savedResponse.json();

        let madeResponse = await makeRequest('/apis/rest/recipes/my_recipes', accessToken);
        if (madeResponse.status === 401) {
          accessToken = await refreshAccessToken();
          madeResponse = await makeRequest('/apis/rest/recipes/my_recipes', accessToken);
        }
        const madeData = await madeResponse.json();
        console.log(savedData)
        console.log(madeData)
        setSavedRecipes(savedData);
        setMadeRecipes(madeData);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  const handleAddEditRecipe = () => {
    navigate('/add_edit_recipe'); 
  };

  const handleViewRecipe = (recipeId) => {
    navigate(`/view_recipe/${recipeId}`);
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const makeDeleteRequest = async (token) => {
        const response = await fetch(`${API_BASE_URL}/apis/rest/recipes/delete/${recipeId}/`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response;
      };

      let accessToken = localStorage.getItem('accessToken') || await refreshAccessToken();
      let response = await makeDeleteRequest(accessToken);

      if (response.status === 401) {
        accessToken = await refreshAccessToken();
        response = await makeDeleteRequest(accessToken);
      }

      if (response.ok) {
        console.log(`Recipe ${recipeId} deleted successfully.`);
        setMadeRecipes((prev) => prev.filter((recipe) => recipe.recipe_id !== recipeId));
      } else {
        console.error('Failed to delete recipe');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };


  return (
    <Container>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Paper elevation={3} style={{ padding: '20px', flex: 1, maxHeight: '400px', overflowY: 'auto' }}>
          <Typography variant="h6" align="center" gutterBottom fontWeight="bold">
            Recipes You Saved
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Difficulty</TableCell>
                  <TableCell>Your Rating</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {savedRecipes.map((recipe) => (
                  <TableRow key={recipe.recipe_id} style={{ height: '60px' }}>
                    <TableCell>{recipe.recipe_name}</TableCell>
                    <TableCell>{recipe.difficulty_level}</TableCell>
                    <TableCell><Rating value={recipe.user_rating} size="small" precision={0.5} readOnly /></TableCell>
                    <TableCell>{`${recipe.quickness} ${recipe.time_unit}`}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        style={{
                          color: '#ffb74d',
                          borderColor: '#ffb74d',
                          padding: '4px 12px'
                        }}
                        onClick={() => handleViewRecipe(recipe.recipe_id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Paper elevation={3} style={{ padding: '20px', flex: 1, maxHeight: '400px', overflowY: 'auto' }}>
          <Typography variant="h6" align="center" gutterBottom fontWeight="bold">
            Recipes You Made
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Difficulty</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {madeRecipes.map((recipe) => (
                  <TableRow key={recipe.recipe_id} style={{ height: '60px' }}>
                    <TableCell>{recipe.recipe_name}</TableCell>
                    <TableCell>{recipe.difficulty_level}</TableCell>
                    <TableCell><Rating value={recipe.average_rating} size="small" precision={0.5} readOnly /></TableCell>
                    <TableCell>{`${recipe.quickness} ${recipe.time_unit}`}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        style={{
                          color: '#ffb74d',
                          borderColor: '#ffb74d',
                          padding: '4px 12px'
                        }}
                        onClick={() => handleViewRecipe(recipe.recipe_id)}
                      >
                        View
                      </Button>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteRecipe(recipe.recipe_id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Fab
              variant="contained"
              size="small"
              color="primary"
              style={{ backgroundColor: '#ffb74d', color: 'white' }}
              onClick={handleAddEditRecipe}
            >
              <AddIcon />
            </Fab>
          </div>
        </Paper>
      </div>
    </Container>
  );
};

export default Recipes;
