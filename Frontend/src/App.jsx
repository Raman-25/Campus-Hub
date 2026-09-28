import { useEffect, useState, useCallback } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import Toast from './components/Toast';
import { setUnauthorizedHandler, extractErrorMessage } from './services/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export default function App() {
  const [page, setPage] = useState('login'); // 'login' | 'register'
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });
  const [toast, setToast] = useState(null);

  // Restore authenticated session if tokens are in localStorage
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole');
    if (token && role) {
      return { role };
    }
    return null;
  });

  const handleLogout = useCallback((isUnauthorized = false) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    setUser(null);
    setPage('login');
    if (isUnauthorized) {
      setToast({ type: 'error', message: 'Session expired or unauthorized. Please log in again.' });
    } else {
      setToast({ type: 'success', message: 'Successfully logged out.' });
    }
  }, []);

  // Wire API 401 unauthorized handler
  useEffect(() => {
    setUnauthorizedHandler(() => {
      handleLogout(true);
    });
  }, [handleLogout]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Performs the real login call. Throws an Error with a user-facing
  // message on failure so LoginPage can show it inline.
  async function handleLogin(role, { email, password, endpoint }) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = extractErrorMessage(data, data?.message || 'Invalid email or password.');
      throw new Error(errorMsg);
    }

    // data: { id, accessToken, refreshToken }
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userRole', role);

    setUser({ role, id: data.id });
    setToast({ type: 'success', message: `Welcome back! Signed in as ${role}.` });
  }

  async function handleRegister(role, payload) {
    const { endpoint, ...body } = payload;
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = extractErrorMessage(data, data?.message || 'Registration failed. Please try again.');
      throw new Error(errorMsg);
    }
    // RegisterPage shows its own success screen; no toast needed here.
  }

  // If logged in as admin, display the Admin Dashboard
  if (user && user.role === 'admin') {
    return (
      <div className="relative">
        <Toast toast={toast} onClear={() => setToast(null)} />
        <AdminDashboard
          onLogout={() => handleLogout(false)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((d) => !d)}
          onToast={setToast}
        />
      </div>
    );
  }

  // Otherwise show login/register UI (untouched)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setDarkMode((d) => !d)}
        className="fixed top-5 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur shadow-sm text-ink dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? '\u2600\ufe0f' : '\ud83c\udf19'}
      </button>

      <Toast toast={toast} onClear={() => setToast(null)} />

      {page === 'login' ? (
        <LoginPage onLogin={handleLogin} onNavigateToRegister={() => setPage('register')} />
      ) : (
        <RegisterPage onRegister={handleRegister} onNavigateToLogin={() => setPage('login')} />
      )}
    </div>
  );
}
