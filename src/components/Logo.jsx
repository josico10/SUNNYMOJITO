import { useApp } from '../context/AppContext';

/**
 * Brand mark. Shows the logo uploaded in Settings when there is one,
 * otherwise the ring + wordmark from the design.
 */
export default function Logo({ tone = 'dark' }) {
  const { settings } = useApp();

  if (settings.logo) {
    return (
      <span className={`logo logo--${tone}`}>
        <img className="logo__image" src={settings.logo} alt={settings.brandName} />
      </span>
    );
  }

  const [first, ...rest] = settings.brandName.trim().split(/\s+/);
  return (
    <span className={`logo logo--${tone}`} aria-label={settings.brandName}>
      <span className="logo__ring" aria-hidden="true" />
      <span className="logo__word">
        <span className="logo__first">{first}</span>
        {rest.length > 0 && <span className="logo__rest">{rest.join(' ')}</span>}
      </span>
    </span>
  );
}
