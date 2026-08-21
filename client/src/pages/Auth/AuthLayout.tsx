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
      <div className="gauth-bg flex flex-col items-center px-4 w-full max-w-[500px]">
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
        
        {/* Portfolio Disclaimer */}
        <div className="mt-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center text-xs text-yellow-800 shadow-sm relative z-20 w-full">
          <p className="font-semibold mb-1">⚠️ Disclaimer / Portfolio Project Notice</p>
          <p>
            This application is a simulated email interface built solely for portfolio demonstration and educational purposes (such as testing spam email classification models). It is not affiliated with Google, Gmail, or any other email provider. Please do not enter real credentials or sensitive personal information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
