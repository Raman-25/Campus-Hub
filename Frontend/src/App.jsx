import { useEffect, useState, useCallback } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfessorDashboard from './pages/ProfessorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Toast from './components/Toast';
import { apiRequest, setUnauthorizedHandler } from './services/api';


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

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole');
    if (token && role) {
      const name = localStorage.getItem('userName') ?? undefined;
      return { role, name };
    }
    return null;
  });

  const handleLogout = useCallback(async (isUnauthorized = false) => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {
      // Continue clearing local state even if backend logout fails
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    setUser(null);
    setPage('login');
    if (isUnauthorized) {
      setToast({ type: 'error', message: 'Session expired or unauthorized. Please log in again.' });
    } else {
      setToast({ type: 'success', message: 'Successfully logged out.' });
    }
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      handleLogout(true);
    });
  }, [handleLogout]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  async function handleLogin(role, { email, password, endpoint }) {
    const data = await apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userRole', role);
    if (data.name) {
      localStorage.setItem('userName', data.name);
    }

    setUser({ role, id: data.id, name: data.name });
    setToast({ type: 'success', message: `Welcome back! Signed in as ${role}.` });
  }

  async function handleRegister(role, payload) {
    const { endpoint, ...body } = payload;
    await apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    // RegisterPage shows its own success screen; no toast needed here.
  }

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

  if (user && user.role === 'professor') {
    return (
      <div className="relative">
        <Toast toast={toast} onClear={() => setToast(null)} />
        <ProfessorDashboard
          user={user}
          onLogout={() => handleLogout(false)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((d) => !d)}
          onToast={setToast}
        />
      </div>
    );
  }

  if (user && user.role === 'student') {
    return (
      <div className="relative">
        <Toast toast={toast} onClear={() => setToast(null)} />
        <StudentDashboard
          user={user}
          onLogout={() => handleLogout(false)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((d) => !d)}
          onToast={setToast}
        />
      </div>
    );
  }

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
