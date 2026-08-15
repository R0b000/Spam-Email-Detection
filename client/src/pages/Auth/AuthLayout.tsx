import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Loader from '../components/Loader/Loader';

const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-gtext">
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default AuthLayout;
