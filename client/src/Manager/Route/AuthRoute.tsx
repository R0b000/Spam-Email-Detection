import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import AuthLayout from '../../pages/Auth/AuthLayout';

const LoginPage = lazy(() => import('../../pages/Auth/Login'));
const RegisterPage = lazy(() => import('../../pages/Auth/Register'));

const AuthRoute: RouteObject[] = [
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
];

export default AuthRoute;
