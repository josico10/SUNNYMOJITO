import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import Logo from '../../components/Logo';
import { useApp } from '../../context/AppContext';

export default function LoginPage() {
  const { isAuthed, login, settings } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('alex.morgan');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  if (isAuthed) return <Navigate to="/admin" replace />;

  const submit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Enter your username and password to continue.');
      return;
    }
    if (login(username, password)) {
      navigate(location.state?.from || '/admin', { replace: true });
    } else {
      setError('That username and password don’t match. Check them and try again.');
    }
  };

  return (
    <div className="login">
      <section className="login__art">
        <Logo tone="light" />
        <figure className="login__photo">
          <img src="/images/hero.jpg" alt="A tall glass of mojito with lime, mint and crushed ice" />
          <figcaption>
            <Icon name="sun" size={16} />A little tropical. A lot of happy.
          </figcaption>
        </figure>
        <h2>{settings.tagline}</h2>
        <p>Fresh flavors. Happy moments. Your sunny little workspace.</p>
      </section>

      <section className="login__form-wrap">
        <form className="login__form" onSubmit={submit} noValidate>
          <p className="login__eyebrow">
            <Icon name="shield" size={15} /> Admin workspace
          </p>
          <h1>Welcome back.</h1>
          <p className="login__lead">Sign in to keep the sunny side of your business looking fresh.</p>

          <label className="field">
            <span className="field__label">Username</span>
            <span className="input input--icon">
              <Icon name="user" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </span>
          </label>

          <label className="field">
            <span className="field__label">Password</span>
            <span className="input input--icon">
              <Icon name="lock" size={18} />
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Enter your password"
              />
            </span>
          </label>

          <button type="button" className="link-button" onClick={() => setShow((s) => !s)}>
            <Icon name={show ? 'eyeOff' : 'eye'} size={16} />
            {show ? 'Hide password' : 'Show password'}
          </button>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn--yellow btn--block">
            <Icon name="arrowRight" size={16} /> Login
          </button>

          <p className="login__secure">
            <Icon name="lock" size={14} /> Secure access for authorized administrators
          </p>
        </form>

        <div className="login__back">
          <Link to="/">
            <Icon name="arrowLeft" size={14} /> Back to {settings.brandName}
          </Link>
          <small>© 2026 {settings.brandName}. Stay on the sunny side.</small>
        </div>
      </section>
    </div>
  );
}
