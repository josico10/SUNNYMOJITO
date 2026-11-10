import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { seed } from '../data/seed';

const DATA_KEY = 'sunny-mojito:data:v1';
const SESSION_KEY = 'sunny-mojito:session';

const AppContext = createContext(null);

function uid(prefix) {
  const random = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${random}`;
}

function loadData() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      return {
        ...seed,
        ...saved,
        contacts: { ...seed.contacts, ...saved.contacts },
        settings: { ...seed.settings, ...saved.settings },
        admin: { ...seed.admin, ...saved.admin },
      };
    }
  } catch {
    /* ignore a damaged save and start from the sample data */
  }
  return seed;
}

function loadSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function AppProvider({ children }) {
  const [data, setData] = useState(loadData);
  const [isAuthed, setIsAuthed] = useState(loadSession);
  const [storageFull, setStorageFull] = useState(false);

  useEffect(() => {
    try {
      const { stats, ...persisted } = data;
      localStorage.setItem(DATA_KEY, JSON.stringify(persisted));
      setStorageFull(false);
    } catch {
      setStorageFull(true);
    }
  }, [data]);

  /* ---------- auth ---------- */
  const login = useCallback(
    (username, password) => {
      const ok = username.trim().toLowerCase() === data.admin.username.toLowerCase() && password === data.admin.password;
      if (!ok) return false;
      setData((d) => ({ ...d, admin: { ...d.admin, lastSignIn: new Date().toISOString() } }));
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* session storage unavailable: the login still works for this tab */
      }
      setIsAuthed(true);
      return true;
    },
    [data.admin.username, data.admin.password],
  );

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* nothing to clear */
    }
    setIsAuthed(false);
  }, []);

  /* ---------- products ---------- */
  const saveProduct = useCallback((product) => {
    const today = new Date().toISOString().slice(0, 10);
    setData((d) => {
      if (product.id) {
        return {
          ...d,
          products: d.products.map((p) => (p.id === product.id ? { ...p, ...product, updatedAt: today } : p)),
        };
      }
      return { ...d, products: [{ ...product, id: uid('p'), updatedAt: today }, ...d.products] };
    });
  }, []);

  const deleteProduct = useCallback((id) => {
    setData((d) => ({ ...d, products: d.products.filter((p) => p.id !== id) }));
  }, []);

  /* ---------- gallery ---------- */
  const addPhotos = useCallback((photos) => {
    const today = new Date().toISOString().slice(0, 10);
    setData((d) => ({
      ...d,
      gallery: [...photos.map((p) => ({ id: uid('g'), name: p.name, size: p.size, date: today, src: p.src })), ...d.gallery],
    }));
  }, []);

  const deletePhoto = useCallback((id) => {
    setData((d) => ({ ...d, gallery: d.gallery.filter((g) => g.id !== id) }));
  }, []);

  /* ---------- contacts, settings ---------- */
  const saveContacts = useCallback((contacts) => setData((d) => ({ ...d, contacts })), []);
  const saveSettings = useCallback((settings) => setData((d) => ({ ...d, settings })), []);

  /* ---------- admin profile ---------- */
  const changeUsername = useCallback((username) => {
    setData((d) => ({ ...d, admin: { ...d.admin, username } }));
  }, []);

  const changePassword = useCallback(
    (current, next) => {
      if (current !== data.admin.password) return false;
      setData((d) => ({ ...d, admin: { ...d.admin, password: next } }));
      return true;
    },
    [data.admin.password],
  );

  const value = useMemo(
    () => ({
      ...data,
      isAuthed,
      storageFull,
      login,
      logout,
      saveProduct,
      deleteProduct,
      addPhotos,
      deletePhoto,
      saveContacts,
      saveSettings,
      changeUsername,
      changePassword,
    }),
    [data, isAuthed, storageFull, login, logout, saveProduct, deleteProduct, addPhotos, deletePhoto, saveContacts, saveSettings, changeUsername, changePassword],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
