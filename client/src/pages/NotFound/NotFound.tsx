import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../img/Email.svg';

const NotFound: React.FC = () => {
  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <img src={Logo} alt="Email logo" className="mx-auto mb-6 block h-20 w-20 object-contain opacity-80" />
      <h1 className="text-6xl font-normal text-gtext">404</h1>
      <p className="mt-2 text-lg text-gsubtext">This page does not exist.</p>
      <Link
        to="/emails/inbox"
        className="mt-6 inline-flex h-10 items-center justify-center rounded bg-brand-blue px-6 text-sm font-semibold text-white hover:bg-brand-blue-dark"
      >
        Go to Inbox
      </Link>
    </div>
  );
};

export default NotFound;
