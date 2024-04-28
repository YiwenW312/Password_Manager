import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AuthContext = createContext(null)

export function useAuth () {
  return useContext(AuthContext)
}

export function AuthProvider ({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
      setCurrentUser({ token })
    }
  }, [])

  const login = async (username, password) => {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

    try {
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
        username,
        password
      })

      const data = response.data

      localStorage.setItem('token', data.token)
      setCurrentUser({ username, token: data.token, userId: data.user.id })
      setIsAuthenticated(true)
      setError(null)
      navigate('/password-manager')
    } catch (error) {
      console.error('Login failed:', error)
      if (error.response) {
        const data = error.response.data
        // Check if the data is a string starting with '<!DOCTYPE', means that the database is no ready
        if (typeof data === 'string' && data.startsWith('<!DOCTYPE')) {
          setError('Database is not ready, try again later.')
          alert('Database is not ready, try again later.')
        } else {
          setError(
            error.response.data.message ||
              'An error occurred during the login attempt.'
          )
          alert(
            error.response.data.message ||
              'An error occurred during the login attempt.'
          )
        }
      } else if (error.request) {
        setError('No response received from server. Please try again.')
      } else {
        setError(error.message)
      }
      setIsAuthenticated(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{ currentUser, isAuthenticated, login, logout, error }}
    >
      {children}
    </AuthContext.Provider>
  )
}
