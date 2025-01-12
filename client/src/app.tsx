import React from 'react';
import './assets/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  AuthLayout,
  DashboardPage,
  LoginPage,
  SignUpPage,
  UsersPage,
} from './pages';
import { Layout } from './components';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
