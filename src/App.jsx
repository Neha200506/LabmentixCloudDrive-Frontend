import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {currentPage === 'login' ? (
        <Login onNavigate={handleNavigate} />
      ) : (
        <Signup onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;
