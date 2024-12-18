import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Checkbox,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
  Card,
  CardContent,
  Divider,
  Tooltip,
  IconButton,
  Grid2,
  CardActions,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import API_BASE_URL from '../constants';
import { refreshAccessToken } from '../apiRefresh';

const SellGroceries = () => {
  const [userMadePosts, setUserMadePosts] = useState([]);
  useEffect(()=>{
    const fetchSellPost = async () => {
      try{
        const makeRequest = async (token) => {
          const response = await fetch(`${API_BASE_URL}/apis/rest/marketplace/getPostsByUser/`,{
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`,
            },
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
          console.log("showing posts made by user", data)
          setUserMadePosts(data)
        } else {
          console.error("Error showing user made posts", data)
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        alert("An unexpected error occurred while trying to fetch user made posts. Please try again.");
      }

    };

    fetchSellPost();
  }, []);

  console.log(userMadePosts)
  const [activeStep, setActiveStep] = useState(0);
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postPrice, setPostPrice] = useState('');
  const [isPriceNegotiable, setIsPriceNegotiable] = useState(false);
  const [location, setLocation] = useState('');
  const [visibleFields, setVisibleFields] = useState([]);
  const [submittedPost, setSubmittedPost] = useState(null);

  const steps = [
    'Enter Post Title',
    'Enter Post Description',
    'Enter Post Price',
    'Enter Location',
    'Choose Means of Contact',
  ];

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleContactMethodChange = (method) => {
    setVisibleFields((prevFields) => {
      if (prevFields.includes(method)) {
        return prevFields.filter((field) => field !== method);
      } else {
        return [...prevFields, method];
      }
    });
    console.log(visibleFields)
  };

  const handleDeletePost = async (postId) => {
    try{
      const makeDeleteRequest = async (token) => {
        const response = await fetch(`${API_BASE_URL}/apis/rest/marketplace/${postId}/delete/`, {
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

      if (response.ok){
        console.log(`Post ${postId} deleted successfully.`)
        setUserMadePosts((prev) => prev.filter((post) => post.post_id !== postId))
      } else {
        console.error('Failed to delete post');
      }

    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleSubmit = async () => {
    try{

    const sellPostData = {
      post_title: postTitle,
      post_description: postDescription,
      post_price: parseFloat(postPrice),
      post_type: "selling",
      user_location: location,
      is_active: true,
      is_negotiable: isPriceNegotiable,
      visible_fields: visibleFields
    };

    const makeRequest = async (token) => {
      const response = await fetch(`${API_BASE_URL}/apis/rest/marketplace/addPost/`,{
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(sellPostData),
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
      console.log("Groceries to sell posted!", data)
      alert("Groceries to sell have been posted!")

      setSubmittedPost(data);

      setActiveStep(0);
      setPostTitle('');
      setPostDescription('');
      setPostPrice('');
      setIsPriceNegotiable(false);
      setLocation('');
      setVisibleFields([]);
    } else {
      console.error("Error posting groceries", data)
    }
    } catch (error){
      console.error("An unexpected error occurred:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const copyInfo = (info) => {
    navigator.clipboard.writeText(info);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}> 
          <Typography variant="h6" align="center" fontWeight="bold">
            Create a New Post
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <TextField
              label="Post Title"
              variant="outlined"
              fullWidth
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              style={{ margin: '20px 0' }}
            />
          )}

          {activeStep === 1 && (
            <TextField
              label="Post Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={postDescription}
              onChange={(e) => setPostDescription(e.target.value)}
              style={{ margin: '20px 0' }}
            />
          )}

          {activeStep === 2 && (
            <div style={{ margin: '20px 0' }}>
              <TextField
                label="Post Price"
                variant="outlined"
                type="number"
                fullWidth
                value={postPrice}
                onChange={(e) => {
                  //if (/^\d*$/.test(e.target.value)) setPostPrice(e.target.value);
                  setPostPrice(e.target.value)
                }}
                InputProps={{ startAdornment: <Typography>$</Typography> }}
                style={{ marginBottom: '10px' }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isPriceNegotiable}
                    onChange={(e) => setIsPriceNegotiable(e.target.checked)}
                    color="secondary"
                  />
                }
                label="Is Price Negotiable?"
              />
            </div>
          )}

          {activeStep === 3 && (
            <TextField
              label="Location"
              variant="outlined"
              fullWidth
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ margin: '20px 0' }}
            />
          )}

          {activeStep === 4 && (
            <div style={{ margin: '20px 0', textAlign: 'center' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={visibleFields.includes('phone_number')}
                    onChange={() => handleContactMethodChange('phone_number')}
                    color="secondary"
                  />
                }
                label="Phone Number"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={visibleFields.includes('email')}
                    onChange={() => handleContactMethodChange('email')}
                    color="secondary"
                  />
                }
                label="Email Address"
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Button color="secondary" disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            ) : (
              <Button variant="contained" color="secondary" onClick={handleNext}>
                Next
              </Button>
            )}
          </div>

          {submittedPost && (
            <Card variant="outlined" style={{ marginTop: '20px', padding: '10px', width: '350px', margin: '0 auto' }}>
              <CardContent>
                <Typography variant="h6" color="secondary">#{submittedPost.post_id}</Typography>
                <Typography variant="h5" component="div" style={{ margin: '10px 0' }}>
                  {submittedPost.post_title}
                </Typography>
                <Typography>{submittedPost.post_description}</Typography>
                <Divider style={{ margin: '10px 0' }} />
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                  <Typography variant="h6" color="secondary" style={{ marginRight: '8px' }}>
                    ${submittedPost.post_price}
                  </Typography>
                  <Checkbox checked={submittedPost.is_negotiable} disabled color="secondary" />
                  <Typography variant="body2">Price Negotiable?</Typography>
                </div>
                <Typography variant="body2" color="textSecondary">
                  {submittedPost.user_location}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Created on {new Date(submittedPost.post_date).toISOString().split('T')[0]}
                </Typography>
                <Divider style={{ margin: '10px 0' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {submittedPost.visible_fields.phone_number && (
                    <div style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                      <Tooltip title={submittedPost.visible_fields.phone_number}>
                        <IconButton>
                          <CallIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Copy Phone Number">
                        <IconButton onClick={() => copyInfo(submittedPost.visible_fields.phone_number)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}
                  {submittedPost.visible_fields.email && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Tooltip title={submittedPost.visible_fields.email}>
                        <IconButton>
                          <EmailIcon color="primary" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Copy Email">
                        <IconButton onClick={() => copyInfo(submittedPost.visible_fields.email)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}
                </div>
                <Typography variant="body2" color="textSecondary" align="center" style={{ marginTop: '10px' }}>
                  Posted by {submittedPost.created_by}
                </Typography>
              </CardContent>
            </Card>
          )}

        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" align="center" fontWeight="bold">
            You Previously Posted
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid2
            container
            justifyContent="center"
            alignItems="stretch"
            spacing={2}
            style={{ marginTop: "20px", padding: "10px", maxHeight: "400px", overflowY: "auto" }}
          >
            {userMadePosts.map((post, index) => (
              <Grid2 xs={12} sm={6} md={6} key={index}>
                <Card variant="outlined" style={{ height: "100%", padding: "10px" }}>
                  <CardContent>
                    <Typography variant="h6" color="secondary">
                      #{post.post_id}
                    </Typography>
                    <Typography variant="h5" component="div" style={{ margin: "10px 0" }}>
                      {post.post_title}
                    </Typography>
                    <Typography>{post.post_description}</Typography>
                    <Divider style={{ margin: "10px 0" }} />
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                      <Typography
                        variant="h6"
                        color="secondary"
                        style={{ marginRight: "8px" }}
                      >
                        ${post.post_price}
                      </Typography>
                      <Checkbox checked={post.is_negotiable} disabled color="secondary" />
                      <Typography variant="body2">Price Negotiable?</Typography>
                    </div>
                    <Typography variant="body2" color="textSecondary">
                      {post.user_location}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Created on {new Date(post.post_date).toISOString().split('T')[0]}
                    </Typography>
                    <Divider style={{ margin: "10px 0" }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {post.visible_fields.phone_number && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginRight: "10px",
                          }}
                        >
                          <Tooltip title={post.visible_fields.phone_number}>
                            <IconButton>
                              <CallIcon color="primary" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Copy Phone Number">
                            <IconButton
                              onClick={() => copyInfo(post.visible_fields.phone_number)}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      )}
                      {post.visible_fields.email && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Tooltip title={post.visible_fields.email}>
                            <IconButton>
                              <EmailIcon color="primary" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Copy Email">
                            <IconButton
                              onClick={() => copyInfo(post.visible_fields.email)}
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      align="center"
                      style={{ marginTop: "10px" }}
                    >
                      Posted by {post.created_by}
                    </Typography>
                    <CardActions style={{ justifyContent: "center" }}>
                    <IconButton
                      color="error"
                      onClick={() => handleDeletePost(post.post_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    </CardActions>  
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </AccordionDetails>

      </Accordion>
    </div>
  );
};

export default SellGroceries;
