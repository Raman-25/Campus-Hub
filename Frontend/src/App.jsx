import { useEffect, useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Toast from './components/Toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export default function App() {
  const [page, setPage] = useState('login'); // 'login' | 'register'
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
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
      throw new Error(data.message || 'Invalid email or password.');
    }

    // data: { id, accessToken, refreshToken }
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setToast({ type: 'success', message: `Welcome back! Signed in as ${role}.` });
    // Hand off to your router / dashboard here, e.g.:
    // navigate(`/${role}/dashboard`);
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
      throw new Error(data.message || 'Registration failed. Please try again.');
    }
    // RegisterPage shows its own success screen; no toast needed here.
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setDarkMode((d) => !d)}
        className="fixed top-5 left-5 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 shadow-card text-ink dark:text-white"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
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
