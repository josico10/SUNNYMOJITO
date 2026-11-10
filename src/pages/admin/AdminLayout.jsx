import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import Logo from '../../components/Logo';
import { useApp } from '../../context/AppContext';
import { initials } from '../../lib/format';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/admin/products', label: 'Products', icon: 'cup' },
  { to: '/admin/gallery', label: 'Gallery', icon: 'gallery' },
  { to: '/admin/contacts', label: 'Contacts', icon: 'contacts' },
  { to: '/admin/settings', label: 'Settings', icon: 'settings' },
  { to: '/admin/profile', label: 'Admin Profile', icon: 'user' },
];

function pageName(pathname) {
  if (pathname.startsWith('/admin/products')) return 'Products';
  if (pathname.startsWith('/admin/gallery')) return 'Gallery';
  if (pathname.startsWith('/admin/contacts')) return 'Contacts';
  if (pathname.startsWith('/admin/settings')) return 'Settings';
  if (pathname.startsWith('/admin/profile')) return 'Admin Profile';
  return 'Dashboard';
}

export default function AdminLayout() {
  const { admin, logout, storageFull } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin">
      <aside className={`sidebar${open ? ' is-open' : ''}`}>
        <div className="sidebar__brand">
          <Logo tone="light" />
        </div>
        <p className="sidebar__label">Website workspace</p>

        <nav className="sidebar__nav" aria-label="Admin">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar__link${isActive ? ' is-active' : ''}`}
            >
              <Icon name={item.icon} size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__promo">
          <Icon name="sun" size={20} />
          <strong>A little more sunshine.</strong>
          <p>Your public website, one click away.</p>
          <Link to="/" target="_blank" rel="noreferrer">
            View website <Icon name="arrowUpRight" size={14} />
          </Link>
        </div>

        <button type="button" className="sidebar__logout" onClick={handleLogout}>
          <Icon name="logout" size={20} />
          Logout
        </button>
      </aside>

      {open && <button type="button" className="admin__scrim" aria-label="Close menu" onClick={() => setOpen(false)} />}

      <div className="admin__main">
        <header className="topbar">
          <button type="button" className="topbar__menu" onClick={() => setOpen(true)} aria-label="Open menu">
            <Icon name="menu" size={22} />
          </button>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <span>Workspace</span>
            <Icon name="chevronRight" size={14} strokeWidth={2.2} />
            <strong>{pageName(location.pathname)}</strong>
          </nav>
          <div className="topbar__user">
            <span className="topbar__live">Website live</span>
            <span className="avatar avatar--sm">{initials(admin.name)}</span>
            <span className="topbar__who">
              <strong>{admin.name}</strong>
              <small>{admin.role}</small>
            </span>
          </div>
        </header>

        <main className="admin__content">
          {storageFull && (
            <div className="notice notice--warn" role="alert">
              <Icon name="info" size={18} />
              <span>Your browser storage is full, so the latest changes won’t be saved after you close this tab. Delete a few large photos to free space.</span>
            </div>
          )}
          <Outlet />
        </main>

        <footer className="admin__footer">
          <span>© 2026 SUNNY MOJITO</span>
          <span>Admin workspace</span>
        </footer>
      </div>
    </div>
  );
}
