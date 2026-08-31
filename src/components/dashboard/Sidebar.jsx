import {
  LogoIcon,
  HomeIcon,
  ProjectsIcon,
  DriveIcon,
  ComputerIcon,
  PeopleIcon,
  ClockIcon,
  StarIconOutline,
  StarIconSolid,
  AlertIcon,
  TrashIcon,
  CloudIcon
} from '../Icons';
import NewMenu from './NewMenu';

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  isNewMenuOpen,
  setIsNewMenuOpen,
  activeTab,
  handleTabSwitch,
  handleUploadFile,
  handleUploadFolder,
  onCreateFolderClick,
}) {
  const onFileUploadClick = () => {
    document.getElementById("fileUploadInput").click();
  };

  const onFolderUploadClick = () => {
    document.getElementById("folderUploadInput").click();
  };

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 w-64 bg-slate-900/60 border-r border-slate-800/40 py-4 px-3 flex flex-col justify-between z-[100] md:sticky md:flex transform transition-transform duration-200 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="flex flex-col gap-4">
        {/* Logo & Nexora Branding */}
        <div className="flex items-center justify-between px-3 py-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20">
              <LogoIcon />
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">
              Nexora <span className="text-xs font-normal text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded ml-1">Drive</span>
            </span>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-md border border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white md:hidden"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* "+ New" Pill-style Button */}
        <div className="relative px-2 py-2">
          <button
            onClick={() => setIsNewMenuOpen(!isNewMenuOpen)}
            className="flex items-center gap-3 px-6 py-4 bg-slate-900 border border-slate-800 text-slate-200 font-medium rounded-[16px] shadow-lg hover:bg-slate-850 hover:shadow-xl transition-all outline-none duration-200 active:scale-[0.98]"
          >
            {/* Colorful Custom Plus Icon */}
            <svg className="w-6 h-6" viewBox="0 0 36 36">
              <path fill="#818cf8" d="M16 16v14h4V20h14v-4H20V2h-4v14H2v4h14z" />
            </svg>
            <span className="text-sm font-semibold tracking-wide">New</span>
          </button>

          <NewMenu
            isNewMenuOpen={isNewMenuOpen}
            setIsNewMenuOpen={setIsNewMenuOpen}
            onCreateFolderClick={onCreateFolderClick}
            onFileUploadClick={onFileUploadClick}
            onFolderUploadClick={onFolderUploadClick}
          />

          <input
            id="fileUploadInput"
            type="file"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              try {
                await handleUploadFile(file);
              } finally {
                e.target.value = "";
              }
            }}
          />

          <input
            id="folderUploadInput"
            type="file"
            webkitdirectory=""
            directory=""
            multiple
            className="hidden"
            onChange={async (e) => {
              const files = Array.from(e.target.files);
              if (files.length === 0) return;
              try {
                await handleUploadFolder(files);
              } finally {
                e.target.value = "";
              }
            }}
          />
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-0.5 px-2">
          {[
            { id: 'home', label: 'Home', icon: <HomeIcon /> },
            { id: 'projects', label: 'Projects', icon: <ProjectsIcon /> },
            { id: 'drive', label: 'My Drive', icon: <DriveIcon /> },
            { id: 'computers', label: 'Computers', icon: <ComputerIcon /> },
            { id: 'shared', label: 'Shared with me', icon: <PeopleIcon /> },
            { id: 'recent', label: 'Recent', icon: <ClockIcon /> },
            { id: 'starred', label: 'Starred', icon: <StarIconOutline /> },
            { id: 'spam', label: 'Spam', icon: <AlertIcon /> },
            { id: 'trash', label: 'Trash', icon: <TrashIcon /> },
            { id: 'storage', label: 'Storage', icon: <CloudIcon /> },
          ].map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabSwitch(item.id)}
                className={`flex items-center gap-3 px-4 py-2 rounded-full text-xs font-medium transition duration-150 text-left ${
                  isActive
                    ? 'bg-slate-800/80 text-white font-semibold border-l-2 border-indigo-500'
                    : 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-200'
                }`}
              >
                <span className={`${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
                  {item.id === 'starred' && isActive ? <StarIconSolid /> : item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Storage Meter */}
      <div className="px-4 py-3 border-t border-slate-800/40 mt-auto">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-slate-400">
            <CloudIcon />
            <span className="text-[11px] font-semibold text-slate-300">Storage</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '8%' }}></div>
          </div>

          <div className="text-[11px] text-slate-400">
            1.2 GB of 15 GB used
          </div>

          <button
            onClick={() => handleTabSwitch('storage')}
            className="mt-2 w-full py-1.5 px-3 border border-slate-800 text-indigo-400 hover:bg-indigo-500/10 text-[11px] rounded-full font-semibold transition text-center"
          >
            Get more storage
          </button>
        </div>
      </div>
    </aside>
  );
}
