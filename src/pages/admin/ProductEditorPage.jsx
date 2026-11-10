import { useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import Icon from '../../components/Icon';
import { useToast } from '../../components/Toast';
import { useApp } from '../../context/AppContext';
import { formatBytes, formatDate } from '../../lib/format';
import { readPhoto } from '../../lib/image';

export default function ProductEditorPage() {
  const { id } = useParams();
  const { products, saveProduct } = useApp();
  const existing = id ? products.find((p) => p.id === id) : null;

  if (id && !existing) return <Navigate to="/admin/products" replace />;
  return <Editor key={id || 'new'} existing={existing} saveProduct={saveProduct} />;
}

function Editor({ existing, saveProduct }) {
  const navigate = useNavigate();
  const toast = useToast();
  const fileRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const [form, setForm] = useState({
    name: existing?.name ?? '',
    description: existing?.description ?? '',
    price: existing ? existing.price.toFixed(2) : '',
    status: existing?.status ?? 'active',
    image: existing?.image ?? '',
    imageName: existing?.imageName ?? '',
    imageMeta: existing?.imageMeta ?? '',
  });
  const [errors, setErrors] = useState({});

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleFile = async (file) => {
    if (!file) return;
    try {
      const photo = await readPhoto(file);
      setForm((f) => ({
        ...f,
        image: photo.src,
        imageName: photo.name,
        imageMeta: `${formatBytes(photo.size)} · ${photo.width} × ${photo.height} px`,
      }));
      setErrors((e) => ({ ...e, image: undefined }));
    } catch (err) {
      setErrors((e) => ({ ...e, image: err.message }));
    }
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Enter a product name.';
    if (!form.description.trim()) next.description = 'Add a short description of the flavor.';
    const price = Number(form.price);
    if (form.price === '' || Number.isNaN(price) || price <= 0) next.price = 'Enter a price greater than 0, for example 4.50.';
    if (!form.image) next.image = 'Add a product photo.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    saveProduct({
      ...(existing || {}),
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(Number(form.price).toFixed(2)),
      status: form.status,
      image: form.image,
      imageName: form.imageName,
      imageMeta: form.imageMeta,
    });
    toast(existing ? `${form.name.trim()} saved.` : `${form.name.trim()} added to your menu.`);
    navigate('/admin/products');
  };

  return (
    <>
      <div className="page-head page-head--split">
        <div>
          <h1 className="page-title">Product editor</h1>
          <p className="page-lead">Create a new product or update an existing favorite.</p>
        </div>
        <Link to="/admin/products" className="btn btn--outline">
          <Icon name="arrowLeft" size={16} /> Back to products
        </Link>
      </div>

      <div className="banner">
        <Icon name="edit" size={18} />
        <div>
          <strong>{existing ? `Editing ${existing.name}` : 'New product'}</strong>
          <small>{existing ? `Last updated ${formatDate(existing.updatedAt)}` : 'Fill in the details below, then save.'}</small>
        </div>
      </div>

      <form onSubmit={submit} noValidate>
        <div className="editor">
          <section className="card card--pad">
            <h2 className="card__title">Product details</h2>
            <p className="card__sub">The essentials customers see on your website.</p>

            <label className="field">
              <span className="field__label">Product name</span>
              <input className={`input${errors.name ? ' is-invalid' : ''}`} value={form.name} onChange={(e) => set('name', e.target.value)} />
              {errors.name && <span className="field__error">{errors.name}</span>}
            </label>

            <label className="field">
              <span className="field__label">Description</span>
              <textarea className={`input textarea${errors.description ? ' is-invalid' : ''}`} rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} />
              <span className="field__hint">Describe the flavor and what makes this drink special.</span>
              {errors.description && <span className="field__error">{errors.description}</span>}
            </label>

            <label className="field">
              <span className="field__label">Price (USD)</span>
              <span className={`input input--prefix${errors.price ? ' is-invalid' : ''}`}>
                <span aria-hidden="true">$</span>
                <input inputMode="decimal" value={form.price} onChange={(e) => set('price', e.target.value.replace(/[^0-9.]/g, ''))} placeholder="0.00" />
              </span>
              <span className="field__hint">Use a decimal price, for example 4.50.</span>
              {errors.price && <span className="field__error">{errors.price}</span>}
            </label>

            <fieldset className="field">
              <legend className="field__label">Status</legend>
              <div className="radio-row">
                {['active', 'inactive'].map((value) => (
                  <label key={value} className={`radio${form.status === value ? ' is-checked' : ''}`}>
                    <input type="radio" name="status" value={value} checked={form.status === value} onChange={() => set('status', value)} />
                    <span className="radio__dot" />
                    {value === 'active' ? 'Active' : 'Inactive'}
                  </label>
                ))}
              </div>
              <span className="field__hint">Active products are visible on the public menu.</span>
            </fieldset>
          </section>

          <aside className="editor__side">
            <section className="card card--pad">
              <h2 className="card__title">Product image</h2>
              <p className="card__sub">A fresh photo makes all the difference.</p>

              {form.image ? (
                <img className="editor__photo" src={form.image} alt="Product preview" />
              ) : (
                <div className="editor__photo editor__photo--empty">
                  <Icon name="image" size={34} />
                  <span>No photo yet</span>
                </div>
              )}

              {form.image && (
                <div className="file-row">
                  <Icon name="image" size={18} />
                  <div>
                    <strong>{form.imageName}</strong>
                    <small>{form.imageMeta}</small>
                  </div>
                  <Icon name="checkCircle" size={20} className="file-row__ok" />
                </div>
              )}

              <div
                className={`dropzone${dragging ? ' is-dragging' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  handleFile(e.dataTransfer.files?.[0]);
                }}
              >
                <Icon name="cloudUpload" size={26} />
                <strong>Upload or drop a new image</strong>
                <small>JPG, PNG or WebP · Up to 5 MB</small>
                <button type="button" className="btn btn--outline btn--sm" onClick={() => fileRef.current?.click()}>
                  {form.image ? 'Change image' : 'Choose image'}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  onChange={(e) => {
                    handleFile(e.target.files?.[0]);
                    e.target.value = '';
                  }}
                />
              </div>
              {errors.image && <span className="field__error">{errors.image}</span>}
            </section>

            <p className="notice">
              <Icon name="eye" size={18} />
              Your photo preview uses the same image shown on the public menu.
            </p>
          </aside>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn--yellow">
            <Icon name="check" size={18} strokeWidth={2.2} /> Save product
          </button>
          <Link to="/admin/products" className="btn btn--outline">
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
