import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Main from './pages/Main';
import { routes } from './routes/routes';
import Emails from './components/Emails'; 
import ViewEmail from './components/ViewEmail'; 
import Email from './components/Email';

const ErrorComponent = lazy(() => import("./components/common/ErrorComponent"));
import SuspenseLoader from './components/common/SuspenseLoader'; 

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userEmail = sessionStorage.getItem('userEmail');
    setIsLoggedIn(!!userEmail); 
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<SuspenseLoader />}>
        <Routes>

          {/* Register and login routes */}
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

          {/* Define routes using lazy-loaded components */}
          <Route path={routes.main.path} element={<Navigate to={`${routes.emails.path}/inbox`} />} />
          <Route path={routes.main.path} element={<routes.main.element />}>
            <Route path={`${routes.emails.path}/:type`} element={<routes.emails.element />} errorElement={<ErrorComponent />} />
            <Route path={routes.view.path} element={<routes.view.element />} errorElement={<ErrorComponent />} />
          </Route>

          {/* Define invalid route */}
          <Route path={routes.invalid.path} element={<Navigate to={`${routes.emails.path}/inbox`} />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
