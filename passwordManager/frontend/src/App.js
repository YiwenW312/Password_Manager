import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage'
import Navbar from './components/Navbar'
import LoginModal from './components/LoginModal'
import RegisterModal from './components/RegisterModal'
import Footer from './components/Footer'
import PasswordManagerPage from './components/PasswordManagerPage'
import { AuthProvider } from './AuthContext'

function App () {
  localStorage.clear()
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route exact path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginModal />} />
          <Route path='/register' element={<RegisterModal />} />
          <Route path='/password-manager' element={<PasswordManagerPage />} />
        </Routes>
      </AuthProvider>
      <Footer />
    </Router>
  )
}

export default App
