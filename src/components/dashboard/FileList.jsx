import { FolderIcon, StarIconSolid, StarIconOutline, DownloadIcon } from '../Icons';
import { getFileIcon } from '../../utils/dashboardUtils';

export default function FileList({
  items,
  activeTab,
  onPreviewFile,
  onToggleStar,
  onRenameFile,
  onDeleteFile,
  onRenameFolder,
  onDeleteFolder,
  onRestoreItem,
  onDeletePermanent,
  onShareFile,
  onDownloadFile,
  sortBy,
  sortOrder,
  onSort,
}) {
  const renderSortIndicator = (field) => {
    if (sortBy !== field) return null;
    return <span className="ml-1 text-indigo-400 font-bold">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  };

  if (activeTab === 'trash') {
    return (
      <div className="w-full overflow-x-auto border border-slate-800/60 rounded-xl shadow-xs bg-slate-900/10">
        <table className="w-full min-w-[340px] border-collapse text-left text-xs">
          <thead>
            <tr className="bg-slate-900/40 border-b border-slate-800/80 text-slate-400 font-semibold select-none">
              <th onClick={() => onSort && onSort('name')} className="py-3 px-3 sm:px-4 font-semibold cursor-pointer hover:text-indigo-400 transition">
                Name{renderSortIndicator('name')}
              </th>
              <th onClick={() => onSort && onSort('date')} className="py-3 px-3 sm:px-4 font-semibold cursor-pointer hover:text-indigo-400 transition whitespace-nowrap">
                Date Deleted{renderSortIndicator('date')}
              </th>
              <th onClick={() => onSort && onSort('size')} className="py-3 px-3 sm:px-4 font-semibold w-20 sm:w-24 cursor-pointer hover:text-indigo-400 transition hidden xs:table-cell">
                Size{renderSortIndicator('size')}
              </th>
              <th className="py-3 px-3 sm:px-4 w-24 sm:w-28 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850/60">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-slate-800/35 text-slate-350 hover:text-white transition">
                <td className="py-2.5 px-3 sm:px-4 font-medium max-w-[120px] xs:max-w-[180px] sm:max-w-none">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="shrink-0">
                      {item.type === 'folder' ? (
                        <FolderIcon className="w-4 h-4 text-slate-400" />
                      ) : (
                        getFileIcon(item.extension)
                      )}
                    </span>
                    <span className="truncate" title={item.name}>{item.name}</span>
                  </div>
                </td>
                <td className="py-2.5 px-3 sm:px-4 text-slate-500 whitespace-nowrap text-[11px] sm:text-xs">{item.updatedAt}</td>
                <td className="py-2.5 px-3 sm:px-4 text-slate-500 whitespace-nowrap hidden xs:table-cell">{item.size}</td>
                <td className="py-2.5 px-3 sm:px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Restore Action */}
                    <button
                      onClick={(e) => onRestoreItem(item.id, e)}
                      className="py-1 px-2 border border-slate-850 rounded hover:bg-slate-800 font-semibold text-indigo-400 transition text-[11px] sm:text-xs"
                      title="Restore item"
                    >
                      Restore
                    </button>
                    {/* Permanent Delete Action */}
                    <button
                      onClick={(e) => onDeletePermanent(item.id, e)}
                      className="p-1 rounded text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-900/40 transition shrink-0"
                      title="Delete permanently"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (activeTab === 'shared') {
    return (
      <div className="w-full overflow-x-auto border border-slate-800/60 rounded-xl shadow-xs bg-slate-900/10">
        <table className="w-full min-w-[350px] border-collapse text-left text-xs">
          <thead>
            <tr className="bg-slate-900/40 border-b border-slate-800/80 text-slate-400 font-semibold select-none">
              <th onClick={() => onSort && onSort('name')} className="py-3 px-3 sm:px-4 font-semibold cursor-pointer hover:text-indigo-400 transition">
                Name{renderSortIndicator('name')}
              </th>
              <th className="py-3 px-3 sm:px-4 font-semibold">Shared by</th>
              <th onClick={() => onSort && onSort('date')} className="py-3 px-3 sm:px-4 font-semibold cursor-pointer hover:text-indigo-400 transition whitespace-nowrap">
                Share Date{renderSortIndicator('date')}
              </th>
              <th onClick={() => onSort && onSort('size')} className="py-3 px-3 sm:px-4 font-semibold w-20 sm:w-24 cursor-pointer hover:text-indigo-400 transition hidden xs:table-cell">
                Size{renderSortIndicator('size')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850/60">
            {items.map(file => (
              <tr key={file.id} className="hover:bg-slate-800/35 text-slate-350 hover:text-white transition">
                <td className="py-3 px-3 sm:px-4 font-medium max-w-[130px] xs:max-w-[180px] sm:max-w-none">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="shrink-0">{getFileIcon(file.extension)}</span>
                    <span
                      className="truncate cursor-pointer hover:text-indigo-400 transition"
                      title={file.name}
                      onClick={() => onPreviewFile(file)}
                    >
                      {file.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 sm:px-4">
                  <div className="flex items-center gap-2 min-w-0 max-w-[120px] xs:max-w-[160px] sm:max-w-none">
                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-[8px] uppercase shrink-0">
                      {file.owner === 'me' ? 'me' : file.owner.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="truncate break-words">{file.owner === 'me' ? 'me' : file.owner}</span>
                  </div>
                </td>
                <td className="py-3 px-3 sm:px-4 text-slate-500 whitespace-nowrap text-[11px] sm:text-xs">{file.updatedAt}</td>
                <td className="py-3 px-3 sm:px-4 text-slate-500 whitespace-nowrap hidden xs:table-cell">{file.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (activeTab === 'recent') {
    return (
      <div className="w-full overflow-x-auto border border-slate-800/60 rounded-xl shadow-xs bg-slate-900/10">
        <table className="w-full min-w-[340px] border-collapse text-left text-xs">
          <thead>
            <tr className="bg-slate-900/40 border-b border-slate-800/80 text-slate-400 font-semibold select-none">
              <th onClick={() => onSort && onSort('name')} className="py-3 px-3 sm:px-4 font-semibold cursor-pointer hover:text-indigo-400 transition">
                Name{renderSortIndicator('name')}
              </th>
              <th className="py-3 px-3 sm:px-4 font-semibold whitespace-nowrap">Activity</th>
              <th onClick={() => onSort && onSort('date')} className="py-3 px-3 sm:px-4 font-semibold cursor-pointer hover:text-indigo-400 transition whitespace-nowrap">
                Date modified{renderSortIndicator('date')}
              </th>
              <th onClick={() => onSort && onSort('size')} className="py-3 px-3 sm:px-4 font-semibold w-20 sm:w-24 cursor-pointer hover:text-indigo-400 transition hidden xs:table-cell">
                Size{renderSortIndicator('size')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850/60">
            {items.map(file => (
              <tr key={file.id} className="hover:bg-slate-800/35 text-slate-350 hover:text-white transition">
                <td className="py-3 px-3 sm:px-4 font-medium max-w-[120px] xs:max-w-[180px] sm:max-w-none">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="shrink-0">{getFileIcon(file.extension)}</span>
                    <span
                      className="truncate cursor-pointer hover:text-indigo-400 transition"
                      title={file.name}
                      onClick={() => onPreviewFile(file)}
                    >
                      {file.name}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3 sm:px-4 text-slate-500 whitespace-nowrap">{file.lastActionType || file.reasonSuggested || 'Opened'}</td>
                <td className="py-3 px-3 sm:px-4 text-slate-500 whitespace-nowrap text-[11px] sm:text-xs">{file.updatedAt}</td>
                <td className="py-3 px-3 sm:px-4 text-slate-500 whitespace-nowrap hidden xs:table-cell">{file.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (activeTab === 'starred') {
    return (
      <div className="w-full overflow-x-auto border border-slate-800/60 rounded-xl shadow-xs bg-slate-900/10">
        <table className="w-full min-w-[320px] border-collapse text-left text-xs">
          <thead>
            <tr className="bg-slate-900/40 border-b border-slate-800/80 text-slate-400 font-semibold select-none">
              <th onClick={() => onSort && onSort('name')} className="py-3 px-3 sm:px-4 font-semibold cursor-pointer hover:text-indigo-400 transition">
                Name{renderSortIndicator('name')}
              </th>
              <th className="py-3 px-3 sm:px-4 font-semibold">Owner</th>
              <th onClick={() => onSort && onSort('date')} className="py-3 px-3 sm:px-4 font-semibold cursor-pointer hover:text-indigo-400 transition whitespace-nowrap">
                Modified{renderSortIndicator('date')}
              </th>
              <th className="py-3 px-3 sm:px-4 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-850/60">
            {items.map(file => (
              <tr key={file.id} className="group hover:bg-slate-800/35 text-slate-350 hover:text-white transition">
                <td className="py-2.5 px-3 sm:px-4 font-medium max-w-[130px] xs:max-w-[180px] sm:max-w-none">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="shrink-0">{getFileIcon(file.extension)}</span>
                    <span
                      className="truncate cursor-pointer hover:text-indigo-400 transition"
                      title={file.name}
                      onClick={() => onPreviewFile(file)}
                    >
                      {file.name}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-3 sm:px-4 text-slate-500 truncate max-w-[100px] sm:max-w-none">{file.owner}</td>
                <td className="py-2.5 px-3 sm:px-4 text-slate-500 whitespace-nowrap text-[11px] sm:text-xs">{file.updatedAt}</td>
                <td className="py-2.5 px-3 sm:px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShareFile && onShareFile(file);
                      }}
                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800/50 transition"
                      title="Share file"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </button>
                    {file.type === 'file' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownloadFile && onDownloadFile(file, e);
                        }}
                        className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800/50 transition"
                        title="Download file"
                      >
                        <DownloadIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => onToggleStar(file.id, e)}
                      className="text-amber-500 p-1 rounded hover:bg-slate-800/50 transition"
                    >
                      <StarIconSolid />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Default is 'drive' tab or general list
  return (
    <div className="w-full overflow-x-auto border border-slate-800/60 rounded-xl shadow-sm bg-slate-900/10">
      <table className="w-full min-w-[320px] border-collapse text-left text-xs">
        <thead>
          <tr className="bg-slate-900/40 border-b border-slate-800/80 text-slate-400 font-semibold select-none">
            <th onClick={() => onSort && onSort('name')} className="py-3 px-3 sm:px-4 font-semibold w-1/3 cursor-pointer hover:text-indigo-400 transition">
              Name{renderSortIndicator('name')}
            </th>
            <th className="py-3 px-3 sm:px-4 font-semibold w-1/4 hidden sm:table-cell">Reason suggested</th>
            <th className="py-3 px-3 sm:px-4 font-semibold hidden md:table-cell">Owner</th>
            <th className="py-3 px-3 sm:px-4 font-semibold hidden sm:table-cell">Location</th>
            <th className="py-3 px-3 sm:px-4 w-12"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-850/60">
          {items.map(file => (
            <tr key={file.id} className="group hover:bg-slate-800/35 text-slate-350 hover:text-white transition duration-150">
              <td className="py-2.5 px-3 sm:px-4 font-medium max-w-[130px] xs:max-w-[180px] sm:max-w-none">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="shrink-0">
                    {file.type === 'folder' ? (
                      <FolderIcon className="w-4 h-4 text-indigo-400" />
                    ) : (
                      getFileIcon(file.extension)
                    )}
                  </span>
                  <span
                    className="truncate hover:text-indigo-400 cursor-pointer transition"
                    title={file.name}
                    onClick={() => {
                      if (file.type === 'folder') {
                        // Just in case folders are passed to a general list
                        onRenameFolder && onRenameFolder(file.id, file.name);
                      } else {
                        onPreviewFile(file);
                      }
                    }}
                  >
                    {file.name}
                  </span>
                </div>
              </td>
              <td className="py-2.5 px-3 sm:px-4 text-slate-500 hidden sm:table-cell">
                {file.reasonSuggested || 'You opened • Aug 20'}
              </td>
              <td className="py-2.5 px-3 sm:px-4 hidden md:table-cell">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-[8px] uppercase">
                    {file.owner === 'me' ? 'me' : file.owner.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-slate-400">{file.owner === 'me' ? 'me' : file.owner}</span>
                </div>
              </td>
              <td className="py-2.5 px-3 sm:px-4 text-slate-500 hidden sm:table-cell">
                <div className="flex items-center gap-1.5">
                  <FolderIcon className="w-3.5 h-3.5 text-indigo-400/60" />
                  <span>{file.location || 'My Drive'}</span>
                </div>
              </td>
              <td className="py-2.5 px-3 sm:px-4 text-right">
                <div className="flex items-center justify-end gap-1.5">
                  {file.type === 'file' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onShareFile && onShareFile(file);
                      }}
                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800/50 transition"
                      title="Share file"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </button>
                  )}
                  {file.type === 'file' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownloadFile && onDownloadFile(file, e);
                      }}
                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800/50 transition"
                      title="Download file"
                    >
                      <DownloadIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => onToggleStar(file.id, e)}
                    className="text-slate-650 hover:text-amber-400 p-1 rounded hover:bg-slate-800/50 transition"
                  >
                    {file.starred ? <StarIconSolid /> : <StarIconOutline />}
                  </button>
                  <button
                    className="p-1 rounded hover:bg-slate-800/50 text-slate-400 hover:text-white transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (file.type === 'folder') {
                        onRenameFolder && onRenameFolder(file.id, file.name);
                      } else {
                        onRenameFile && onRenameFile(file.id, file.name);
                      }
                    }}
                    title="Rename"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    className="p-1 rounded hover:bg-slate-800/50 text-slate-400 hover:text-red-400 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (file.type === 'folder') {
                        onDeleteFolder && onDeleteFolder(file.id);
                      } else {
                        onDeleteFile && onDeleteFile(file.id);
                      }
                    }}
                    title="Move to trash"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
