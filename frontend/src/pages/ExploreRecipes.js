import React, { useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Paper, Table, TableHead, TableRow, TableCell, TableBody, Rating, Grid2 } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import API_BASE_URL from '../constants';
import { refreshAccessToken } from '../apiRefresh';
import { useNavigate } from 'react-router-dom';

const restrictionsList = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Halal', 'Kosher', 'Pescatarian'];
const allergensList = ['Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Fish', 'Shellfish', 'Soy', 'Wheat', 'Sesame'];

export default function ExploreRecipes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestrictions, setSelectedRestrictions] = useState([]);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const navigate = useNavigate();

  const handleViewRecipe = (recipeId) => {
    console.log(recipeId)
    navigate(`/view_recipe/${recipeId}`);
  };

  console.log("Filtered Recipes:", filteredRecipes);

  const handleSearch = async () => {
    const recipeSearchData = {};
    if (searchQuery) recipeSearchData.search = searchQuery;
    if (selectedRestrictions.length) recipeSearchData.restrictions = selectedRestrictions;
    if (selectedAllergens.length) recipeSearchData.allergens = selectedAllergens;
    console.log('Sending Recipe Search Data', JSON.stringify(recipeSearchData));
    try{
        const makeRequest = async (token) => {
            const response = await fetch(`${API_BASE_URL}/apis/rest/recipes/filter/`,{
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify(recipeSearchData),
            });
            return response
          };
          let accessToken = localStorage.getItem('accessToken') || await refreshAccessToken();

          let response = await makeRequest(accessToken);
          if (response.status === 401) { 
            accessToken = await refreshAccessToken();
            response = await makeRequest(accessToken); 
          }

          const data=await response.json();
          if (response.ok){
            console.log("Recipe searched successfully", data);
            setFilteredRecipes(data);
          } else {
            console.error("Error searching recipe");
          }
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleCheckboxChange = (list, setList) => (event) => {
    const { name, checked } = event.target;
    setList((prev) => checked ? [...prev, name] : prev.filter((item) => item !== name));
  };

  return (
    <Grid2 container spacing={2} direction="column">
      <Grid2 item>
        <TextField
          label="Explore new recipes"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Grid2>
      <Grid2 item>
        <Grid2 container spacing={2}>
          <Grid2 item xs={6}>
            <h4>Restrictions</h4>
            {restrictionsList.map((restriction) => (
              <FormControlLabel
                key={restriction}
                control={
                  <Checkbox
                    name={restriction}
                    onChange={handleCheckboxChange(selectedRestrictions, setSelectedRestrictions)}
                  />
                }
                label={restriction}
              />
            ))}
          </Grid2>
          <Grid2 item xs={6}>
            <h4>Allergens</h4>
            {allergensList.map((allergen) => (
              <FormControlLabel
                key={allergen}
                control={
                  <Checkbox
                    name={allergen}
                    onChange={handleCheckboxChange(selectedAllergens, setSelectedAllergens)}
                  />
                }
                label={allergen}
              />
            ))}
          </Grid2>
        </Grid2>
      </Grid2>
      <Grid2 item>
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
          color='secondary'
        >
          Search
        </Button>
      </Grid2>

      {filteredRecipes.length > 0 && (
        <Grid2 item>
          <Paper elevation={3} style={{ padding: '16px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Difficulty</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRecipes.map((recipe) => (
                  <TableRow key={recipe.recipe_id}>
                    <TableCell>{recipe.recipe_name}</TableCell>
                    <TableCell>{recipe.difficulty_level}</TableCell>
                    <TableCell>
                      <Rating value={recipe.rating} precision={0.1} readOnly />
                    </TableCell>
                    <TableCell>{`${recipe.quickness} ${recipe.time_unit}`}</TableCell>
                    <TableCell>
                      <Button variant="outlined" sx={{ color: '#ffb74d', borderColor: '#ffb74d' }} onClick={() => handleViewRecipe(recipe.recipe_id)}>
                        View 
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid2>
      )}
    </Grid2>
  );
}
