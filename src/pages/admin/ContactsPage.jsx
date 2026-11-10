import { useState } from 'react';
import Icon from '../../components/Icon';
import { useToast } from '../../components/Toast';
import { useApp } from '../../context/AppContext';

export default function ContactsPage() {
  const { contacts, saveContacts } = useApp();
  const toast = useToast();
  const [form, setForm] = useState(contacts);
  const [errors, setErrors] = useState({});

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    const digits = form.whatsapp.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) next.whatsapp = 'Enter a valid number with the country code, for example +62 812 3456 7890.';
    if (!/^@?[A-Za-z0-9._]{1,30}$/.test(form.instagram.trim())) next.instagram = 'Use letters, numbers, dots or underscores, for example @sunny.mojito.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email address, for example hello@yourbrand.com.';
    if (!form.address.trim()) next.address = 'Enter your business address.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const clean = {
      whatsapp: form.whatsapp.trim(),
      instagram: `@${form.instagram.trim().replace(/^@/, '')}`,
      email: form.email.trim(),
      address: form.address.trim(),
    };
    saveContacts(clean);
    setForm(clean);
    toast('Contacts saved.');
  };

  const cancel = () => {
    setForm(contacts);
    setErrors({});
  };

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Contacts</h1>
        <p className="page-lead">Make it easy for customers to find you and say hello.</p>
      </div>

      <form onSubmit={submit} noValidate>
        <div className="two-col">
          <section className="card card--pad">
            <h2 className="card__title">Contact details</h2>
            <p className="card__sub">Update the contact information shown on your website.</p>

            <label className="field">
              <span className="field__label">WhatsApp number</span>
              <span className={`input input--icon${errors.whatsapp ? ' is-invalid' : ''}`}>
                <Icon name="chat" size={18} />
                <input value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} inputMode="tel" />
              </span>
              <span className="field__hint">Include the country code. Used for the website’s WhatsApp link.</span>
              {errors.whatsapp && <span className="field__error">{errors.whatsapp}</span>}
            </label>

            <label className="field">
              <span className="field__label">Instagram</span>
              <span className={`input input--icon${errors.instagram ? ' is-invalid' : ''}`}>
                <Icon name="instagram" size={18} />
                <input value={form.instagram} onChange={(e) => set('instagram', e.target.value)} />
              </span>
              {errors.instagram && <span className="field__error">{errors.instagram}</span>}
            </label>

            <label className="field">
              <span className="field__label">Email address</span>
              <span className={`input input--icon${errors.email ? ' is-invalid' : ''}`}>
                <Icon name="mail" size={18} />
                <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
              </span>
              {errors.email && <span className="field__error">{errors.email}</span>}
            </label>

            <label className="field">
              <span className="field__label">Business address</span>
              <span className={`input input--icon input--top${errors.address ? ' is-invalid' : ''}`}>
                <Icon name="pin" size={18} />
                <textarea rows={4} value={form.address} onChange={(e) => set('address', e.target.value)} />
              </span>
              <span className="field__hint">Illustrative contact values — replace these before publishing.</span>
              {errors.address && <span className="field__error">{errors.address}</span>}
            </label>
          </section>

          <aside className="editor__side">
            <section className="card card--pad">
              <h2 className="card__title">Website contact preview</h2>
              <p className="card__sub">A quick look at your public details.</p>
              <ul className="preview-list">
                {[
                  ['chat', 'WhatsApp', form.whatsapp],
                  ['instagram', 'Instagram', form.instagram],
                  ['mail', 'Email', form.email],
                  ['pin', 'Business address', form.address],
                ].map(([icon, label, value]) => (
                  <li key={label}>
                    <span className="preview-list__icon">
                      <Icon name={icon} size={18} />
                    </span>
                    <div>
                      <small>{label}</small>
                      <strong>{value || '—'}</strong>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="tip">
              <Icon name="chat" size={20} />
              <strong>Keep the conversation direct.</strong>
              <p>Customers connect through WhatsApp on your public website. Keep this number current so every sunny hello reaches you.</p>
            </section>
          </aside>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn--yellow">
            <Icon name="check" size={18} strokeWidth={2.2} /> Save contacts
          </button>
          <button type="button" className="btn btn--outline" onClick={cancel}>
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
