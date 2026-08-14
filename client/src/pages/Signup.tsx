import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authController } from '../Manager/Controller/authController';
import Logo from '../img/logo.png';
import '../css/auth.css';

interface FloatInputProps {
  type: string;
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  showToggle?: boolean;
  passwordVisible?: boolean;
  onToggle?: () => void;
}

/** Google-style outlined input with a floating label. */
const FloatInput = ({
  type,
  id,
  label,
  value,
  onChange,
  error,
  autoComplete,
  showToggle,
  passwordVisible,
  onToggle,
}: FloatInputProps) => {
  const isPassword = showToggle && passwordVisible !== undefined;
  return (
    <div className={`gauth-input-wrap ${value ? 'filled' : ''}`}>
      <input
        id={id}
        type={isPassword ? (passwordVisible ? 'text' : 'password') : type}
        className={`gauth-input ${error ? 'error' : ''}`}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
      />
      <label htmlFor={id} className="gauth-label">
        {label}
      </label>
      {showToggle && value && (
        <button type="button" className="gauth-password-toggle" onClick={onToggle}>
          {passwordVisible ? 'Hide' : 'Show'}
        </button>
      )}
      {error && <p className="gauth-error">{error}</p>}
    </div>
  );
};

/**
 * FooterBar component renders a footer section with language selection and navigation links
 * @returns {JSX.Element} The footer component with language dropdown and help links
 */
const FooterBar = () => (
  <footer className="gauth-footer" style={{ maxWidth: 1040, marginTop: 24 }}>
    {/* Language selection dropdown with default value set to English (United States) */}
    <select defaultValue="en-US" aria-label="Language">
      <option value="en-US">English (United States)</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
    </select>
    {/* Container for footer navigation links */}
    <div className="gauth-footer-links">
      <a href="#">Help</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </footer>
);

const Signup: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const email = `${username.trim()}@email.com`;
    if (!firstName.trim() || !lastName.trim() || !username.trim()) {
      setError('Please fill in the required fields.');
      return;
    }
    if (password.length < 8) {
      setError('Use 8 characters or more for your password.');
      return;
    }
    if (password !== confirm) {
      setError('Those passwords didn\u2019t match. Try again.');
      return;
    }

    try {
      setLoading(true);
      await authController.register({
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: `${username.trim()}@email.com`,
        password,
      });
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gauth">
      <div className="gauth-card wide">
        <div className="gauth-register-grid">
          <div className="gauth-register-form">
            <img src={Logo} alt="Email logo" className="gauth-logo" style={{ width: 60, height: 60 }} />
            <h1 className="gauth-h1">Create your Email Account</h1>
            <p className="gauth-sub">to continue to Email</p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="gauth-row2">
                <FloatInput type="text" id="firstName" label="First name" value={firstName} onChange={setFirstName} autoComplete="given-name" />
                <FloatInput type="text" id="lastName" label="Last name" value={lastName} onChange={setLastName} autoComplete="family-name" />
              </div>

              {/* Username with @email.com suffix */}
              <div className="gauth-input-wrap filled" style={{ marginTop: 16 }}>
                <input
                  id="username"
                  type="text"
                  className="gauth-input"
                  value={username}
                  autoComplete="off"
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                  style={{ paddingRight: 96 }}
                />
                <label htmlFor="username" className="gauth-label">
                  Username
                </label>
                <span className="gauth-password-toggle" style={{ fontWeight: 400, color: '#5f6368' }}>
                  @email.com
                </span>
              </div>
              <p className="gauth-form-note">You can use letters, numbers &amp; periods</p>
              <Link to="/login" className="gauth-link" style={{ marginTop: 4 }}>
                Use my current email address instead
              </Link>
<hr className="gauth-rule" />

              <div className="gauth-row2">
                <FloatInput
                  type="password"
                  id="password"
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  autoComplete="new-password"
                  showToggle
                  passwordVisible={passwordVisible}
                  onToggle={() => setPasswordVisible((v) => !v)}
                />
                <FloatInput
                  type="password"
                  id="confirm"
                  label="Confirm"
                  value={confirm}
                  onChange={setConfirm}
                  autoComplete="new-password"
                  showToggle
                  passwordVisible={confirmVisible}
                  onToggle={() => setConfirmVisible((v) => !v)}
                />
              </div>

              {error && <p className="gauth-error" style={{ minHeight: 0, marginTop: 12 }}>{error}</p>}

              <div className="gauth-panel-actions" style={{ marginTop: 20 }}>
                <Link to="/login" className="gauth-btn gauth-btn-flat">
                  Sign in instead
                </Link>
                <button type="submit" className="gauth-btn gauth-btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Next'}
                </button>
              </div>
            </form>
          </div>

          {/* Right illustration panel */}
          <div className="gauth-register-aside">
            <img src={Logo} alt="Email illustration" className="gauth-aside-art" />
            <h3>One Email account. Everything Email.</h3>
            <p>Your inbox, spam detection and more — all in one place.</p>
          </div>
        </div>
      </div>

      <FooterBar />
    </div>
  );
};

export default Signup;