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
      const result = await authController.login({ email, password });

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
      <style>{`
        .gauth {
          --g-blue: #1a73e8;
          --g-blue-dark: #1765cc;
          --g-blue-ghost: #e8f0fe;
          --g-text: #202124;
          --g-text-secondary: #5f6368;
          --g-text-muted: #757575;
          --g-border: #dadce0;
          --g-error: #d93025;
          min-height: 100vh;
          background: #ffffff;
          color: var(--g-text);
          font-family: "Google Sans", Roboto, Arial, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          text-align: center;
        }
        .gauth::before,
        .gauth::after {
          content: "";
          position: absolute;
          width: 220px;
          height: 220px;
          background-image: url("../img/Email.svg");
          background-repeat: no-repeat;
          background-size: contain;
          opacity: 0.06;
          pointer-events: none;
        }
        .gauth::before {
          top: -60px;
          right: -60px;
          transform: rotate(25deg);
        }
        .gauth::after {
          bottom: -60px;
          left: -60px;
          transform: rotate(25deg);
        }
        .gauth-card {
          width: 100%;
          max-width: 452px;
          background: #fff;
          border: 1px solid var(--g-border);
          border-radius: 8px;
          padding: 46px 40px 36px;
          box-sizing: border-box;
          text-align: center;
          position: relative;
          z-index: 2;
        }
        .gauth-card.wide {
          max-width: 1040px;
          padding: 0;
          overflow: hidden;
          text-align: left;
        }
        .gauth-logo {
          width: 72px;
          height: 72px;
          object-fit: contain;
          margin: 0 auto 14px;
          display: block;
        }
        .gauth-h1 {
          font-size: 24px;
          font-weight: 400;
          line-height: 1.333;
          margin: 0;
        }
        .gauth-sub {
          font-size: 16px;
          color: var(--g-text-secondary);
          margin: 8px 0 30px;
          letter-spacing: 0.1px;
        }
        .gauth-input-wrap {
          text-align: left;
          margin-bottom: 8px;
          position: relative;
        }
        .gauth-input {
          width: 100%;
          height: 54px;
          padding: 0 12px;
          box-sizing: border-box;
          font-size: 16px;
          color: var(--g-text);
          background: transparent;
          border: 1px solid var(--g-border);
          border-radius: 4px;
          outline: none;
          font-family: Roboto, Arial, sans-serif;
        }
        .gauth-input:focus {
          border: 2px solid var(--g-blue);
          padding: 0 11px;
        }
        .gauth-input.error {
          border: 1px solid var(--g-error);
        }
        .gauth-input-wrap .gauth-label {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--g-text-secondary);
          font-size: 16px;
          pointer-events: none;
          transition: 0.15s linear;
          background: #fff;
          padding: 0 4px;
        }
        .gauth-input-wrap.filled .gauth-label,
        .gauth-input-wrap:focus-within .gauth-label {
          top: -1px;
          transform: translateY(-50%);
          font-size: 12px;
          color: var(--g-blue);
        }
        .gauth-input-wrap.filled .gauth-label {
          color: var(--g-text-secondary);
        }
        .gauth-error {
          color: var(--g-error);
          font-size: 12px;
          line-height: 1.5;
          text-align: left;
          margin: 0;
          min-height: 18px;
        }
        .gauth-link {
          color: var(--g-blue);
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          font-family: Roboto, Arial, sans-serif;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: inline-block;
          text-align: left;
        }
        .gauth-link:hover {
          color: var(--g-blue-dark);
        }
        .gauth-note {
          text-align: left;
          font-size: 14px;
          color: var(--g-text-secondary);
          margin: 22px 0 0;
          line-height: 1.45;
        }
        .gauth-note a {
          color: var(--g-blue);
          text-decoration: none;
        }
        .gauth-card hr.gauth-rule {
          border: none;
          border-bottom: 1px solid var(--g-border);
          margin: 30px 0 22px;
        }
        .gauth-panel-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 30px;
        }
        .gauth-btn {
          height: 40px;
          padding: 0 24px;
          border-radius: 4px;
          font-family: Roboto, Arial, sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.25px;
          cursor: pointer;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }
        .gauth-btn:disabled {
          cursor: default;
          opacity: 0.7;
        }
        .gauth-btn-primary {
          background: var(--g-blue);
          color: #fff;
        }
        .gauth-btn-primary:hover:not(:disabled) {
          background: var(--g-blue-dark);
          box-shadow: 0 1px 2px rgba(26, 115, 232, 0.3);
        }
        .gauth-btn-flat {
          background: transparent;
          color: var(--g-blue);
        }
        .gauth-btn-flat:hover:not(:disabled) {
          background: var(--g-blue-ghost);
        }
        .gauth-back {
          position: absolute;
          left: 16px;
          top: 12px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--g-text);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .gauth-back:hover {
          background: #f1f3f4;
        }
        .gauth-avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: #f3733b;
          color: #fff;
          font-size: 52px;
          font-weight: 300;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin: 8px auto 12px;
          user-select: none;
        }
        .gauth-user-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--g-border);
          border-radius: 16px;
          padding: 6px 12px;
          font-size: 14px;
          color: var(--g-text);
          margin-bottom: 20px;
        }
        .gauth-user-chip img {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          object-fit: cover;
        }
        .gauth-password-toggle {
          position: absolute;
          right: 4px;
          top: 50%;
          transform: translateY(-50%);
          border: none;
          background: none;
          color: var(--g-blue);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: Roboto, Arial, sans-serif;
        }
        .gauth-footer {
          width: 100%;
          max-width: 452px;
          margin-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: var(--g-text-muted);
          font-family: Roboto, Arial, sans-serif;
          position: relative;
          z-index: 2;
        }
        .gauth-footer select {
          border: none;
          background: transparent;
          color: var(--g-text-muted);
          font-size: 12px;
          cursor: pointer;
          outline: none;
          font-family: Roboto, Arial, sans-serif;
        }
        .gauth-footer-links {
          display: flex;
          gap: 24px;
        }
        .gauth-footer-links a {
          color: var(--g-text-muted);
          text-decoration: none;
        }
        .gauth-footer-links a:hover {
          color: var(--g-blue);
        }
        .gauth-register-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 500px;
        }
        .gauth-register-form {
          padding: 48px 48px 36px;
          text-align: left;
        }
        .gauth-register-form .gauth-logo {
          text-align: left;
          margin: 0 0 14px;
        }
        .gauth-row2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .gauth-form-note {
          font-size: 13px;
          color: var(--g-text-secondary);
          line-height: 1.5;
          margin: 10px 1px 0;
          text-align: left;
        }
        .gauth-form-note a {
          color: var(--g-blue);
          text-decoration: none;
        }
        .gauth-register-aside {
          background: #f1f3f4;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 40px;
          position: relative;
        }
        .gauth-register-aside img.gauth-aside-art {
          max-width: 280px;
          width: 100%;
          opacity: 0.14;
        }
        .gauth-register-aside h3 {
          font-size: 20px;
          font-weight: 400;
          margin: 0;
          color: var(--g-text);
          text-align: center;
        }
        .gauth-register-aside p {
          font-size: 14px;
          color: var(--g-text-secondary);
          margin: 0;
          text-align: center;
          max-width: 340px;
          line-height: 1.5;
        }
        @media (max-width: 800px) {
          .gauth-card.wide {
            max-width: 452px;
          }
          .gauth-register-grid {
            grid-template-columns: 1fr;
          }
          .gauth-register-aside {
            display: none;
          }
        }
      `}</style>
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