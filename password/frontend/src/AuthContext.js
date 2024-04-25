import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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
    try {
      const response = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()
      console.log('data:', data)
      if (!response.ok) {
        throw new Error(data.message || 'Error occurred during login')
      }
      localStorage.setItem('token', data.token)
      localStorage.setItem('userId', data.id)
      
      setCurrentUser({ username, token: data.token, userId: data.id})
      setIsAuthenticated(true)
      setError(null)
      navigate('/password-manager')
      setCurrentUser({ username, token: data.token, userId: data.id})
      setIsAuthenticated(true)
      setError(null)
    } catch (error) {
      console.error('Login failed:', error)
      setError(error.message)
      setIsAuthenticated(false)
      throw error
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
