import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Paper,
  Grid2,
  Accordion,
  Autocomplete,
  AccordionSummary,
  AccordionDetails,
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add'; 

const recipes = ['Pasta', 'Pizza', 'Salad', 'Soup', 'Curry'];

const recipesYouPrefer = [
  { name: 'Pasta', restriction: 'Vegetarian', rating: 4.5, time: '30 min' },
  { name: 'Pizza', restriction: 'Gluten-Free', rating: 4.7, time: '45 min' },
  { name: 'Salad', restriction: 'Vegan', rating: 4.3, time: '15 min' },
  { name: 'Soup', restriction: 'None', rating: 4.2, time: '25 min' },
  { name: 'Curry', restriction: 'Vegetarian', rating: 4.6, time: '50 min' },
  { name: 'Sushi', restriction: 'Seafood', rating: 4.8, time: '60 min' },
  { name: 'Tacos', restriction: 'None', rating: 4.4, time: '20 min' },
  { name: 'Burgers', restriction: 'Meat', rating: 4.6, time: '40 min' },
  { name: 'Pancakes', restriction: 'None', rating: 4.5, time: '20 min' },
  { name: 'Brownies', restriction: 'None', rating: 4.9, time: '30 min' },
];

const recipesYouMade = [
  { name: 'Omelette', restriction: 'None', rating: 4.5, time: '10 min' },
  { name: 'Grilled Cheese', restriction: 'None', rating: 4.7, time: '15 min' },
  { name: 'Spaghetti', restriction: 'None', rating: 4.3, time: '20 min' },
  { name: 'Chili', restriction: 'None', rating: 4.2, time: '30 min' },
  { name: 'Fried Rice', restriction: 'Vegetarian', rating: 4.6, time: '25 min' },
  { name: 'Quiche', restriction: 'Vegetarian', rating: 4.5, time: '50 min' },
  { name: 'Meatloaf', restriction: 'Meat', rating: 4.6, time: '60 min' },
  { name: 'Casserole', restriction: 'None', rating: 4.4, time: '40 min' },
  { name: 'Fruit Salad', restriction: 'Vegan', rating: 4.5, time: '15 min' },
  { name: 'Chocolate Cake', restriction: 'None', rating: 4.9, time: '30 min' },
];

const Recipes = () => {
  const [openSaved, setOpenSaved] = useState(false);
  const [openLiked, setOpenLiked] = useState(false);
  const [openMade, setOpenMade] = useState(false);

  const handleOpenSaved = () => setOpenSaved(true);
  const handleCloseSaved = () => setOpenSaved(false);

  const handleOpenLiked = () => setOpenLiked(true);
  const handleCloseLiked = () => setOpenLiked(false);

  const handleOpenMade = () => setOpenMade(true);
  const handleCloseMade = () => setOpenMade(false);

  return (
    <Container>
      <Autocomplete
          options={recipes}
          renderInput={(params) => (
            <TextField
              {...params}
              label="More delicious recipes incoming..."
              variant="outlined"
              margin="normal"
              fullWidth
            />
          )}
        />
      <Grid2 container spacing={4}>
      <Grid2 item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '20px', height: '100%' }}>
          <Typography variant="h6" align="center" gutterBottom fontWeight="bold">
            Recipes you prefer
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Saved Recipes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Restriction</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recipesYouPrefer.slice(0, 5).map((recipe, index) => (
                      <TableRow key={index}>
                        <TableCell>{recipe.name}</TableCell>
                        <TableCell>{recipe.restriction}</TableCell>
                        <TableCell>{recipe.rating}</TableCell>
                        <TableCell>{recipe.time}</TableCell>
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
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Liked Recipes</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Restriction</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recipesYouPrefer.slice(5).map((recipe, index) => (
                      <TableRow key={index}>
                        <TableCell>{recipe.name}</TableCell>
                        <TableCell>{recipe.restriction}</TableCell>
                        <TableCell>{recipe.rating}</TableCell>
                        <TableCell>{recipe.time}</TableCell>
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
                  onClick={handleOpenLiked}
                  sx={{
                    backgroundColor: '#ffb74d', 
                    color: 'white',
                  }}
                >
                  <ExpandMoreIcon />
                </Fab>
              </div>
            </AccordionDetails>
          </Accordion>
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
                    <TableCell>Restriction</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recipesYouPrefer.map((recipe, index) => (
                    <TableRow key={index}>
                      <TableCell>{recipe.name}</TableCell>
                      <TableCell>{recipe.restriction}</TableCell>
                      <TableCell>{recipe.rating}</TableCell>
                      <TableCell>{recipe.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Modal>

        {/* Modal for Liked Recipes */}
        <Modal open={openLiked} onClose={handleCloseLiked}>
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
              Liked Recipes
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Restriction</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recipesYouPrefer.map((recipe, index) => (
                    <TableRow key={index}>
                      <TableCell>{recipe.name}</TableCell>
                      <TableCell>{recipe.restriction}</TableCell>
                      <TableCell>{recipe.rating}</TableCell>
                      <TableCell>{recipe.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Modal>
      </Grid2>

      <Grid2 item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '20px', height: '100%' }}>
          <Typography variant="h6" align="center" gutterBottom fontWeight="bold">
            Recipes You Made
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Restriction</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Actions</TableCell> {/* New column for Actions */}
                </TableRow>
              </TableHead>
              <TableBody>
                {recipesYouMade.slice(0, 5).map((recipe, index) => (
                  <TableRow key={index}>
                    <TableCell>{recipe.name}</TableCell>
                    <TableCell>{recipe.restriction}</TableCell>
                    <TableCell>{recipe.rating}</TableCell>
                    <TableCell>{recipe.time}</TableCell>
                    <TableCell>
                      <Button variant="outlined" sx={{ color: '#ffb74d', borderColor: '#ffb74d' }}>
                        Edit
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
                      <TableCell>Restriction</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recipesYouMade.map((recipe, index) => (
                      <TableRow key={index}>
                        <TableCell>{recipe.name}</TableCell>
                        <TableCell>{recipe.restriction}</TableCell>
                        <TableCell>{recipe.rating}</TableCell>
                        <TableCell>{recipe.time}</TableCell>
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
