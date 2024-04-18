import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import PasswordManagerPage from './components/PasswordManagerPage';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/password-manager" component={PasswordManagerPage} />
        </Switch>
      </AuthProvider>
    </Router>
  );
}

export default App;

