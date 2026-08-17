import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthRoute from './Manager/Route/AuthRoute';
import EmailRoute from './Manager/Route/EmailRoute';
import NotFound from './pages/NotFound/NotFound';
import Loader from './components/Loader/Loader';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Auth routes */}
          {AuthRoute.map((route, idx) => (
            <Route key={idx} path={route.path} element={route.element}>
              {route.children?.map((child, childIdx) => (
                <Route key={childIdx} index={child.index} path={child.path} element={child.element} />
              ))}
            </Route>
          ))}

          {/* Legacy redirects */}
          <Route path="/login" element={<Navigate to="/auth/login" replace />} />
          <Route path="/register" element={<Navigate to="/auth/register" replace />} />

          {/* Email routes */}
          {EmailRoute.map((route, idx) => (
            <Route key={idx} path={route.path} element={route.element}>
              {route.children?.map((child, childIdx) => (
                <Route key={childIdx} index={child.index} path={child.path} element={child.element} />
              ))}
            </Route>
          ))}

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
