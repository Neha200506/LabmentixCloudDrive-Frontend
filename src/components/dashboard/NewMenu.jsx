import { FolderIcon } from '../Icons';

export default function NewMenu({
  isNewMenuOpen,
  setIsNewMenuOpen,
  onCreateFolderClick,
  onFileUploadClick,
  onFolderUploadClick,
}) {
  if (!isNewMenuOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={() => setIsNewMenuOpen(false)} />
      <div className="absolute left-2 top-16 w-56 rounded-xl bg-slate-900 border border-slate-800 p-1.5 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-xs">
        <button
          onClick={() => {
            setIsNewMenuOpen(false);
            onCreateFolderClick();
          }}
          className="w-full text-left px-3 py-2 font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition flex items-center gap-2.5"
        >
          <FolderIcon className="w-4 h-4 text-indigo-400" />
          <span>New Folder</span>
        </button>
        <button
          onClick={() => {
            setIsNewMenuOpen(false);
            onFileUploadClick();
          }}
          className="w-full text-left px-3 py-2 font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition flex items-center gap-2.5"
        >
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span>File Upload</span>
        </button>
        <button
          onClick={() => {
            setIsNewMenuOpen(false);
            onFolderUploadClick();
          }}
          className="w-full text-left px-3 py-2 font-medium text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition flex items-center gap-2.5"
        >
          <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5M5 19v-2m14 2v-2" />
          </svg>
          <span>Folder Upload</span>
        </button>
      </div>
    </>
  );
}
