import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useApp } from './context/AppContext';

import SiteLayout from './pages/site/SiteLayout';
import HomePage from './pages/site/HomePage';

import AdminLayout from './pages/admin/AdminLayout';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsPage from './pages/admin/ProductsPage';
import ProductEditorPage from './pages/admin/ProductEditorPage';
import GalleryPage from './pages/admin/GalleryPage';
import ContactsPage from './pages/admin/ContactsPage';
import SettingsPage from './pages/admin/SettingsPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';

function RequireAuth({ children }) {
  const { isAuthed } = useApp();
  const location = useLocation();
  if (!isAuthed) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return children;
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public website (user side) */}
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
        </Route>

        {/* Admin workspace */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<ProductEditorPage />} />
          <Route path="products/:id" element={<ProductEditorPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
