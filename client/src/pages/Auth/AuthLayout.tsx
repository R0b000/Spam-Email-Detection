import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import Logo from '../../img/Email.svg';

const AuthLayout: React.FC = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white text-gtext">
      <style>{`
        .gauth-bg::before,
        .gauth-bg::after {
          content: "";
          position: absolute;
          width: 220px;
          height: 220px;
          background-image: url("${Logo}");
          background-repeat: no-repeat;
          background-size: contain;
          opacity: 0.12;
          pointer-events: none;
        }
        .gauth-bg::before {
          top: -60px;
          right: -60px;
          transform: rotate(25deg);
        }
        .gauth-bg::after {
          bottom: -60px;
          left: -60px;
          transform: rotate(25deg);
        }
      `}</style>
      <div className="gauth-bg flex flex-col items-center">
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default AuthLayout;
