import API_BASE_URL from './constants';

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/apis/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('accessToken', data.access); 
      return data.access; 
    } else {
      console.error('Failed to refresh access token');
      throw new Error('Token refresh failed');
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error; 
  }
};
