import { FolderIcon, StarIconSolid, StarIconOutline } from '../Icons';
import { getFileIcon } from '../../utils/dashboardUtils';

export default function HomeSection({
  items,
  onPreviewFile,
  onToggleStar,
  onShareFile,
}) {
  const suggestedFiles = items.filter(item => !item.inTrash && item.type === 'file').slice(0, 3);
  const recentActivities = items.filter(item => !item.inTrash).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800/60 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-100">Welcome to Nexora Drive</h2>
          <p className="text-xs text-slate-400">Access and organize all your files easily in one central cloud drive workspace.</p>
        </div>
        <div className="text-3xl hidden sm:block select-none">✨</div>
      </div>

      {/* Suggested Files Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suggested files</h3>
          <span className="text-[10px] text-slate-500 font-medium">Updated recently</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {suggestedFiles.map(file => (
            <div
              key={file.id}
              onClick={() => onPreviewFile(file)}
              className="group bg-slate-900/20 hover:bg-slate-800/40 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between h-28 transition cursor-pointer shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="shrink-0">{getFileIcon(file.extension)}</span>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-400 truncate" title={file.name}>
                    {file.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onShareFile && onShareFile(file);
                    }}
                    className="text-slate-400 hover:text-white p-0.5 rounded"
                    title="Share file"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => onToggleStar(file.id, e)}
                    className="text-slate-650 hover:text-amber-400 p-0.5 rounded"
                  >
                    {file.starred ? <StarIconSolid /> : <StarIconOutline />}
                  </button>
                </div>
              </div>
              <div className="mt-3 border-t border-slate-800/80 pt-2.5 flex items-center justify-between text-[10px] text-slate-500">
                <span className="truncate">Reason: {file.reasonSuggested}</span>
                <span className="font-semibold text-slate-400">{file.size}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Activity</h3>
        <div className="border border-slate-800/60 rounded-xl overflow-hidden shadow-xs bg-slate-900/10">
          <div className="divide-y divide-slate-850/60">
            {recentActivities.map(item => (
              <div 
                key={item.id} 
                onClick={() => item.type === 'file' && onPreviewFile(item)}
                className={`p-3 flex items-center justify-between gap-4 text-xs hover:bg-slate-800/35 transition ${item.type === 'file' ? 'cursor-pointer hover:text-indigo-400' : ''}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span>{item.type === 'folder' ? <FolderIcon className="w-4 h-4 text-indigo-400" /> : getFileIcon(item.extension)}</span>
                  <span className="font-medium text-slate-350 truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-6 shrink-0 text-slate-500">
                  <span>Modified {item.updatedAt}</span>
                  <span className="hidden sm:inline w-16 text-right font-medium text-slate-400">{item.size}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
