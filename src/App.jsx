import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? 'dashboard' : 'login';
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('registeredUsers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        return null;
      }

      const saved = localStorage.getItem('currentUser');

      if (saved) {
        return JSON.parse(saved);
      }

      return null;
    } catch {
      return null;
    }
  });

  const handleNavigate = (page, email, name) => {
    setCurrentPage(page);

    // Logout / navigate to login
    if (page === 'login') {
      setUser(null);

      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userEmail');

      return;
    }

    // Navigate to signup
    if (page === 'signup') {
      return;
    }

    // Navigate to dashboard
    if (page === 'dashboard') {
      if (email) {
        const currentUser = {
          id: user?.id,
          full_name: name || user?.full_name || '',
          email,
        };

        setUser(currentUser);

        localStorage.setItem(
          'currentUser',
          JSON.stringify(currentUser)
        );

        localStorage.setItem('userEmail', email);

        // Keep frontend registered-user data if needed
        const existingUser = registeredUsers.find(
          (u) => u.email?.toLowerCase() === email.toLowerCase()
        );

        if (!existingUser) {
          const newUser = {
            email,
            name: name || '',
          };

          const updatedUsers = [...registeredUsers, newUser];

          setRegisteredUsers(updatedUsers);

          localStorage.setItem(
            'registeredUsers',
            JSON.stringify(updatedUsers)
          );
        }

        return;
      }

      // Dashboard navigation without an email:
      // restore the already logged-in user only.
      try {
        const saved = localStorage.getItem('currentUser');

        if (saved) {
          setUser(JSON.parse(saved));
        }
      } catch {
        setUser(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {currentPage === 'login' ? (
        <Login onNavigate={handleNavigate} />
      ) : currentPage === 'signup' ? (
        <Signup onNavigate={handleNavigate} />
      ) : (
        <Dashboard
          onNavigate={handleNavigate}
          user={user}
        />
      )}

      {/* Floating Development view switcher */}
      <div className="fixed bottom-3 right-3 bg-slate-900/80 border border-slate-800 rounded-md p-1 shadow-lg backdrop-blur-sm z-[9999] flex items-center gap-1 text-[9px] font-bold select-none opacity-40 hover:opacity-100 transition-opacity">
        <span className="text-slate-500 px-1.5 uppercase tracking-wider text-[8px]">
          Dev
        </span>

        <button
          onClick={() => handleNavigate('login')}
          className={`px-1.5 py-0.5 rounded transition ${
            currentPage === 'login'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          Login
        </button>

        <button
          onClick={() => handleNavigate('signup')}
          className={`px-1.5 py-0.5 rounded transition ${
            currentPage === 'signup'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          Signup
        </button>

        <button
          onClick={() => handleNavigate('dashboard')}
          className={`px-1.5 py-0.5 rounded transition ${
            currentPage === 'dashboard'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}

export default App;