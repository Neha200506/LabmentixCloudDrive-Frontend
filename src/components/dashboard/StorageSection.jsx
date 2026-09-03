import { formatSize, getFileIcon } from '../../utils/dashboardUtils';

const parseSizeInBytes = (sizeStr) => {
  if (!sizeStr || sizeStr === '-' || sizeStr === '--') return 0;
  const str = String(sizeStr).trim().toUpperCase();
  const match = str.match(/^([\d.]+)\s*([A-Z]+)?$/);
  if (!match) return 0;
  const num = parseFloat(match[1]) || 0;
  const unit = match[2] || 'B';
  if (unit === 'KB' || unit === 'K') return num * 1024;
  if (unit === 'MB' || unit === 'M') return num * 1024 * 1024;
  if (unit === 'GB' || unit === 'G') return num * 1024 * 1024 * 1024;
  if (unit === 'TB' || unit === 'T') return num * 1024 * 1024 * 1024 * 1024;
  return num;
};

export default function StorageSection({
  totalUsedStorageBytes,
  totalStorageCapacityBytes,
  usedPercentStr,
  storageCategories,
  activeFilesForStorage,
  handlePreviewFile,
  resetFilters,
}) {
  return (
    <div className="space-y-6">

      {/* Storage utilization card */}
      <div className="bg-slate-900/20 border border-slate-850 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2.5 flex-1">
          <h3 className="text-sm font-semibold text-slate-200">Nexora Cloud Storage Usage</h3>
          <div className="text-3xl font-extrabold text-indigo-400">
            {formatSize(totalUsedStorageBytes)} <span className="text-sm font-semibold text-slate-500">of 15 GB used ({usedPercentStr}%)</span>
          </div>

          {/* Segmented storage progress bar */}
          <div className="w-full bg-slate-950 border border-slate-850 rounded-full h-3 overflow-hidden flex">
            {storageCategories.map(cat => {
              if (cat.bytes <= 0) return null;
              const pct = Math.max((cat.bytes / totalStorageCapacityBytes) * 100, 0.8);
              return (
                <div
                  key={cat.id}
                  className={`${cat.color} h-full transition-all duration-300`}
                  style={{ width: `${pct}%` }}
                  title={`${cat.label}: ${formatSize(cat.bytes)}`}
                />
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-500 font-medium pt-1">
            {storageCategories.map(cat => (
              <span key={cat.id} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} /> {cat.label} ({formatSize(cat.bytes)})
              </span>
            ))}
          </div>
        </div>

        <div className="shrink-0 flex flex-col gap-2">
          <button onClick={() => alert("Payment and upgrades are disabled in demo mode.")} className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-550 text-white text-xs font-semibold rounded-full shadow-sm hover:shadow transition text-center">
            Upgrade Storage Plan
          </button>
          <button onClick={resetFilters} className="py-2.5 px-5 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-full transition text-center">
            Clean Up Files
          </button>
        </div>
      </div>

      {/* Largest Files Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Largest files in your drive</h3>
          <span className="text-[10px] text-slate-500">Used space rankings</span>
        </div>

        <div className="border border-slate-800/60 rounded-xl overflow-hidden shadow-xs bg-slate-900/10">
          <table className="min-w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-900/40 border-b border-slate-800/80 text-slate-400 font-semibold select-none">
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Location</th>
                <th className="py-3 px-4 font-semibold">Size</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/60">
              {activeFilesForStorage.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-6 text-center text-slate-500 italic">No files in your drive</td>
                </tr>
              ) : (
                [...activeFilesForStorage]
                  .sort((a, b) => {
                    const sizeA = typeof a.sizeBytes === 'number' && !isNaN(a.sizeBytes) && a.sizeBytes > 0 ? a.sizeBytes : parseSizeInBytes(a.size);
                    const sizeB = typeof b.sizeBytes === 'number' && !isNaN(b.sizeBytes) && b.sizeBytes > 0 ? b.sizeBytes : parseSizeInBytes(b.size);
                    return sizeB - sizeA;
                  })
                  .map(file => (
                    <tr key={file.id} className="hover:bg-slate-800/35 text-slate-350 hover:text-white transition">
                      <td className="py-3 px-4 font-medium">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="shrink-0">{getFileIcon(file.extension)}</span>
                          <span
                            className="truncate cursor-pointer hover:text-indigo-400 transition"
                            title={file.name}
                            onClick={() => handlePreviewFile(file)}
                          >
                            {file.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{file.location || 'My Drive'}</td>
                      <td className="py-3 px-4 font-semibold text-slate-400">{file.size}</td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
