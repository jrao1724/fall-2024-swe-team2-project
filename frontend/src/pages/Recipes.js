import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid2,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Modal,
  Box,
  Fab,
  Rating
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add'; 
import { useNavigate } from 'react-router-dom';

const recipesYouPrefer = [
  { name: 'Pasta', difficulty: 'Easy', rating: 4.5, time: '30 min' },
  { name: 'Pizza', difficulty: 'Medium', rating: 4.7, time: '45 min' },
  { name: 'Salad', difficulty: 'Hard', rating: 4.3, time: '15 min' },
  { name: 'Soup', difficulty: 'Medium', rating: 4.2, time: '25 min' },
  { name: 'Curry', difficulty: 'Easy', rating: 4.6, time: '50 min' },
  { name: 'Sushi', difficulty: 'Medium', rating: 4.8, time: '60 min' },
  { name: 'Tacos', difficulty: 'Medium', rating: 4.4, time: '20 min' },
  { name: 'Burgers', difficulty: 'Hard', rating: 4.6, time: '40 min' },
  { name: 'Pancakes', difficulty: 'Easy', rating: 4.5, time: '20 min' },
  { name: 'Brownies', difficulty: 'Medium', rating: 4.9, time: '30 min' },
];

const recipesYouMade = [
  { name: 'Omelette', difficulty: 'Medium', rating: 4.5, time: '10 min' },
  { name: 'Grilled Cheese', difficulty: 'Medium', rating: 4.7, time: '15 min' },
  { name: 'Spaghetti', difficulty: 'Medium', rating: 4.3, time: '20 min' },
  { name: 'Chili', difficulty: 'Easy', rating: 4.2, time: '30 min' },
  { name: 'Fried Rice', difficulty: 'Medium', rating: 4.6, time: '25 min' },
  { name: 'Quiche', difficulty: 'Medium', rating: 4.5, time: '50 min' },
  { name: 'Meatloaf', difficulty: 'Medium', rating: 4.6, time: '60 min' },
  { name: 'Casserole', difficulty: 'Hard', rating: 4.4, time: '40 min' },
  { name: 'Fruit Salad', difficulty: 'Hard', rating: 4.5, time: '15 min' },
  { name: 'Chocolate Cake', difficulty: 'Easy', rating: 4.9, time: '30 min' },
];

const Recipes = () => {
  const [openSaved, setOpenSaved] = useState(false);
  const [openMade, setOpenMade] = useState(false);

  const handleOpenSaved = () => setOpenSaved(true);
  const handleCloseSaved = () => setOpenSaved(false);

  const handleOpenMade = () => setOpenMade(true);
  const handleCloseMade = () => setOpenMade(false);

  const navigate = useNavigate();

  const handleAddEditRecipe = () => {
    navigate('/add_edit_recipe'); 
  };

  const handleViewRecipe = () => {
    navigate('/view_recipe');
  };


  return (
    <Container>
      <Grid2 container spacing={2}>
      <Grid2 item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '20px', height: '100%' }}>
          <Typography variant="h6" align="center" gutterBottom fontWeight="bold">
            Recipes you saved
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
                {recipesYouPrefer.slice(0, 5).map((recipe, index) => (
                  <TableRow key={index}>
                    <TableCell>{recipe.name}</TableCell>
                    <TableCell>{recipe.difficulty}</TableCell>
                    <TableCell><Rating value={recipe.rating} size="small" precision={0.5} readOnly /></TableCell>
                    <TableCell>{recipe.time}</TableCell> 
                    <TableCell>
                      <Button variant="outlined" sx={{ color: '#ffb74d', borderColor: '#ffb74d' }} onClick={handleViewRecipe}>
                        View 
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Fab
              size="small"
              variant="contained"
              color="primary"
              onClick={handleOpenSaved}
              sx={{
                backgroundColor: '#ffb74d', 
                color: 'white',
              }}
            >
              <ExpandMoreIcon />
            </Fab>
          </div>
        </Paper>

        {/* Modal for Saved Recipes */}
        <Modal open={openSaved} onClose={handleCloseSaved}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 600,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              overflowY: 'scroll',
              maxHeight: '80vh',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Saved Recipes
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
                  {recipesYouPrefer.map((recipe, index) => (
                    <TableRow key={index}>
                      <TableCell>{recipe.name}</TableCell>
                      <TableCell>{recipe.difficulty}</TableCell>
                      <TableCell><Rating value={recipe.rating} size="small" precision={0.5} readOnly /></TableCell>
                      <TableCell>{recipe.time}</TableCell>
                      <TableCell>
                        <Button variant="outlined" sx={{ color: '#ffb74d', borderColor: '#ffb74d' }} onClick={handleViewRecipe}>
                          View
                        </Button>
                    </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Modal>
      </Grid2>

      <Grid2 item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '20px', height: '100%'}}>
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
                {recipesYouMade.slice(0, 5).map((recipe, index) => (
                  <TableRow key={index}>
                    <TableCell>{recipe.name}</TableCell>
                    <TableCell>{recipe.difficulty}</TableCell>
                    <TableCell><Rating value={recipe.rating} size="small" precision={0.5} readOnly /></TableCell>
                    <TableCell>{recipe.time}</TableCell>
                    <TableCell>
                      <Button variant="outlined" sx={{ color: '#ffb74d', borderColor: '#ffb74d' }} onClick={handleViewRecipe}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <Stack spacing={2}>
            <Fab
              variant="contained"
              size="small"
              color="primary"
              onClick={handleOpenMade}
              sx={{
                backgroundColor: '#ffb74d',
                color: 'white',
              }}
            >
              <ExpandMoreIcon />
            </Fab>
            <Fab
              variant="contained"
              size="small"
              color="primary"
              sx={{
                backgroundColor: '#ffb74d',
                color: 'white',
              }}
              onClick={handleAddEditRecipe}
            >
              <AddIcon />
            </Fab>
            </Stack>
          </div>

          {/* Modal for Recipes You Made */}
          <Modal open={openMade} onClose={handleCloseMade}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                overflowY: 'scroll',
                maxHeight: '80vh',
              }}
            >
              <Typography variant="h6" gutterBottom>
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
                    {recipesYouMade.map((recipe, index) => (
                      <TableRow key={index}>
                        <TableCell>{recipe.name}</TableCell>
                        <TableCell>{recipe.difficulty}</TableCell>
                        <TableCell><Rating value={recipe.rating} size="small" precision={0.5} readOnly /></TableCell>
                        <TableCell>{recipe.time}</TableCell>
                        <TableCell>
                          <Button variant="outlined" sx={{ color: '#ffb74d', borderColor: '#ffb74d' }} onClick={handleViewRecipe}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Modal>
        </Paper>
      </Grid2>
    </Grid2>
    </Container>
    
  );
};

export default Recipes;
