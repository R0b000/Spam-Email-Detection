import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../img/Email.svg';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/emails/inbox', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="relative z-10 flex h-full w-full flex-col items-center justify-start md:justify-center overflow-y-auto bg-white px-6 py-12 text-center">
      <img src={Logo} alt="Email logo" className="mx-auto mb-6 block h-20 w-20 sm:h-24 sm:w-24 object-contain" />
      <h1 className="mb-3 text-3xl sm:text-4xl font-normal text-gtext">Welcome to Email</h1>
      <p className="mx-auto mb-8 max-w-xl text-sm sm:text-base text-gsubtext">
        A fast, secure, and intelligent email experience. Manage your inbox, stay organized, and connect with confidence.
      </p>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
        <FeatureCard
          title="Smart Inbox"
          description="Automatically sorts important emails and filters spam so you focus on what matters."
          icon={
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="mx-auto mb-4 text-brand-blue">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        <FeatureCard
          title="Spam Protection"
          description="Advanced spam detection keeps your inbox clean and your data safe."
          icon={
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="mx-auto mb-4 text-brand-blue">
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        <FeatureCard
          title="Easy Organization"
          description="Labels, stars, and quick actions help you organize emails without the clutter."
          icon={
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="mx-auto mb-4 text-brand-blue">
              <path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
        <Link to="/auth/login" className="inline-flex h-11 items-center justify-center rounded bg-brand-blue px-8 text-sm font-semibold text-white hover:bg-brand-blue-dark w-full sm:w-auto">Sign in</Link>
        <Link to="/auth/register" className="inline-flex h-11 items-center justify-center rounded border border-gborder px-8 text-sm font-semibold text-brand-blue hover:bg-blue-50 w-full sm:w-auto">Create account</Link>
      </div>

      {/* Portfolio Disclaimer */}
      <div className="mt-8 max-w-[500px] rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-center text-xs text-yellow-800 shadow-sm relative z-20 w-full">
        <p className="font-semibold mb-1">⚠️ Disclaimer / Portfolio Project Notice</p>
        <p>
          This application is a simulated email interface built solely for portfolio demonstration and educational purposes (such as testing spam email classification models). It is not affiliated with Google, Gmail, or any other email provider. Please do not enter real credentials or sensitive personal information.
        </p>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <div className="rounded-lg border border-gborder bg-white p-6 text-center shadow-sm">
    {icon}
    <h3 className="mb-2 text-base font-semibold text-gtext">{title}</h3>
    <p className="text-sm leading-relaxed text-gsubtext">{description}</p>
  </div>
);

export default Home;
