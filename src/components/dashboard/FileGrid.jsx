import { FolderIcon, StarIconSolid, StarIconOutline, DownloadIcon } from '../Icons';
import { getFileIcon } from '../../utils/dashboardUtils';

export default function FileGrid({
  items,
  viewType, // 'folder' or 'file'
  onFolderClick,
  onPreviewFile,
  onToggleStar,
  onRenameFolder,
  onDeleteFolder,
  onRenameFile,
  onDeleteFile,
  onShareFile,
  onDownloadFile,
}) {
  if (viewType === 'folder') {
    return (
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map(folder => (
          <div
            key={folder.id}
            onClick={() => onFolderClick && onFolderClick(folder.id)}
            className="group bg-slate-900/20 hover:bg-slate-800/40 border border-slate-800/80 hover:border-slate-700/60 rounded-xl p-3 sm:p-3.5 flex items-center justify-between transition cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-1">
              <span className="p-2 rounded-lg bg-slate-950 text-indigo-400 border border-slate-850 group-hover:bg-indigo-500/10 group-hover:text-indigo-300 transition shrink-0">
                <FolderIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-200 truncate" title={folder.name}>
                  {folder.name}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  Folder
                </span>
              </div>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                onClick={(e) => onToggleStar(folder.id, e)}
                className="p-1 rounded hover:bg-slate-800/50 text-slate-650 hover:text-amber-400 transition"
              >
                {folder.starred ? <StarIconSolid /> : <StarIconOutline />}
              </button>
              <button
                className="p-1 rounded hover:bg-slate-800/50 text-slate-500 hover:text-white transition"
                onClick={(e) => {
                  e.stopPropagation();
                  onRenameFolder(folder.id, folder.name);
                }}
                title="Rename folder"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                className="p-1 rounded hover:bg-slate-800/50 text-slate-500 hover:text-red-400 transition shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFolder(folder.id);
                }}
                title="Move to trash"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // viewType === 'file'
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {items.map(file => (
        <div
          key={file.id}
          onClick={() => onPreviewFile(file)}
          className="group bg-slate-900/20 hover:bg-slate-800/40 border border-slate-800/80 hover:border-slate-700/60 rounded-xl p-3 flex flex-col justify-between h-24 transition cursor-pointer select-none shadow-xs"
        >
          <div className="flex items-start justify-between">
            <span className="shrink-0">{getFileIcon(file.extension)}</span>
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShareFile && onShareFile(file);
                }}
                className="text-slate-400 hover:text-white p-0.5 rounded transition shrink-0"
                title="Share file"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownloadFile && onDownloadFile(file, e);
                }}
                className="text-slate-400 hover:text-white p-0.5 rounded transition shrink-0"
                title="Download file"
              >
                <DownloadIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => onToggleStar(file.id, e)}
                className="text-slate-650 hover:text-amber-400 p-0.5 rounded transition shrink-0"
              >
                {file.starred ? <StarIconSolid /> : <StarIconOutline />}
              </button>
              <button
                className="p-0.5 rounded hover:bg-slate-800/50 text-slate-400 hover:text-white transition shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onRenameFile(file.id, file.name);
                }}
                title="Rename file"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                className="p-0.5 rounded hover:bg-slate-800/50 text-slate-400 hover:text-red-400 transition shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteFile(file.id);
                }}
                title="Move to trash"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-2 min-w-0">
            <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 truncate" title={file.name}>
              {file.name}
            </h4>
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-medium">
              <span>{file.size}</span>
              <span>{file.updatedAt}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
