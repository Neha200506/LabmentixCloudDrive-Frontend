import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ResetPassword from './pages/ResetPassword';

function App() {
  const [resetToken] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('token') || params.get('reset_token') || '';
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenInUrl = params.get('token') || params.get('reset_token');
    if (tokenInUrl || window.location.pathname === '/reset-password') {
      return 'reset-password';
    }
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
      ) : currentPage === 'reset-password' ? (
        <ResetPassword token={resetToken} onNavigate={handleNavigate} />
      ) : (
        <Dashboard
          onNavigate={handleNavigate}
          user={user}
        />
      )}
    </div>
  );
}

export default App;