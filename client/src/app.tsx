import React from 'react';
import './assets/styles.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import {
  AuthLayout,
  DashboardPage,
  LoginPage,
  SignUpPage,
  UsersPage,
} from './pages';
import { Layout } from './components';
import { AuthGuard, GuestGuard } from './components/guards';
import { store } from './store';
import { CustomRouter } from './lib/custom-router';
import { history } from './lib/utils';

function App() {
  return (
    <Provider store={store}>
      <CustomRouter history={history}>
        <Routes>
          {/* Guest routes */}
          <Route element={<GuestGuard />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
            </Route>
          </Route>

          {/* Protected routes */}
          <Route element={<AuthGuard />}>
            <Route element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="users" element={<UsersPage />} />
            </Route>
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CustomRouter>
    </Provider>
  );
}

export default App;
