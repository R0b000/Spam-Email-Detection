import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authController } from '../Manager/Controller/authController';
import { useAuth } from '../context/AuthContext';
import Logo from '../img/logo.png';
import '../css/auth.css';

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

/** Google-style outlined input with a floating label. */
const FloatInput = ({ type, id, label, value, onChange, error, autoComplete }: FloatInputProps) => {
  return (
    <div className={`gauth-input-wrap ${value ? 'filled' : ''}`}>
      <input
        id={id}
        type={type}
        className={`gauth-input ${error ? 'error' : ''}`}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
      />
      <label htmlFor={id} className="gauth-label">
        {label}
      </label>
      {error && <p className="gauth-error">{error}</p>}
    </div>
  );
};

const FooterBar = () => (
  <footer className="gauth-footer" style={{ maxWidth: 452 }}>
    <select defaultValue="en-US" aria-label="Language">
      <option value="en-US">English (United States)</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
    </select>
    <div className="gauth-footer-links">
      <a href="#">Help</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
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

  // If the user is already authenticated, send them straight to the inbox.
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
        console.log('Login failed:', result.message);
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
    <div className="gauth">
      {/* EMAIL STEP */}
      {step === 'email' ? (
        <div className="gauth-card">
          <img src={Logo} alt="Email logo" className="gauth-logo" />
          <h1 className="gauth-h1">Sign in</h1>
          <p className="gauth-sub">to continue to Email</p>

          <form onSubmit={goToPasswordStep} noValidate>
            <FloatInput
              type="text"
              id="identifierId"
              label="Email"
              value={email}
              onChange={setEmail}
              error={error ?? ''}
              autoComplete="username"
            />
            <button type="button" className="gauth-link">
              Forgot email?
            </button>
            <p className="gauth-note">
              Not your computer? Use Guest mode to sign in privately.{' '}
              <a href="#">Learn more</a>
            </p>
            <div className="gauth-panel-actions" style={{ marginTop: 30 }}>
              <Link to="/register" className="gauth-btn gauth-btn-flat">
                Create account
              </Link>
              <button type="submit" className="gauth-btn gauth-btn-primary" disabled={loading}>
                Next
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* PASSWORD STEP */
        <div className="gauth-card" style={{ paddingTop: 56 }}>
          <button type="button" className="gauth-back" onClick={onBack} aria-label="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </button>
          <img src={Logo} alt="Email logo" className="gauth-logo" style={{ width: 48, height: 48 }} />
          <h1 className="gauth-h1" style={{ fontSize: 32 }}>
            Welcome
          </h1>
          <p className="gauth-sub" style={{ marginBottom: 20 }}>
            to continue to Email
          </p>

          <span className="gauth-user-chip">
            <span className="gauth-avatar" style={{ width: 20, height: 20, fontSize: 11 }}>
              {email ? email.trim().charAt(0).toUpperCase() : '?'}
            </span>
            {email}
          </span>

          <form onSubmit={handleLogin} noValidate>
            <div className="gauth-input-wrap filled">
              <input
                id="password"
                type={passwordVisible ? 'text' : 'password'}
                className={`gauth-input ${error ? 'error' : ''}`}
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password" className="gauth-label">
                Enter your password
              </label>
              {password && (
                <button
                  type="button"
                  className="gauth-password-toggle"
                  onClick={() => setPasswordVisible((v) => !v)}
                >
                  {passwordVisible ? 'Hide' : 'Show'}
                </button>
              )}
              {error && <p className="gauth-error">{error}</p>}
            </div>

            <button type="button" className="gauth-link">
              Forgot password?
            </button>

            <div className="gauth-panel-actions" style={{ marginTop: 30 }}>
              <button type="button" className="gauth-btn gauth-btn-flat" onClick={onBack} disabled={loading}>
                Back
              </button>
              <button type="submit" className="gauth-btn gauth-btn-primary" disabled={loading}>
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