import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error occurred during login');
      }

      // Save the JWT token in local storage
      localStorage.setItem('token', data.token);

      // Update state to reflect user login
      setCurrentUser({
        username,
        token: data.token,
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Rethrow the error so it can be handled by the login form
    }
  };

  const logout = () => {
    // Remove the token from local storage
    localStorage.removeItem('token');

    // Update state to reflect user logout
    setCurrentUser(null);
  };

  // Provide state and authentication functions to the context
  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

