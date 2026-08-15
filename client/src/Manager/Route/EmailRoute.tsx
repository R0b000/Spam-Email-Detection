import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import EmailLayout from '../../pages/Email/EmailLayout';
import EmailPage from '../../pages/Email/EmailPage';
import EmailViewPage from '../../pages/Email/EmailViewPage';
import ProtectedRoute from '../../Utility/ProtectedRoute';
import Home from '../../pages/Home/Home';

const EmailListPage = lazy(() => import('../../pages/Email/EmailPage'));
const EmailView = lazy(() => import('../../pages/Email/EmailViewPage'));

const EmailRoute: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/emails',
    element: (
      <ProtectedRoute>
        <EmailLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <EmailListPage /> },
      { path: ':type', element: <EmailListPage /> },
      { path: 'view', element: <EmailView /> },
    ],
  },
];

export default EmailRoute;
