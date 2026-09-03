export default function FilterBar({
  activeTab,
  filterType,
  setFilterType,
  filterOwner,
  setFilterOwner,
  filterModified,
  setFilterModified,
  filterSource,
  activeFilterDropdown,
  setActiveFilterDropdown,
  peopleSearch,
  setPeopleSearch,
  filteredPeople,
  tempModified,
  setTempModified,
  customStart,
  setCustomStart,
  customEnd,
  setCustomEnd,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  resetFilters,
}) {
  if (!['drive', 'shared', 'recent', 'starred', 'trash'].includes(activeTab)) {
    return null;
  }

  return (
    <div className="px-6 py-2.5 bg-slate-900/10 border-b border-slate-800/40 flex flex-wrap items-center gap-2.5 z-20 shrink-0">

      {/* 1. Type Dropdown */}
      <div className="relative">
        <button
          onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'type' ? null : 'type')}
          className={`px-3 py-1 border text-xs rounded-lg flex items-center gap-1.5 transition ${filterType !== 'all'
            ? 'border-indigo-800 bg-indigo-950/50 text-indigo-300 font-semibold'
            : 'border-slate-800 bg-slate-900/35 text-slate-300 hover:bg-slate-850 hover:text-white'
            }`}
        >
          <span>Type{filterType !== 'all' ? `: ${filterType.toUpperCase()}` : ''}</span>
          <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {activeFilterDropdown === 'type' && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setActiveFilterDropdown(null)} />
            <div className="absolute left-0 mt-1.5 w-44 rounded-xl bg-slate-900 border border-slate-800 py-1.5 shadow-xl z-40 text-xs">
              {[
                { id: 'all', label: 'All types' },
                { id: 'folder', label: 'Folders' },
                { id: 'docx', label: 'Documents' },
                { id: 'xlsx', label: 'Spreadsheets' },
                { id: 'presentation', label: 'Presentations' },
                { id: 'png', label: 'Photos & images' },
                { id: 'pdf', label: 'PDFs' },
                { id: 'video', label: 'Videos' },
                { id: 'mp3', label: 'Audio' },
                { id: 'code', label: 'Code / Text' },
                { id: 'zip', label: 'Archives (ZIP)' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setFilterType(opt.id);
                    setActiveFilterDropdown(null);
                  }}
                  className={`w-full text-left px-3.5 py-2 hover:bg-slate-800/60 transition ${filterType === opt.id ? 'font-semibold text-indigo-400 bg-indigo-500/10' : 'text-slate-300'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 2. People Dropdown */}
      <div className="relative">
        <button
          onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'people' ? null : 'people')}
          className={`px-3 py-1 border text-xs rounded-lg flex items-center gap-1.5 transition ${filterOwner !== 'all'
            ? 'border-indigo-800 bg-indigo-950/50 text-indigo-300 font-semibold'
            : 'border-slate-800 bg-slate-900/35 text-slate-300 hover:bg-slate-850 hover:text-white'
            }`}
        >
          <span>People{filterOwner !== 'all' ? `: ${filterOwner === 'link' ? 'Shared link' : filterOwner.split(' ')[0]}` : ''}</span>
          <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {activeFilterDropdown === 'people' && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setActiveFilterDropdown(null)} />
            <div className="absolute left-0 mt-1.5 w-60 rounded-xl bg-slate-900 border border-slate-800 shadow-xl z-40 text-xs flex flex-col">

              {/* Search field */}
              <div className="p-2 border-b border-slate-800">
                <input
                  type="text"
                  value={peopleSearch}
                  onChange={(e) => setPeopleSearch(e.target.value)}
                  placeholder="Search for people and groups"
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-xs text-white rounded-lg focus:outline-none focus:border-indigo-500 placeholder-slate-600"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* People Options list */}
              <div className="max-h-56 overflow-y-auto py-1">
                {filteredPeople.length === 0 ? (
                  <div className="p-3.5 text-center text-slate-500 italic">No people found</div>
                ) : (
                  filteredPeople.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setFilterOwner(p.id);
                        setActiveFilterDropdown(null);
                        setPeopleSearch('');
                      }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-slate-800/60 transition flex items-center gap-2.5 ${filterOwner === p.id ? 'font-semibold text-indigo-400 bg-indigo-500/10' : 'text-slate-300'}`}
                    >
                      <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-[8px] font-bold flex items-center justify-center shrink-0">
                        {p.initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-xs truncate">{p.name}</span>
                        <span className="text-[9px] text-slate-500 truncate">{p.email}</span>
                      </div>
                    </button>
                  ))
                )}

                {/* "Anyone with the link" option */}
                <button
                  onClick={() => {
                    setFilterOwner('link');
                    setActiveFilterDropdown(null);
                    setPeopleSearch('');
                  }}
                  className={`w-full text-left px-3.5 py-2.5 hover:bg-slate-800/60 border-t border-slate-800/60 transition flex items-center gap-2.5 ${filterOwner === 'link' ? 'font-semibold text-indigo-400 bg-indigo-500/10' : 'text-slate-300'}`}
                >
                  <span className="p-1 rounded bg-slate-800 text-indigo-400 shrink-0">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </span>
                  <span className="font-semibold text-xs">Anyone with the link</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. Modified Dropdown */}
      <div className="relative">
        <button
          onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'modified' ? null : 'modified')}
          className={`px-3 py-1 border text-xs rounded-lg flex items-center gap-1.5 transition ${filterModified !== 'all'
            ? 'border-indigo-800 bg-indigo-950/50 text-indigo-300 font-semibold'
            : 'border-slate-800 bg-slate-900/35 text-slate-300 hover:bg-slate-850 hover:text-white'
            }`}
        >
          <span>Modified{filterModified !== 'all' ? ': Active' : ''}</span>
          <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {activeFilterDropdown === 'modified' && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setActiveFilterDropdown(null)} />
            <div
              className="absolute left-0 mt-1.5 w-60 rounded-xl bg-slate-900 border border-slate-800 p-2 shadow-xl z-40 text-xs flex flex-col gap-1.5 animate-in fade-in duration-100"
              onClick={(e) => e.stopPropagation()}
            >
              {[
                { id: 'all', label: 'Any time' },
                { id: 'today', label: 'Today' },
                { id: '7days', label: 'Last 7 days' },
                { id: '30days', label: 'Last 30 days' },
                { id: 'thisyear', label: 'This year' },
                { id: 'lastyear', label: 'Last year' },
                { id: 'custom', label: 'Custom date range' },
              ].map(opt => (
                <label
                  key={opt.id}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/60 cursor-pointer transition ${tempModified === opt.id ? 'text-indigo-400 font-semibold bg-indigo-500/5' : 'text-slate-300'}`}
                >
                  <input
                    type="radio"
                    name="modifiedRange"
                    checked={tempModified === opt.id}
                    onChange={() => setTempModified(opt.id)}
                    className="text-indigo-500 focus:ring-indigo-500 bg-slate-950 border-slate-800"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}

              {/* Custom Date Range Picker */}
              {tempModified === 'custom' && (
                <div className="px-2.5 py-2 border border-slate-800 rounded-lg bg-slate-950 flex flex-col gap-2 animate-in fade-in duration-100">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Start Date</span>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">End Date</span>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Dropdown actions */}
              <div className="flex items-center justify-between border-t border-slate-800 pt-2 mt-1 px-1">
                <button
                  onClick={() => setActiveFilterDropdown(null)}
                  className="text-slate-500 hover:text-slate-300 font-semibold px-2 py-1 transition"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setTempModified('all');
                      setFilterModified('all');
                      setCustomStart('');
                      setCustomEnd('');
                      setActiveFilterDropdown(null);
                    }}
                    className="text-slate-400 hover:text-slate-250 font-semibold px-2 py-1 transition"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => {
                      setFilterModified(tempModified);
                      setActiveFilterDropdown(null);
                    }}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-550 text-white rounded font-semibold transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 5. Sort Dropdown */}
      <div className="relative">
        <button
          onClick={() => setActiveFilterDropdown(activeFilterDropdown === 'sort' ? null : 'sort')}
          className={`px-3 py-1 border text-xs rounded-lg flex items-center gap-1.5 transition ${sortBy !== 'name' || sortOrder !== 'asc'
            ? 'border-indigo-800 bg-indigo-950/50 text-indigo-300 font-semibold'
            : 'border-slate-800 bg-slate-900/35 text-slate-300 hover:bg-slate-850 hover:text-white'
            }`}
        >
          <span>Sort: {sortBy === 'name' ? 'Name' : sortBy === 'size' ? 'Size' : 'Date'} ({sortOrder.toUpperCase()})</span>
          <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {activeFilterDropdown === 'sort' && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setActiveFilterDropdown(null)} />
            <div className="absolute left-0 mt-1.5 w-44 rounded-xl bg-slate-900 border border-slate-800 py-1.5 shadow-xl z-40 text-xs">
              {[
                { id: 'name-asc', label: 'Name (A to Z)', sortBy: 'name', sortOrder: 'asc' },
                { id: 'name-desc', label: 'Name (Z to A)', sortBy: 'name', sortOrder: 'desc' },
                { id: 'date-desc', label: 'Newest first', sortBy: 'date', sortOrder: 'desc' },
                { id: 'date-asc', label: 'Oldest first', sortBy: 'date', sortOrder: 'asc' },
                { id: 'size-desc', label: 'Size (Large to Small)', sortBy: 'size', sortOrder: 'desc' },
                { id: 'size-asc', label: 'Size (Small to Large)', sortBy: 'size', sortOrder: 'asc' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSortBy(opt.sortBy);
                    setSortOrder(opt.sortOrder);
                    setActiveFilterDropdown(null);
                  }}
                  className={`w-full text-left px-3.5 py-2 hover:bg-slate-800/60 transition ${sortBy === opt.sortBy && sortOrder === opt.sortOrder ? 'font-semibold text-indigo-400 bg-indigo-500/10' : 'text-slate-300'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Reset Filters options link */}
      {(filterType !== 'all' || filterOwner !== 'all' || filterModified !== 'all' || filterSource !== 'all' || sortBy !== 'name' || sortOrder !== 'asc') && (
        <button
          onClick={() => {
            resetFilters();
            setSortBy('name');
            setSortOrder('asc');
          }}
          className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline font-semibold ml-2"
        >
          Reset filters
        </button>
      )}
    </div>
  );
}
