import React from 'react'
import ReactDOM from 'react-dom/client'
import PokemonPage from './PokemonPage.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Login from './Login.jsx'
import Register from './Register.jsx'

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  }, 
  {
    path: '/pokemon',
    element: <PokemonPage />
  },
  {
    path: '/',
    element: <div>Welcome to my website</div>
  }
])


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
