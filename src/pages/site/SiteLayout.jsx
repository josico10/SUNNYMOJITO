import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Icon from '../../components/Icon';
import Logo from '../../components/Logo';
import { useApp } from '../../context/AppContext';
import { instagramLink, whatsappLink } from '../../lib/format';

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'products', label: 'Products' },
  { id: 'ingredients', label: 'Ingredients' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
];

function useActiveSection() {
  const [active, setActive] = useState('home');
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (sections.length === 0 || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id));
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);
  return active;
}

export default function SiteLayout() {
  const { contacts, settings } = useApp();
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const orderUrl = whatsappLink(contacts.whatsapp, `Hi ${settings.brandName}! I’d like to place an order.`);

  return (
    <div className="site">
      <header className="nav">
        <div className="container nav__inner">
          <a href="#home" className="nav__brand" aria-label={`${settings.brandName} home`}>
            <Logo />
          </a>

          <nav className={`nav__links${open ? ' is-open' : ''}`} aria-label="Main">
            {LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`} className={active === l.id ? 'is-active' : ''} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <a href={orderUrl} target="_blank" rel="noreferrer" className="btn btn--dark btn--sm nav__order">
              Order Now
            </a>
          </nav>

          <button type="button" className="nav__toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <Icon name={open ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer__top">
            <div>
              <Logo tone="light" />
              <p className="footer__tagline">{settings.tagline}</p>
              <p className="footer__text">Fresh flavors. Happy moments.</p>
            </div>
            <div className="footer__cols">
              <div>
                <h3>Explore</h3>
                <ul className="footer__grid">
                  {LINKS.map((l) => (
                    <li key={l.id}>
                      <a href={`#${l.id}`}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Say hello</h3>
                <ul>
                  <li>
                    <a href={instagramLink(contacts.instagram)} target="_blank" rel="noreferrer">
                      Instagram <Icon name="arrowUpRight" size={12} />
                    </a>
                  </li>
                  <li>
                    <a href={whatsappLink(contacts.whatsapp)} target="_blank" rel="noreferrer">
                      WhatsApp <Icon name="arrowUpRight" size={12} />
                    </a>
                  </li>
                  <li>
                    <a href={`mailto:${contacts.email}`}>
                      Email <Icon name="arrowUpRight" size={12} />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer__bottom">
            <span>© 2026 {settings.brandName}. All rights reserved.</span>
            <Link to="/admin" className="footer__admin">
              Admin login
            </Link>
            <span className="footer__sun">
              <Icon name="sun" size={16} /> Stay on the sunny side
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
