import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import { useToast } from '../../components/Toast';
import { useApp } from '../../context/AppContext';
import { formatDateTime, formatLongDate, initials } from '../../lib/format';

export default function AdminProfilePage() {
  const { admin, changeUsername, changePassword, logout } = useApp();
  const toast = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState(admin.username);
  const [usernameError, setUsernameError] = useState('');

  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwErrors, setPwErrors] = useState({});

  const saveUsername = (e) => {
    e.preventDefault();
    const value = username.trim();
    if (!/^[A-Za-z0-9._]{3,30}$/.test(value)) {
      setUsernameError('Use 3–30 characters: letters, numbers, dots or underscores.');
      return;
    }
    changeUsername(value);
    setUsername(value);
    setUsernameError('');
    toast('Username saved.');
  };

  const savePassword = (e) => {
    e.preventDefault();
    const errors = {};
    if (!pw.current) errors.current = 'Enter your current password.';
    if (pw.next.length < 12 || !/\d/.test(pw.next) || !/[^A-Za-z0-9]/.test(pw.next)) {
      errors.next = 'Use at least 12 characters with a number and a symbol.';
    }
    if (pw.confirm !== pw.next) errors.confirm = 'The two passwords don’t match.';
    if (Object.keys(errors).length === 0 && !changePassword(pw.current, pw.next)) {
      errors.current = 'That isn’t your current password. Check it and try again.';
    }
    setPwErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setPw({ current: '', next: '', confirm: '' });
    toast('Password updated.');
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const setField = (key) => (e) => {
    setPw((p) => ({ ...p, [key]: e.target.value }));
    setPwErrors((er) => ({ ...er, [key]: undefined }));
  };

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Admin Profile</h1>
        <p className="page-lead">Your workspace identity and account security, in one place.</p>
      </div>

      <div className="profile">
        <div className="stack">
          <section className="card card--pad profile__card">
            <span className="avatar avatar--lg">{initials(admin.name)}</span>
            <h2>{admin.name}</h2>
            <span className="pill pill--active">{admin.role}</span>
            <p className="profile__note">Fictional sample administrator</p>
            <dl className="profile__facts">
              <div>
                <dt>Email</dt>
                <dd>{admin.email}</dd>
              </div>
              <div>
                <dt>Username</dt>
                <dd>{admin.username}</dd>
              </div>
              <div>
                <dt>Joined</dt>
                <dd>{formatLongDate(admin.joined)}</dd>
              </div>
              <div>
                <dt>Last sign-in</dt>
                <dd>{formatDateTime(admin.lastSignIn)}</dd>
              </div>
            </dl>
          </section>

          <section className="card card--pad">
            <h2 className="card__title">End your session</h2>
            <p className="card__sub">Sign out when you’re done, especially on a shared device.</p>
            <button type="button" className="btn btn--soft-danger btn--block" onClick={handleLogout}>
              <Icon name="logout" size={18} /> Logout
            </button>
          </section>
        </div>

        <div className="stack">
          <form className="card card--pad" onSubmit={saveUsername} noValidate>
            <h2 className="card__title">Change username</h2>
            <p className="card__sub">This is the username you use to log in.</p>
            <label className="field">
              <span className="field__label">Username</span>
              <span className={`input input--icon${usernameError ? ' is-invalid' : ''}`}>
                <Icon name="user" size={18} />
                <input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameError('');
                  }}
                  autoComplete="username"
                />
              </span>
              <span className="field__hint">Use 3–30 characters: letters, numbers, dots or underscores.</span>
              {usernameError && <span className="field__error">{usernameError}</span>}
            </label>
            <button type="submit" className="btn btn--yellow">
              <Icon name="check" size={18} strokeWidth={2.2} /> Save username
            </button>
          </form>

          <form className="card card--pad" onSubmit={savePassword} noValidate>
            <h2 className="card__title">Change password</h2>
            <p className="card__sub">Keep your account protected with a unique password.</p>

            <label className="field">
              <span className="field__label">Current password</span>
              <span className={`input input--icon${pwErrors.current ? ' is-invalid' : ''}`}>
                <Icon name="lock" size={18} />
                <input type="password" value={pw.current} onChange={setField('current')} autoComplete="current-password" />
              </span>
              {pwErrors.current && <span className="field__error">{pwErrors.current}</span>}
            </label>

            <label className="field">
              <span className="field__label">New password</span>
              <span className={`input input--icon${pwErrors.next ? ' is-invalid' : ''}`}>
                <Icon name="lock" size={18} />
                <input type="password" value={pw.next} onChange={setField('next')} autoComplete="new-password" />
              </span>
              <span className="field__hint">Use at least 12 characters with a number and a symbol.</span>
              {pwErrors.next && <span className="field__error">{pwErrors.next}</span>}
            </label>

            <label className="field">
              <span className="field__label">Confirm new password</span>
              <span className={`input input--icon${pwErrors.confirm ? ' is-invalid' : ''}`}>
                <Icon name="lock" size={18} />
                <input type="password" value={pw.confirm} onChange={setField('confirm')} autoComplete="new-password" />
              </span>
              {pwErrors.confirm && <span className="field__error">{pwErrors.confirm}</span>}
            </label>

            <p className="notice notice--inline">
              <Icon name="shield" size={16} /> Never reuse a password from another account.
            </p>

            <button type="submit" className="btn btn--yellow">
              <Icon name="check" size={18} strokeWidth={2.2} /> Update password
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
