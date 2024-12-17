const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://campus-cuisine-backend-f8fjfcd2agdacqef.eastus2-01.azurewebsites.net'
    : 'http://127.0.0.1:8000';


export default API_BASE_URL;