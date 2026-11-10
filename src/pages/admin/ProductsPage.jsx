import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon';
import StatusPill from '../../components/StatusPill';
import { ConfirmDialog } from '../../components/Modal';
import { useToast } from '../../components/Toast';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../lib/format';

const PAGE_SIZE = 6;
const FILTERS = [
  { value: 'all', label: 'All status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

export default function ProductsPage() {
  const { products, deleteProduct } = useApp();
  const toast = useToast();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenuOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (status === 'all' || p.status === status) &&
        (!q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
    );
  }, [products, query, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (current - 1) * PAGE_SIZE + 1;
  const to = Math.min(current * PAGE_SIZE, filtered.length);

  const confirmDelete = () => {
    deleteProduct(toDelete.id);
    toast(`${toDelete.name} deleted.`);
    setToDelete(null);
  };

  return (
    <>
      <div className="page-head page-head--split">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-lead">Keep your menu fresh. Manage descriptions, prices and visibility.</p>
        </div>
        <Link to="/admin/products/new" className="btn btn--yellow">
          <Icon name="plus" size={18} strokeWidth={2.2} /> Add Product
        </Link>
      </div>

      <div className="toolbar">
        <label className="input input--icon toolbar__search">
          <Icon name="search" size={18} />
          <input
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            aria-label="Search products"
          />
        </label>

        <div className="select" ref={menuRef}>
          <button type="button" className="select__button" aria-haspopup="listbox" aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
            <Icon name="chevronDown" size={16} strokeWidth={2.2} />
            {FILTERS.find((f) => f.value === status).label}
          </button>
          {menuOpen && (
            <ul className="select__menu" role="listbox">
              {FILTERS.map((f) => (
                <li key={f.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={f.value === status}
                    className={f.value === status ? 'is-selected' : ''}
                    onClick={() => {
                      setStatus(f.value);
                      setPage(1);
                      setMenuOpen(false);
                    }}
                  >
                    {f.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="list-meta">
        <strong>All products ({filtered.length})</strong>
        <span>Prices in USD · Sample menu</span>
      </div>

      <div className="card table-card">
        <div className="table-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img className="table__thumb" src={p.image} alt={p.name} />
                  </td>
                  <td className="table__name">{p.name}</td>
                  <td className="table__desc">{p.description}</td>
                  <td className="table__price">{formatPrice(p.price)}</td>
                  <td>
                    <StatusPill status={p.status} />
                  </td>
                  <td>
                    <div className="table__actions">
                      <button type="button" className="btn btn--outline btn--sm" onClick={() => navigate(`/admin/products/${p.id}`)}>
                        <Icon name="edit" size={16} /> Edit
                      </button>
                      <button type="button" className="btn btn--soft-danger btn--sm" onClick={() => setToDelete(p)}>
                        <Icon name="trash" size={16} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visible.length === 0 && (
          <p className="empty">
            {products.length === 0
              ? 'Your menu is empty. Add a product to show it on your website.'
              : 'No products match your search. Try a different name or status.'}
          </p>
        )}
      </div>

      <div className="pager">
        <span>
          Showing {from}–{to} of {filtered.length}
        </span>
        <div className="pager__buttons">
          <button type="button" className="pager__btn" onClick={() => setPage(current - 1)} disabled={current === 1} aria-label="Previous page">
            <Icon name="chevronLeft" size={16} strokeWidth={2.2} />
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button key={n} type="button" className={`pager__btn${n === current ? ' is-current' : ''}`} onClick={() => setPage(n)} aria-current={n === current ? 'page' : undefined}>
              {n}
            </button>
          ))}
          <button type="button" className="pager__btn" onClick={() => setPage(current + 1)} disabled={current === pages} aria-label="Next page">
            <Icon name="chevronRight" size={16} strokeWidth={2.2} />
          </button>
        </div>
      </div>

      <p className="notice">
        <Icon name="info" size={18} />
        Active products appear on your public website. Inactive products stay saved here until you’re ready.
      </p>

      {toDelete && (
        <ConfirmDialog
          title="Delete this product?"
          message={`${toDelete.name} will be removed from your menu and your public website. This can’t be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  );
}
