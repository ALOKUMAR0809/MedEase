import { useState, useEffect, useCallback } from 'react';

const useFetchUser = () => {
  const [userDetails, setUserDetails] = useState({});
  const authToken = localStorage.getItem('token');

  const fetchUser = useCallback(async () => {
    try {
      if (authToken) {
        const response = await fetch('http://localhost:5000/api/auth/getuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': authToken,
          },
        });
        const data = await response.json();
        setUserDetails(data);
      } else {
        setUserDetails({});
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [authToken]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { userDetails,setUserDetails, fetchUser, authToken };
};

export default useFetchUser;
