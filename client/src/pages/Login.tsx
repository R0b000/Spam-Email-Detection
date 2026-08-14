import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authController } from '../Manager/Controller/authController';
import { useAuth } from '../context/AuthContext';
import Logo from '../img/Email.svg';

type Step = 'email' | 'password';

interface FloatInputProps {
  type: string;
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
}

/** Google-style outlined input with a floating label (Tailwind). */
const FloatInput = ({ type, id, label, value, onChange, error, autoComplete }: FloatInputProps) => {
  return (
    <div className="relative mb-2 text-left">
      <input
        id={id}
        type={type}
        value={value}
        placeholder={label}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={`peer h-[54px] w-full rounded border bg-transparent px-3 text-base text-gtext transition-all duration-150 outline-none placeholder-transparent focus:border-brand-blue ${
          error ? 'border-red-600' : 'border-gborder'
        }`}
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-3 px-1 text-gsubtext transition-all duration-150 peer-focus:top-1 peer-focus:text-xs peer-focus:text-brand-blue ${
          value ? 'top-1 text-xs text-gsubtext' : 'top-1/2 -translate-y-1/2 text-base'
        }`}
      >
        {label}
      </label>
      {error && <p className="mt-1 text-left text-xs text-red-600">{error}</p>}
    </div>
  );
};

const FooterBar = () => (
  <footer className="relative z-10 flex w-full max-w-[452px] items-center justify-between text-xs text-[#757575]">
    <select
      defaultValue="en-US"
      aria-label="Language"
      className="cursor-pointer bg-transparent text-xs text-[#757575] outline-none"
    >
      <option value="en-US">English (United States)</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
    </select>
    <div className="flex gap-6">
      <a href="#" className="text-[#757575] hover:text-brand-blue">Help</a>
      <a href="#" className="text-[#757575] hover:text-brand-blue">Privacy</a>
      <a href="#" className="text-[#757575] hover:text-brand-blue">Terms</a>
    </div>
  </footer>
);
const Login: React.FC = () => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/emails', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const goToPasswordStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Enter an email or phone number');
      return;
    }
    setError(null);
    setStep('password');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const result = await authController.login(email, password);

      if (result.message === 'Success') {
        const { name, email } = result.user!;
        setName(name);
        login({ name, email });
        navigate('/emails');
      } else {
        setError('Wrong password. Try again or click "Forgot password" to reset it.');
      }
    } catch (err) {
      console.error(err);
      setError('Wrong password. Try again or click "Forgot password" to reset it.');
    } finally {
      setLoading(false);
    }
  };

  const onBack = () => {
    setStep('email');
    setError(null);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white text-center text-gtext">
      <img src={Logo} alt="" aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-[220px] w-[220px] rotate-12 opacity-15" />
      <img src={Logo} alt="" aria-hidden className="pointer-events-none absolute -bottom-8 -left-8 h-[220px] w-[220px] rotate-12 opacity-15" />

      {step === 'email' ? (
        <div className="relative z-10 box-border w-full max-w-[452px] rounded-lg border border-gborder bg-white px-10 pb-9 pt-12 text-center">
          <img src={Logo} alt="Email logo" className="mx-auto mb-3.5 block h-[72px] w-[72px] object-contain" />
          <h1 className="m-0 text-2xl font-normal leading-[1.333]">Sign in</h1>
          <p className="mb-8 mt-2 text-base text-gsubtext">to continue to Email</p>

          <form onSubmit={goToPasswordStep} noValidate>
            <FloatInput type="text" id="identifierId" label="Email" value={email} onChange={setEmail} error={error ?? ''} autoComplete="username" />
            <button type="button" className="text-left text-sm font-semibold text-brand-blue">Forgot email?</button>
            <p className="mt-5 text-left text-sm leading-relaxed text-gsubtext">
              Not your computer? Use Guest mode to sign in privately.
              <a href="#" className="text-brand-blue"> Learn more</a>
            </p>
            <div className="mt-7 flex items-center justify-between">
              <Link to="/register" className="inline-flex h-10 items-center justify-center rounded bg-transparent px-6 text-sm font-semibold text-brand-blue hover:bg-blue-50">Create account</Link>
              <button type="submit" disabled={loading} className="inline-flex h-10 items-center justify-center rounded bg-brand-blue px-6 text-sm font-semibold text-white hover:bg-brand-blue-dark disabled:opacity-70">
                {loading ? 'Please wait...' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      ) : (
<div className="relative z-10 box-border w-full max-w-[452px] rounded-lg border border-gborder bg-white px-10 pb-9 pt-14 text-center">
          <button type="button" onClick={onBack} aria-label="Back" className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-gtext transition hover:bg-gray-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </button>

          <img src={Logo} alt="Email logo" className="mx-auto mb-3 block h-12 w-12 object-contain" />
          <h1 className="m-0 text-[32px] font-normal">Welcome</h1>
          <p className="mb-5 mt-2 text-base text-gsubtext">to continue to Email</p>

          <span className="mb-5 inline-flex items-center gap-2 rounded-2xl border border-gborder px-3 py-1.5 text-sm text-gtext">
            <span className="flex h-5 w-5 items-center justify-center rounded-full text-xs text-white" style={{ background: '#f3733b' }}>
              {email ? email.trim().charAt(0).toUpperCase() : '?'}
            </span>
            {email}
          </span>

          <form onSubmit={handleLogin} noValidate>
            <div className="relative mb-2 text-left">
              <input
                id="password"
                type={passwordVisible ? 'text' : 'password'}
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                className={`h-[54px] w-full rounded border bg-transparent px-3 text-base text-gtext outline-none ${error ? 'border-red-600' : 'border-gborder'}`}
              />
              <label htmlFor="password" className="pointer-events-none absolute top-1 left-3 px-1 text-xs text-gsubtext">Enter your password</label>
              {password && (
                <button type="button" onClick={() => setPasswordVisible((v) => !v)} className="absolute top-1/2 right-4 -translate-y-1/2 text-sm font-semibold text-brand-blue">
                  {passwordVisible ? 'Hide' : 'Show'}
                </button>
              )}
              {error && <p className="mt-1 text-left text-xs text-red-600">{error}</p>}
            </div>

            <button type="button" className="text-left text-sm font-semibold text-brand-blue">Forgot password?</button>

            <div className="mt-7 flex items-center justify-between">
              <button type="button" onClick={onBack} disabled={loading} className="inline-flex h-10 items-center justify-center rounded bg-transparent px-6 text-sm font-semibold text-brand-blue hover:bg-blue-50 disabled:opacity-70">Back</button>
              <button type="submit" disabled={loading} className="inline-flex h-10 items-center justify-center rounded bg-brand-blue px-6 text-sm font-semibold text-white hover:bg-brand-blue-dark disabled:opacity-70">
                {loading ? 'Signing in...' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      )}

      <FooterBar />
    </div>
  );
};

export default Login;