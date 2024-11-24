import React, { useState } from 'react';
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  Card,
  MenuItem,
  Chip,
  FormControlLabel,
  CardContent,
  Typography,
  Divider,
  Checkbox,
  Tooltip,
  IconButton,
  Snackbar,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const GroceryMarketplace = () => {
  const [ingredient, setIngredient] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [viewOption, setViewOption] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarOpen1, setSnackbarOpen1] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const ingred = ["Tomatoes", "Potatoes", "Onions", "Carrots", "Lettuce"];

  const [ingredients, setIngredients] = useState([]);
  const [amount, setAmount] = useState('');
  const [unit, setUnit] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isPriceNegotiable, setIsPriceNegotiable] = useState(false);
  const [newPost, setNewPost] = useState(null);

  const steps = ['Add Ingredient', 'Set Location', 'Set Price', 'Contact Info'];

  const handleBuyClick = () => setViewOption("buy");
  const handleSellClick = () => setViewOption("sell");

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Dummy data for multiple posts
  const posts = [
    {
      postId: "#01bcd",
      items: [{ name: "Tomatoes", quantity: "5 pcs" }, { name: "Potatoes", quantity: "4 pcs" }],
      price: "6",
      priceNegotiable: true,
      location: "42 St, Brooklyn",
      dateCreated: "October 15, 2024",
      posterName: "John Smith",
      phoneNumber: "123-456-7890",
    },
    {
      postId: "#02efg",
      items: [{ name: "Carrots", quantity: "3 pcs" }, { name: "Tomatoes", quantity: "2 pcs" }],
      price: "7",
      priceNegotiable: false,
      location: "8th Ave, Manhattan",
      dateCreated: "October 16, 2024",
      posterName: "Jane Doe",
      phoneNumber: "098-765-4321",
    },
    {
      postId: "#03hij",
      items: [{ name: "Lettuce", quantity: "1 head" }, { name: "Tomatoes", quantity: "6 pcs" }],
      price: "12",
      priceNegotiable: true,
      location: "5th Ave, Queens",
      dateCreated: "October 17, 2024",
      posterName: "Alice Brown",
      phoneNumber: "234-567-8901",
    },
  ];

  const copyPhoneNumber = (phoneNumber) => {
    navigator.clipboard.writeText(phoneNumber);
    setSnackbarOpen(true);
  };

  const handlePost = () => {
    const newPostData = {
      postId: `#${Math.random().toString(36).substr(2, 5)}`,
      items: ingredients.map((ing) => ({
        name: `${ing.ingredient}`,
        quantity: `${ing.amount} ${ing.unit}`,
      })),
      price,
      priceNegotiable: isPriceNegotiable,
      location,
      dateCreated: new Date().toLocaleDateString(),
      posterName: "Joe Johnson",
      phoneNumber: "123-456-7890",
    };

    setNewPost(newPostData);
    setSnackbarOpen1(true)
    setIngredients([]);
    setLocation('');
    setPrice('');
    setContactInfo('');
    setIsPriceNegotiable(false);
    setActiveStep(0);
    
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
      <Autocomplete
        options={ingred}
        value={ingredient}
        onChange={(event, newValue) => {
          setIngredient(newValue);
          setShowOptions(true);
        }}
        renderInput={(params) => <TextField {...params} label="Enter Ingredient Name" variant="outlined" />}
        style={{ width: "300px", marginBottom: "20px" }}
      />

      {showOptions && (
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <Button variant="contained" color="primary" onClick={handleBuyClick}>Buy</Button>
          <Button variant="contained" color="secondary" onClick={handleSellClick}>Sell</Button>
        </div>
      )}

            
      {viewOption === "buy" && (
        <div style={{ display: "flex", gap: "20px", marginTop: "20px", overflowX: "auto", padding: "10px" }}>
          {posts.map((post, index) => (
            <Card key={index} variant="outlined" style={{ width: "350px", padding: "10px" }}>
              <CardContent>
                <Typography variant="h6" color="secondary">{post.postId}</Typography>
                <Typography variant="h5" component="div" style={{ margin: "10px 0" }}>
                  {post.items.map((item, idx) => (
                    <div key={idx}>{item.name} - {item.quantity}</div>
                  ))}
                </Typography>

                <Divider style={{ margin: "10px 0" }} />

                <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                  <Typography variant="h6" style={{ marginRight: "8px" }}>
                    ${post.price}
                  </Typography>
                  <Checkbox checked={post.priceNegotiable} disabled />
                  <Typography variant="body2">Price Negotiable?</Typography>
                </div>

                <Typography variant="body2" color="textSecondary">{post.location}</Typography>
                <Typography variant="body2" color="textSecondary">Posted on {post.dateCreated}</Typography>
                
                <Divider style={{ margin: "10px 0" }} />

                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body1" style={{ marginRight: "5px" }}>{post.posterName}</Typography>
                  <Tooltip title={post.phoneNumber}>
                    <IconButton>
                      <CallIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copy">
                    <IconButton onClick={() => copyPhoneNumber(post.phoneNumber)}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {viewOption === "sell" && (
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <Stepper activeStep={activeStep} alternativeLabel style={{ marginBottom: "20px" }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <>
             <Box display="flex" justifyContent="space-between" alignItems="center">
              <TextField
                label="Amount"
                variant="outlined"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ marginBottom: "10px", width: '50%' }}
                fullWidth
              />
              <TextField
                select
                label="Unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                variant="outlined"
                style={{ marginBottom: "10px", width: "40%" }}
              >
                {['g', 'kg', 'ml', 'ltr', 'tsp', 'tbsp', 'pcs', 'lbs', 'oz'].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
             </Box>

              <Button
                variant="contained"
                color="secondary"
                style={{padding: "10px"}}
                onClick={() => {
                  if (amount && unit) {
                    setIngredients([...ingredients, { ingredient, amount, unit }]);
                    setAmount('');
                    setUnit('');
                  }
                }}
              >
                Add Ingredient
              </Button>

              <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
                {ingredients.map((ing, idx) => (
                  <Chip
                    key={idx}
                    label={`${ing.ingredient} ${ing.amount} ${ing.unit}`}
                    onDelete={() => setIngredients(ingredients.filter((_, i) => i !== idx))}
                    style={{ margin: "5px" }}
                  />
                ))}
              </div>
            </>
          )}

          {activeStep === 1 && (
            <TextField
              label="Location"
              variant="outlined"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
              style={{ marginBottom: "20px" }}
            />
          )}

          {activeStep === 2 && (
            <>
              <TextField
                label="Price"
                variant="outlined"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
                style={{ marginBottom: "10px" }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isPriceNegotiable}
                    onChange={(e) => setIsPriceNegotiable(e.target.checked)}
                  />
                }
                label="Is Price Negotiable?"
              />
            </>
          )}

          {activeStep === 3 && (
            <TextField
              label="Contact Info"
              variant="outlined"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              fullWidth
              style={{ marginBottom: "10px" }}
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" color="primary" onClick={handlePost}>
                Post
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </div>
      )}

      {viewOption === "sell" && newPost && (
        <Card variant="outlined" style={{ width: "350px", padding: "10px", marginTop: "20px" }}>
          <CardContent>
            <Typography variant="h6" color="secondary">{newPost.postId}</Typography>
            <Typography variant="h5" component="div" style={{ margin: "10px 0" }}>
              {newPost.items.map((item, idx) => (
                <div key={idx}>{item.name} - {item.quantity}</div>
              ))}
            </Typography>

            <Divider style={{ margin: "10px 0" }} />

            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <Typography variant="h6" style={{ marginRight: "8px" }}>
                ${newPost.price}
              </Typography>
              <Checkbox checked={newPost.priceNegotiable} disabled />
              <Typography variant="body2">Price Negotiable?</Typography>
            </div>

            <Typography variant="body2" color="textSecondary">{newPost.location}</Typography>
            <Typography variant="body2" color="textSecondary">Posted on {newPost.dateCreated}</Typography>

            <Divider style={{ margin: "10px 0" }} />

            <Typography variant="body1" style={{ marginRight: "5px" }}>{newPost.posterName}</Typography>
            <Typography variant="body1" style={{ marginRight: "5px" }}>{newPost.phoneNumber}</Typography>
          </CardContent>
        </Card>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Phone number copied to clipboard"
      />

      <Snackbar
        open={snackbarOpen1}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen1(false)}
        message="Sell Request Posted"
      />

    </div>
  );
};

export default GroceryMarketplace;