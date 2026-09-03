import { SearchIcon } from '../Icons';

export default function DashboardHeader({
  setIsSidebarOpen,
  searchQuery,
  setSearchQuery,
  isProfileOpen,
  setIsProfileOpen,
  initials,
  displayName,
  displayUser,
  onNavigate,
}) {
  return (
    <header className="h-16 px-6 flex items-center justify-between gap-4 shrink-0 bg-[#070b13]/40 border-b border-slate-900/40">
      {/* Hamburger Menu & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-full hover:bg-slate-900 text-slate-400 md:hidden transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Compact Search Bar */}
        <div className="relative flex-1 group">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400 transition-colors">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in Nexora Drive"
            className="w-full pl-11 pr-10 py-2.5 rounded-full bg-slate-900/60 border border-slate-800/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:border-slate-700 focus:shadow-md transition duration-150"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4.5 flex items-center text-slate-400 hover:text-white text-xs font-semibold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Header Controls */}
      <div className="flex items-center gap-2">

        {/* Profile Dropdown Trigger */}
        <div className="relative ml-1">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-1.5 p-1 rounded-full border border-slate-800 hover:bg-slate-900 transition active:scale-[0.98] outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/30 text-white font-bold text-xs flex items-center justify-center">
              {initials}
            </div>
            <span className="hidden sm:inline text-xs font-medium text-slate-300 pr-0.5">{displayName}</span>
            <svg className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Profile Card Popover */}
          {isProfileOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center gap-3 pb-3.5 border-b border-slate-800">
                  <div className="w-12 h-12 rounded-full bg-indigo-600/30 border border-indigo-500/30 text-white font-bold text-base flex items-center justify-center shrink-0">
                    {initials}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-white truncate">{displayName}</span>
                    <span className="text-xs text-slate-400 truncate">{displayUser.email}</span>
                  </div>
                </div>

                <div className="py-3 border-b border-slate-800 flex flex-col gap-1.5 text-xs text-slate-300">
                  <div className="flex justify-between items-center">
                    <span>Account Plan</span>
                    <span className="font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">Nexora Pro</span>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onNavigate('login');
                    }}
                    className="w-full py-2 px-3 justify-center text-center rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition duration-150 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
