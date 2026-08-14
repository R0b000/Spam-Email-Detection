import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authController } from '../Manager/Controller/authController';
import Logo from '../img/Email.svg';

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

/** Google-style outlined input with a floating label (Tailwind). */
const FloatInput = ({
  type, id, label, value, onChange, error, autoComplete, showToggle, passwordVisible, onToggle,
}: FloatInputProps) => {
  const isPassword = showToggle && passwordVisible !== undefined;
  return (
    <div className="relative mb-2 text-left">
      <input
        id={id}
        type={isPassword ? (passwordVisible ? 'text' : 'password') : type}
        value={value}
        placeholder={label}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className={`peer h-[54px] w-full rounded border bg-transparent px-3 text-base text-gtext outline-none transition-all duration-150 placeholder-transparent focus:border-brand-blue ${
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
      {showToggle && value && (
        <button type="button" onClick={onToggle} className="absolute top-1/2 right-4 -translate-y-1/2 text-sm font-semibold text-brand-blue">
          {passwordVisible ? 'Hide' : 'Show'}
        </button>
      )}
      {error && <p className="mt-1 text-left text-xs text-red-600">{error}</p>}
    </div>
  );
};

const FooterBar = () => (
  <footer className="relative z-10 flex w-full max-w-[1040px] items-center justify-between text-xs text-[#757575]">
    <select defaultValue="en-US" aria-label="Language" className="cursor-pointer bg-transparent text-xs text-[#757575] outline-none">
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
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white text-gtext">
      <div className="relative z-10 w-full max-w-[1040px] overflow-hidden rounded-lg border border-gborder bg-white text-left">
        <div className="grid min-h-[500px] grid-cols-1 md:grid-cols-2">
<div className="px-12 pb-9 pt-12">
            <img src={Logo} alt="Email logo" className="mb-3.5 h-[60px] w-[60px] object-contain text-left" />
            <h1 className="m-0 text-2xl font-normal">Create your Email Account</h1>
            <p className="mb-8 mt-2 text-base text-gsubtext">to continue to Email</p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-2 gap-4">
                <FloatInput type="text" id="firstName" label="First name" value={firstName} onChange={setFirstName} autoComplete="given-name" />
                <FloatInput type="text" id="lastName" label="Last name" value={lastName} onChange={setLastName} autoComplete="family-name" />
              </div>

              <div className="relative mt-4 text-left">
                <input
                  id="username"
                  type="text"
                  value={username}
                  placeholder="Username"
                  autoComplete="off"
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, ''))}
                  className="peer h-[54px] w-full rounded border border-gborder bg-transparent px-3 text-base text-gtext outline-none placeholder-transparent focus:border-brand-blue"
                  style={{ paddingRight: 96 }}
                />
                <label htmlFor="username" className="pointer-events-none absolute top-1 left-3 px-1 text-xs text-gsubtext">Username</label>
                <span className="absolute top-1/2 right-4 -translate-y-1/2 text-sm text-gsubtext">@email.com</span>
              </div>
              <p className="mt-2 text-left text-[13px] leading-relaxed text-gsubtext">You can use letters, numbers &amp; periods</p>
              <Link to="/login" className="mt-1 inline-block text-sm font-semibold text-brand-blue">Use my current email address instead</Link>

              <hr className="my-7 border-0 border-b border-gborder" />

              <div className="grid grid-cols-2 gap-4">
                <FloatInput type="password" id="password" label="Password" value={password} onChange={setPassword} autoComplete="new-password" showToggle passwordVisible={passwordVisible} onToggle={() => setPasswordVisible((v) => !v)} />
                <FloatInput type="password" id="confirm" label="Confirm" value={confirm} onChange={setConfirm} autoComplete="new-password" showToggle passwordVisible={confirmVisible} onToggle={() => setConfirmVisible((v) => !v)} />
              </div>

              {error && <p className="mt-3 text-left text-xs text-red-600">{error}</p>}

              <div className="mt-5 flex items-center justify-between">
                <Link to="/login" className="inline-flex h-10 items-center justify-center rounded bg-transparent px-6 text-sm font-semibold text-brand-blue hover:bg-blue-50">Sign in instead</Link>
                <button type="submit" disabled={loading} className="inline-flex h-10 items-center justify-center rounded bg-brand-blue px-6 text-sm font-semibold text-white hover:bg-brand-blue-dark disabled:opacity-70">
                  {loading ? 'Creating...' : 'Next'}
                </button>
              </div>
            </form>
          </div>

          {/* Right illustration panel */}
          <div className="hidden flex-col items-center justify-center gap-5 bg-[#f1f3f4] p-10 md:flex">
            <img src={Logo} alt="Email illustration" className="w-[280px] max-w-full opacity-15" />
            <h3 className="m-0 text-center text-xl font-normal">One Email account. Everything Email.</h3>
            <p className="m-0 max-w-[340px] text-center text-sm leading-relaxed text-gsubtext">Your inbox, spam detection and more — all in one place.</p>
          </div>
        </div>
      </div>

      <FooterBar />
    </div>
  );
};

export default Signup;