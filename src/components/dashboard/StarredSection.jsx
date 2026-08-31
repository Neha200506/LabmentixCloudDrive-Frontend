import { FolderIcon, StarIconSolid } from '../Icons';
import FileList from './FileList';

export default function StarredSection({
  folderItems,
  fileItems,
  onFolderClick,
  onToggleStar,
  onPreviewFile,
  onShareFile,
}) {
  return (
    <div className="space-y-6">
      {folderItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Starred Folders</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {folderItems.map(folder => (
              <div
                key={folder.id}
                onClick={() => onFolderClick && onFolderClick(folder.id)}
                className="group bg-slate-900/20 hover:bg-slate-800/40 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between transition cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-indigo-400 shrink-0">
                    <FolderIcon className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-semibold text-slate-200 truncate" title={folder.name}>
                    {folder.name}
                  </span>
                </div>
                <button
                  onClick={(e) => onToggleStar(folder.id, e)}
                  className="text-amber-500 p-0.5 rounded transition shrink-0"
                >
                  <StarIconSolid />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {fileItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Starred Files</h3>
          <FileList
            items={fileItems}
            activeTab="starred"
            onPreviewFile={onPreviewFile}
            onToggleStar={onToggleStar}
            onShareFile={onShareFile}
          />
        </div>
      )}
    </div>
  );
}
