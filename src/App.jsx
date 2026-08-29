import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard'); // Default to dashboard for Day 9 testing
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('registeredUsers');
      return saved ? JSON.parse(saved) : [
        { email: 'alex.rivera@nexora.io', name: 'Alex Rivera' }
      ];
    } catch {
      return [{ email: 'alex.rivera@nexora.io', name: 'Alex Rivera' }];
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('currentUser');
      return saved ? JSON.parse(saved) : { email: 'alex.rivera@nexora.io', name: 'Alex Rivera' };
    } catch {
      return { email: 'alex.rivera@nexora.io', name: 'Alex Rivera' };
    }
  });

  const handleNavigate = (page, email, name) => {
    setCurrentPage(page);
    if (page === 'login') {
      setUser(null);
      localStorage.removeItem('currentUser');
    } else if (page === 'dashboard') {
      if (email) {
        const existingUser = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (existingUser) {
          setUser(existingUser);
          localStorage.setItem('currentUser', JSON.stringify(existingUser));
        } else {
          // Do not derive display name from email. Use fallback "Nexora User" if no name provided.
          const displayName = name || "Nexora User";
          const newUser = { email, name: displayName };
          
          const updatedUsers = [...registeredUsers, newUser];
          setRegisteredUsers(updatedUsers);
          localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
          
          setUser(newUser);
          localStorage.setItem('currentUser', JSON.stringify(newUser));
        }
      } else if (!user) {
        const defaultUser = { email: 'alex.rivera@nexora.io', name: 'Alex Rivera' };
        setUser(defaultUser);
        localStorage.setItem('currentUser', JSON.stringify(defaultUser));
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
        <Dashboard onNavigate={handleNavigate} user={user} />
      )}

      {/* Floating Development view switcher */}
      <div className="fixed bottom-3 right-3 bg-slate-900/80 border border-slate-800 rounded-md p-1 shadow-lg backdrop-blur-sm z-[9999] flex items-center gap-1 text-[9px] font-bold select-none opacity-40 hover:opacity-100 transition-opacity">
        <span className="text-slate-500 px-1.5 uppercase tracking-wider text-[8px]">Dev</span>
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

