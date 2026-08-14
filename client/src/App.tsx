import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Main from './pages/Main';
import { routes } from './routes/routes';
import Emails from './components/Emails';
import ViewEmail from './components/ViewEmail';
import Email from './components/Email';
import ProtectedRoute from './components/ProtectedRoute';
import SuspenseLoader from './components/common/SuspenseLoader';

const ErrorComponent = lazy(() => import('./components/common/ErrorComponent'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>
          {/* Register and login routes */}
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Redirect the base route to the inbox */}
          <Route path={routes.main.path} element={<Navigate to={`${routes.emails.path}/inbox`} />} />

          {/* Protected routes - redirect to /login when not authenticated */}
          <Route
            path={routes.main.path}
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            }
          >
            <Route
              path={`${routes.emails.path}/:type`}
              element={<routes.emails.element />}
              errorElement={<ErrorComponent />}
            />
            <Route
              path={routes.view.path}
              element={<routes.view.element />}
              errorElement={<ErrorComponent />}
            />
          </Route>

          {/* Define invalid route for deeply nested paths */}
          <Route
            path={routes.invalid.path}
            element={
              <ProtectedRoute>
                <Navigate to={`${routes.emails.path}/inbox`} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;