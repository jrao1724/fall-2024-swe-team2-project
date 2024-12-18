import React, { useState, useEffect } from "react";
import {
  TextField,
  IconButton,
  Grid2,
  Card,
  CardContent,
  Typography,
  Divider,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import API_BASE_URL from '../constants';
import { refreshAccessToken } from '../apiRefresh';


const BuyGroceries = () => {

  const [searchQuery, setSearchQuery] = useState("");
  const [buyPosts, setBuyPosts] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(()=>{
    const showAllBuyPosts = async () => {
      if(!searchQuery){
        try{
          const makeRequest = async (token) => {
            const response = await fetch(`${API_BASE_URL}/apis/rest/marketplace/getAllPosts/`,{
              headers: {'Authorization': `Bearer ${token}`},
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

          if (response.ok) {
            console.log('Showing all posts successfully')
            setBuyPosts(data)
            setHasFetched(true)
          } else {
          console.error("Error showing buy posts", data)
          }
          
        } catch (error) {
          console.error("An unexpected error occurred:", error);
          alert("An unexpected error occurred while loading all buy recipes. Please try again.");
        }
      }
    };

    showAllBuyPosts();
  }, [searchQuery, hasFetched]);

  const handleSearch = async () => {
    if(searchQuery){
      try{

        const searchData ={
          search: searchQuery,
        };

        const makeRequest = async (token) => {
          const response = await fetch(`${API_BASE_URL}/apis/rest/marketplace/searchPosts/`,{
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(searchData),
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

        if(response.ok){
          console.log("Searched recipes successfully", data)
          setBuyPosts(data)
        } else {
          console.error("Error searching recipes", data)
          setHasFetched(false)
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const copyInfo = (info) => {
    navigator.clipboard.writeText(info);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
        <TextField
          label="Search Posts"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "60%" }}
        />
        <IconButton onClick={handleSearch} color="primary">
          <SearchIcon />
        </IconButton>
      </div>

      <Grid2 container
            justifyContent="center"
            alignItems="stretch"
            spacing={2}
            style={{ marginTop: "20px", padding: "10px", maxHeight: "400px", overflowY: "auto" }}>
        {buyPosts.map((post, index) => (
          <Grid2 item xs={12} sm={6} md={6} key={index}>
            <Card variant="outlined" style={{ width: "100%", padding: "10px" }}>
              <CardContent>
                <Typography variant="h6" color="secondary">
                  #{post.post_id}
                </Typography>
                <Typography
                  variant="h5"
                  component="div"
                  style={{ margin: "10px 0" }}
                >
                  {post.post_title}
                </Typography>
                <Typography>{post.post_description}</Typography>
                <Divider style={{ margin: "10px 0" }} />
                <Typography variant="h6" color="secondary">
                  ${post.post_price}
                </Typography>
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
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </div>
  );
};

export default BuyGroceries;
