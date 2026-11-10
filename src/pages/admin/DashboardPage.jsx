import { Link } from 'react-router-dom';
import Icon from '../../components/Icon';
import StatusPill from '../../components/StatusPill';
import { useApp } from '../../context/AppContext';
import { formatPrice, greeting } from '../../lib/format';

const BAR_TONES = ['lime', 'lime', 'leaf', 'dark'];
const DEVICE_TONES = ['dark', 'lime', 'yellow'];

export default function DashboardPage() {
  const { admin, products, gallery, stats } = useApp();
  const active = products.filter((p) => p.status === 'active').length;
  const inactive = products.length - active;
  const latest = products.slice(0, 4);
  const firstName = admin.name.split(' ')[0];

  return (
    <>
      <div className="page-head page-head--split">
        <div>
          <h1 className="page-title">
            {greeting()}, {firstName} <Icon name="sun" size={30} className="page-title__sun" />
          </h1>
          <p className="page-lead">Here’s a fresh look at your SUNNY MOJITO website.</p>
        </div>
        <span className="chip">
          <Icon name="calendar" size={18} /> {stats.month}
        </span>
      </div>

      <div className="grid grid--3">
        <article className="card stat">
          <header>
            <span>Total Products</span>
            <span className="stat__icon">
              <Icon name="cup" size={20} />
            </span>
          </header>
          <strong>{products.length}</strong>
          <small>
            {active} active · {inactive} inactive
          </small>
        </article>
        <article className="card stat">
          <header>
            <span>Total Gallery</span>
            <span className="stat__icon">
              <Icon name="gallery" size={20} />
            </span>
          </header>
          <strong>{gallery.length}</strong>
          <small>
            {gallery.length} {gallery.length === 1 ? 'photo' : 'photos'} on your website
          </small>
        </article>
        <article className="card stat">
          <header>
            <span>Total Visitors</span>
            <span className="stat__icon">
              <Icon name="users" size={20} />
            </span>
          </header>
          <strong>{stats.totalVisitors.toLocaleString('en-US')}</strong>
          <small>
            <Icon name="arrowUpRight" size={12} strokeWidth={2.2} /> {stats.change.toFixed(1)}% compared with {stats.previousMonth}
          </small>
        </article>
      </div>

      <div className="dash-row">
        <section className="card chart-card">
          <h2 className="card__title">Website statistics</h2>
          <p className="card__sub">Visitor growth · {stats.month}</p>

          <div className="chart__legend">
            <span>
              <i className="dot dot--leaf" /> Unique visitors
            </span>
            <span className="chart__trend">
              <Icon name="trend" size={14} /> {stats.change.toFixed(1)}% vs {stats.previousMonth.slice(0, 3)}
            </span>
          </div>

          <div className="chart" role="img" aria-label={`Weekly unique visitors: ${stats.weeks.map((w) => `${w.label} ${w.value}`).join(', ')}`}>
            <div className="chart__axis" aria-hidden="true">
              <span>5k</span>
              <span>2.5k</span>
              <span>0</span>
            </div>
            <div className="chart__bars">
              {stats.weeks.map((week, i) => (
                <div key={week.label} className="chart__col">
                  <span className="chart__value">{week.value.toLocaleString('en-US')}</span>
                  <div className={`chart__bar chart__bar--${BAR_TONES[i % BAR_TONES.length]}`} style={{ height: `${(week.value / 5000) * 100}%` }} />
                  <span className="chart__label">{week.label}</span>
                </div>
              ))}
            </div>
          </div>

          <dl className="chart__totals">
            <div>
              <dt>Page views</dt>
              <dd>{stats.pageViews.toLocaleString('en-US')}</dd>
            </div>
            <div>
              <dt>Avg. visit</dt>
              <dd>{stats.avgVisit}</dd>
            </div>
          </dl>
        </section>

        <section className="card audience-card">
          <h2 className="card__title">Your audience</h2>
          <p className="card__sub">Visitors by device</p>
          <div className="split-bar" aria-hidden="true">
            {stats.devices.map((d, i) => (
              <span key={d.label} className={`split-bar__seg split-bar__seg--${DEVICE_TONES[i]}`} style={{ flexGrow: d.value }} />
            ))}
          </div>
          <ul className="device-list">
            {stats.devices.map((d, i) => (
              <li key={d.label}>
                <span>
                  <i className={`dot dot--${DEVICE_TONES[i]}`} /> {d.label}
                </span>
                <strong>{d.value}%</strong>
              </li>
            ))}
          </ul>
          <p className="audience-card__note">
            <Icon name="trend" size={18} />
            Your busiest week brought {stats.busiestWeek.toLocaleString('en-US')} visitors to the sunny side.
          </p>
        </section>
      </div>

      <section className="card latest">
        <div className="latest__head">
          <h2 className="card__title">Latest products</h2>
          <Link to="/admin/products" className="text-link">
            View all <Icon name="arrowRight" size={14} />
          </Link>
        </div>
        {latest.length === 0 ? (
          <p className="empty">No products yet. <Link to="/admin/products/new" className="text-link">Add your first product</Link></p>
        ) : (
          <ul className="latest__list">
            {latest.map((p) => (
              <li key={p.id}>
                <img src={p.image} alt="" />
                <div>
                  <strong>{p.name}</strong>
                  <span>{formatPrice(p.price)} USD</span>
                  <StatusPill status={p.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
