import React, { useState } from 'react';
import {
  Container,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  Checkbox,
  FormControlLabel,
  Box,
  Button,
  Modal,
  Typography,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import { useNavigate } from 'react-router-dom';
import ingredientData from '../ingredients.json'
import API_BASE_URL from '../constants';
import { refreshAccessToken } from '../apiRefresh';

const AddEditRecipe = () => {
  // Stepper state
  const [activeStep, setActiveStep] = useState(0);
  
  // Form states
  const [dishName, setDishName] = useState('');
  const [time, setTime] = useState('');
  const [timeUnit, setTimeUnit] = useState('mins');
  const [ingredients, setIngredients] = useState([]);
  const [inputIngredient, setInputIngredient] = useState('');
  const [inputAmount, setInputAmount] = useState('');
  const [inputUnit, setInputUnit] = useState('g');
  const [restrictions, setRestrictions] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [difficulty, setDifficulty] = useState('');
  const [allergens, setAllergens] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  
  // Stepper labels
  const steps = [
    'Name Dish',
    'Select Time',
    'Choose ingredients',
    'Select Restrictions',
    'Fill out instructions',
    'Upload Image',
    'Add/Edit Recipe'
  ];

  //ingredients to be shown
  const ingredientArray = Object.values(ingredientData);

  const [dishNameError, setDishNameError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [ingredientAmountError, setIngredientAmountError] = useState(false);
  //const [restrictionError, setRestrictionError] = useState(false);
  const [instructionsError, setInstructionsError] = useState(false);

  // Handle image file input change
  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files[0])
      setUploadedImage(event.target.files[0]); 
    }
  };

  // Handle step navigation
  const handleNext = () => {
    // Reset error states
    setDishNameError(false);
    setTimeError(false);
    setIngredientAmountError(false);
    setInstructionsError(false);

    // Validation based on the current step
    if (activeStep === 0 && !dishName) {
        setDishNameError(true);
        return;
    }
    if (activeStep === 1 && (!time || !timeUnit)) {
        setTimeError(true);
        return;
    }
    if (activeStep === 2 && (inputAmount === '' || !inputUnit)) {
        setIngredientAmountError(true);
        return;
    }
    if (activeStep === 4 && !instructions) {
        setInstructionsError(true);
        return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Ingredient chips management
  const addIngredient = () => {
    if (inputIngredient && inputAmount && inputUnit) {
      const newIngredient = `${inputIngredient} (${inputAmount}${inputUnit})`;
      setIngredients([...ingredients, newIngredient]);
      setInputIngredient('');
      setInputAmount('0');
      setInputUnit('g');
    }
  };

  const deleteIngredient = (ingredientToDelete) => {
    setIngredients(ingredients.filter((ingredient) => ingredient !== ingredientToDelete));
  };

  // Restriction selection management
  const restrictionsList = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Halal', 'Kosher', 'Pescatarian'];
  const handleRestrictionChange = (event) => {
    const selectedRestriction = event.target.name;
    setRestrictions((prevRestrictions) => 
      prevRestrictions.includes(selectedRestriction) 
        ? prevRestrictions.filter((item) => item !== selectedRestriction) 
        : [...prevRestrictions, selectedRestriction]
    );
  };

  // Allergen selection management
  const allergenOptions =  ['Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Fish', 'Shellfish', 'Soy', 'Wheat', 'Sesame'];
  const handleAllergenChange = (event) => {
    const selectedAllergen = event.target.name;
    setAllergens((prevAllergens) =>
      prevAllergens.includes(selectedAllergen)
        ? prevAllergens.filter((item) => item !== selectedAllergen)
        : [...prevAllergens, selectedAllergen]
    );
  };

  console.log(ingredients)
  const navigate = useNavigate();

  const ingredientsString = ingredients.join(', ');
  console.log(ingredientsString)
  console.log(restrictions)
  console.log(allergens)

  const handleSubmit = async () => { 
     try{
      // const formData = new FormData();
      // formData.append(
      //   "recipe_data",
      //   JSON.stringify({
      //     recipe_name: dishName,
      //     difficulty_level: difficulty,
      //     quickness: time,
      //     time_unit: timeUnit,
      //     ingredients: ingredientsString,
      //     restrictions: restrictions,
      //     allergens: allergens,
      //     description: instructions,
      //     rating: 0.0,
      //     nutrition: {},
      //   })
      // );

      // if (uploadedImage) {
      //   formData.append("image", uploadedImage);
      // } else {
      //   console.error("No image uploaded!");
      //   return;
      // }

      // for (let pair of formData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }

      const recipeData = {
            recipe_name: dishName,
            difficulty_level: difficulty.toLowerCase(),
            quickness: parseInt(time),
            time_unit: timeUnit,
            ingredients: ingredientsString,
            restrictions: restrictions,
            allergens: allergens,
            description: instructions,
            nutrition: {"calories":0, "protein":0},
          };
      console.log('Sending Recipe Data:', JSON.stringify(recipeData));

      const makeRequest = async (token) => {
        const response = await fetch(`${API_BASE_URL}/apis/rest/recipes/addRecipe/`,{
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(recipeData),
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
        console.log("Recipe added successfully", data);
        navigate('/home');
        console.log("Recipe added successfully with ID:", data.recipe_id);
        alert("Recipe added successfully!");
      } else {
        console.error("Error adding recipe:", data.message);
      }
     }catch (error){
      console.error("An unexpected error occurred:", error);
      alert("An unexpected error occurred. Please try again.");
     }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '40px' }}> {/* Adjusting top margin */}
      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Box mt={4}>
        {/* Step 1: Name Dish */}
        {activeStep === 0 && (
          <Box>
            <TextField
              label="Name Your Dish"
              fullWidth
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              margin="normal"
              error={dishNameError}
              helperText={dishNameError ? 'Dish name is required' : ''}
            />
            <Box mt={2}>
              <Button variant="contained" style={{ backgroundColor: '#ffb74d' }} onClick={handleNext}>Save</Button>
              {activeStep > 0 && <Button onClick={handleBack} style={{ marginLeft: '10px' }}>Back</Button>}
            </Box>
          </Box>
        )}

        {/* Step 2: Select Time and Difficulty*/}
        {activeStep === 1 && (
          <Box>
            <TextField
              label="Enter Time Required to Prepare Meal"
              type="number" // Input restricted to numbers
              fullWidth
              value={time}
              onChange={(e) => setTime(e.target.value)}
              margin="normal"
              error={timeError}
              helperText={timeError ? 'Time is required' : ''}
            />
            <Select
              value={timeUnit}
              onChange={(e) => setTimeUnit(e.target.value)}
              fullWidth
            >
              <MenuItem value="mins">mins</MenuItem>
              <MenuItem value="hrs">hrs</MenuItem>
            </Select>
            <Box mt={3}>
              <Typography variant="subtitle1">Select Difficulty</Typography>
              <Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                fullWidth
                displayEmpty
                style={{ marginTop: '10px' }}
              >
                <MenuItem value="" disabled>
                  Choose Difficulty
                </MenuItem>
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </Box>
            <Box mt={2}>
              <Button variant="contained" style={{ backgroundColor: '#ffb74d' }} onClick={handleNext}>Save</Button>
              {activeStep > 0 && <Button onClick={handleBack} style={{ marginLeft: '10px' }}>Back</Button>}
            </Box>
          </Box>
        )}

        {/* Step 3: Choose Ingredients */}
        {activeStep === 2 && (
          <Box>
            <Autocomplete
              freeSolo
              options={ingredientArray} // Example options
              value={inputIngredient}
              onChange={(event, newValue) => setInputIngredient(newValue)}
              renderInput={(params) => <TextField {...params} label="Select Ingredient" margin="normal" />}
            />
            <Box display="flex" justifyContent="space-between" alignItems="center"> {/* Align amount and unit */}
              <TextField
                label="Amount"
                type="number" // Input restricted to numbers
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                margin="normal"
                style={{ width: '50%' }}
                error={ingredientAmountError}
                helperText={ingredientAmountError ? 'Amount is required' : ''}
              />
              <Select
                value={inputUnit}
                onChange={(e) => setInputUnit(e.target.value)}
                margin="normal"
                style={{ width: '40%' }}
              >
                <MenuItem value="g">g</MenuItem>
                <MenuItem value="kg">kg</MenuItem>
                <MenuItem value="ml">ml</MenuItem>
                <MenuItem value="ltr">ltr</MenuItem>
                <MenuItem value="tsp">tsp</MenuItem> 
                <MenuItem value="tbsp">tbsp</MenuItem>
                <MenuItem value="pcs">pcs</MenuItem>
              </Select>
            </Box>
            <Button onClick={addIngredient} style={{ backgroundColor: '#ffb74d', marginTop: '10px' }}>Add Ingredient</Button>
            
            <Box mt={2}>
              {ingredients.map((ingredient, index) => (
                <Chip
                  key={index}
                  label={ingredient}
                  onDelete={() => deleteIngredient(ingredient)}
                  style={{ marginRight: 4, marginBottom: 4 }}
                />
              ))}
            </Box>
            <Box mt={2}>
              <Button variant="contained" style={{ backgroundColor: '#ffb74d' }} onClick={handleNext}>Save</Button>
              {activeStep > 0 && <Button onClick={handleBack} style={{ marginLeft: '10px' }}>Back</Button>}
            </Box>
          </Box>
        )}

        {/* Step 4: Select Restrictions and Allergens*/}
        {activeStep === 3 && (
          <Box>
            {restrictionsList.map((restriction) => (
              <FormControlLabel
                key={restriction}
                control={
                  <Checkbox
                    checked={restrictions.includes(restriction)}
                    onChange={handleRestrictionChange}
                    name={restriction}
                  />
                }
                label={restriction}
              />
            ))}
            <Box mt={3}>
              <Typography variant="subtitle1">Select Allergen(s)</Typography>
              {allergenOptions.map((allergen) => (
                <FormControlLabel
                  key={allergen}
                  control={
                    <Checkbox
                      checked={allergens.includes(allergen)}
                      onChange={handleAllergenChange}
                      name={allergen}
                    />
                  }
                  label={allergen}
                />
              ))}
            </Box>
            <Box mt={2}>
              <Button variant="contained" style={{ backgroundColor: '#ffb74d' }} onClick={handleNext}>Save</Button>
              {activeStep > 0 && <Button onClick={handleBack} style={{ marginLeft: '10px' }}>Back</Button>}
            </Box>
          </Box>
        )}

        {/* Step 5: Fill Instructions */}
        {activeStep === 4 && (
          <Box>
            <TextField
              label="Fill Instructions"
              fullWidth
              multiline
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              margin="normal"
              error={instructionsError}
              helperText={instructionsError ? 'Instructions are required' : ''}
            />
            <Box mt={2}>
              <Button variant="contained" style={{ backgroundColor: '#ffb74d' }} onClick={handleNext}>Save</Button>
              {activeStep > 0 && <Button onClick={handleBack} style={{ marginLeft: '10px' }}>Back</Button>}
            </Box>
          </Box>
        )}

        {/* Step 6: Upload Image */}
        {activeStep === 5 && (
          <Box>
            <Button variant="contained" style={{ backgroundColor: '#ffb74d' }} startIcon={<UploadIcon />} onClick={() => setImageModalOpen(true)}>
              Upload Image
            </Button>
            <Modal open={imageModalOpen} onClose={() => setImageModalOpen(false)}>
              <Box
                position="absolute"
                top="25%"
                left="35%"
                transform="translate(-50%, -50%)"
                width={400}
                bgcolor="white"
                p={4}
                borderRadius="8px"
                boxShadow={24}
              >
                <Typography align="center" variant="h6">Upload an image from your local machine.</Typography>
                <Box mt={3} display="flex" justifyContent="center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Box>
                {uploadedImage && (
                  <Typography mt={2} align="center">
                    File Selected: {uploadedImage.name}
                  </Typography>
                )}
              </Box>
            </Modal>
            <Box mt={2}>
              <Button variant="contained" style={{ backgroundColor: '#ffb74d' }} onClick={handleNext}>Save</Button>
              {activeStep > 0 && <Button onClick={handleBack} style={{ marginLeft: '10px' }}>Back</Button>}
            </Box>
          </Box>
        )}
        
        {/* Step 7: Add/Edit Recipe */}
        {activeStep === 6 && (
          <Box>
            <Typography variant="h6">Review and Add/Edit Recipe</Typography>
            {/* Display summary of the recipe here */}
            <Box mt={2}>
              <Button variant="contained" style={{ backgroundColor: '#ffb74d' }} onClick={handleSubmit}>Submit</Button>
              {activeStep > 0 && <Button onClick={handleBack} style={{ marginLeft: '10px' }}>Back</Button>}
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default AddEditRecipe;
