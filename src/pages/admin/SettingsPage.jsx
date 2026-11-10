import { useRef, useState } from 'react';
import Icon from '../../components/Icon';
import { useToast } from '../../components/Toast';
import { useApp } from '../../context/AppContext';
import { formatBytes } from '../../lib/format';
import { readLogo } from '../../lib/image';

export default function SettingsPage() {
  const { settings, saveSettings } = useApp();
  const toast = useToast();
  const fileRef = useRef(null);
  const [form, setForm] = useState(settings);
  const [logoInfo, setLogoInfo] = useState(settings.logo ? 'Custom logo' : 'sunny-mojito-logo.svg · 12 KB · Transparent background');
  const [errors, setErrors] = useState({});

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const pickLogo = async (file) => {
    if (!file) return;
    try {
      const logo = await readLogo(file);
      setForm((f) => ({ ...f, logo: logo.src }));
      setLogoInfo(`${logo.name} · ${formatBytes(logo.size)}`);
      setErrors((e) => ({ ...e, logo: undefined }));
    } catch (err) {
      setErrors((e) => ({ ...e, logo: err.message }));
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.brandName.trim()) next.brandName = 'Enter your brand name.';
    if (!form.tagline.trim()) next.tagline = 'Enter a short tagline.';
    if (!form.description.trim()) next.description = 'Add a short website description.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    saveSettings({
      brandName: form.brandName.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      logo: form.logo,
    });
    toast('Settings saved.');
  };

  const cancel = () => {
    setForm(settings);
    setLogoInfo(settings.logo ? 'Custom logo' : 'sunny-mojito-logo.svg · 12 KB · Transparent background');
    setErrors({});
  };

  const [first, ...rest] = (form.brandName || '').trim().split(/\s+/);

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Settings</h1>
        <p className="page-lead">Shape the little details that make your brand feel like sunshine.</p>
      </div>

      <form onSubmit={submit} noValidate>
        <div className="two-col">
          <div className="stack">
            <section className="card card--pad">
              <h2 className="card__title">Brand identity</h2>
              <p className="card__sub">Your name and story, consistent across the website.</p>

              <label className="field">
                <span className="field__label">Brand name</span>
                <input className={`input${errors.brandName ? ' is-invalid' : ''}`} value={form.brandName} onChange={(e) => set('brandName', e.target.value)} />
                {errors.brandName && <span className="field__error">{errors.brandName}</span>}
              </label>

              <label className="field">
                <span className="field__label">Tagline</span>
                <input className={`input${errors.tagline ? ' is-invalid' : ''}`} value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
                {errors.tagline && <span className="field__error">{errors.tagline}</span>}
              </label>

              <label className="field">
                <span className="field__label">Website description</span>
                <textarea className={`input textarea${errors.description ? ' is-invalid' : ''}`} rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} />
                <span className="field__hint">Used in your website introduction and search preview.</span>
                {errors.description && <span className="field__error">{errors.description}</span>}
              </label>
            </section>

            <section className="card card--pad">
              <h2 className="card__title">Brand logo</h2>
              <p className="card__sub">Your logo appears in the website navigation and footer.</p>

              <div className="logo-row">
                <div className="logo-row__preview">
                  {form.logo ? (
                    <img src={form.logo} alt="Current logo" />
                  ) : (
                    <span className="logo logo--dark">
                      <span className="logo__ring" aria-hidden="true" />
                      <span className="logo__word">
                        <span className="logo__first">{first}</span>
                        {rest.length > 0 && <span className="logo__rest">{rest.join(' ')}</span>}
                      </span>
                    </span>
                  )}
                </div>
                <div>
                  <strong>{logoInfo.split(' · ')[0]}</strong>
                  <small>{logoInfo.split(' · ').slice(1).join(' · ')}</small>
                  <span className="logo-row__current">
                    <Icon name="check" size={14} strokeWidth={2.4} /> Current logo
                  </span>
                </div>
              </div>

              <div className="logo-actions">
                <button type="button" className="btn btn--outline" onClick={() => fileRef.current?.click()}>
                  <Icon name="upload" size={16} /> Change logo
                </button>
                <small>SVG or PNG · Up to 2 MB</small>
                {form.logo && (
                  <button
                    type="button"
                    className="text-btn"
                    onClick={() => {
                      set('logo', null);
                      setLogoInfo('sunny-mojito-logo.svg · 12 KB · Transparent background');
                    }}
                  >
                    Use the default logo
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/svg+xml,image/png"
                  hidden
                  onChange={(e) => {
                    pickLogo(e.target.files?.[0]);
                    e.target.value = '';
                  }}
                />
              </div>
              {errors.logo && <span className="field__error">{errors.logo}</span>}
            </section>
          </div>

          <aside className="editor__side">
            <section className="card card--pad">
              <h2 className="card__title">Website preview</h2>
              <p className="card__sub">How your brand comes together.</p>
              <div className="brand-preview">
                {form.logo ? (
                  <img className="brand-preview__logo" src={form.logo} alt="" />
                ) : (
                  <span className="logo logo--dark">
                    <span className="logo__ring" aria-hidden="true" />
                    <span className="logo__word">
                      <span className="logo__first">{first}</span>
                      {rest.length > 0 && <span className="logo__rest">{rest.join(' ')}</span>}
                    </span>
                  </span>
                )}
                <img className="brand-preview__photo" src="/images/hero.jpg" alt="" />
                <h3>{form.tagline}</h3>
                <p>{form.description}</p>
              </div>
            </section>
            <section className="tip tip--sun">
              <Icon name="sun" size={20} />
              <p>A clear name. A bright promise. One consistent {form.brandName || 'brand'}.</p>
            </section>
          </aside>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn--yellow">
            <Icon name="check" size={18} strokeWidth={2.2} /> Save settings
          </button>
          <button type="button" className="btn btn--outline" onClick={cancel}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
