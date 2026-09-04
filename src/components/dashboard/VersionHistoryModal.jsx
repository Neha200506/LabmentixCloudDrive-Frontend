import { useState, useEffect, useCallback } from 'react';
import { formatSize } from '../../utils/dashboardUtils';
import { API_BASE_URL } from '../../config';

export default function VersionHistoryModal({ file, onClose, onRestoreSuccess, showNotification }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState(null);
  const [loadingUrlId, setLoadingUrlId] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const fetchVersions = useCallback(async () => {
    if (!file) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/files/${file.id}/versions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setVersions(data.versions || []);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch version history');
      }
    } catch (err) {
      console.error('Error fetching file versions:', err);
      setError('Network error while fetching versions');
    } finally {
      setLoading(false);
    }
  }, [file, token]);

  useEffect(() => {
    let ignore = false;
    if (!file) return;

    const load = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/files/${file.id}/versions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!ignore) {
          if (response.ok) {
            setVersions(data.versions || []);
            setError(null);
          } else {
            setError(data.message || 'Failed to fetch version history');
          }
        }
      } catch (err) {
        console.error('Error fetching file versions:', err);
        if (!ignore) {
          setError('Network error while fetching versions');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [file, token]);

  const handleOpenVersionUrl = async (versionId) => {
    setLoadingUrlId(versionId);
    try {
      const response = await fetch(`${API_BASE_URL}/api/files/${file.id}/versions/${versionId}/url`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.url) {
        window.open(data.url, '_blank');
      } else {
        if (showNotification) {
          showNotification('error', data.message || 'Could not generate version URL');
        }
      }
    } catch (err) {
      console.error('Version URL fetch error:', err);
      if (showNotification) {
        showNotification('error', 'Failed to fetch version download URL');
      }
    } finally {
      setLoadingUrlId(null);
    }
  };

  const handleRestoreVersion = async (versionId, versionNumber) => {
    if (!window.confirm(`Are you sure you want to restore Version ${versionNumber}?`)) return;
    setRestoringId(versionId);
    try {
      const response = await fetch(`${API_BASE_URL}/api/files/${file.id}/versions/${versionId}/restore`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        if (showNotification) {
          showNotification('success', `File restored to Version ${versionNumber} successfully`);
        }
        if (onRestoreSuccess) {
          await onRestoreSuccess(file.id);
        }
        await fetchVersions();
      } else {
        if (showNotification) {
          showNotification('error', data.message || 'Failed to restore version');
        }
      }
    } catch (err) {
      console.error('Version restore error:', err);
      if (showNotification) {
        showNotification('error', 'Failed to connect to server during restore');
      }
    } finally {
      setRestoringId(null);
    }
  };

  if (!file) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Version History
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-md" title={file.name}>
                {file.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-auto p-5 space-y-3">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <svg className="animate-spin h-7 w-7 text-indigo-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xs text-slate-400 font-medium">Fetching version history...</span>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-center">
              <p className="text-xs font-semibold text-rose-300">{error}</p>
            </div>
          ) : versions.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-400 mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-slate-300">No Previous Versions</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                When you edit and save this file, historical version snapshots will automatically appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {versions.map((ver, idx) => {
                const isLatest = idx === 0;
                const formattedDate = ver.created_at
                  ? new Date(ver.created_at).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : 'Unknown date';

                return (
                  <div
                    key={ver.id}
                    className={`group border rounded-xl p-4 transition flex items-center justify-between gap-4 ${
                      isLatest
                        ? 'bg-indigo-950/20 border-indigo-500/30'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold shrink-0">
                        v{ver.version_number}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-200">
                            {formattedDate}
                          </span>
                          {isLatest && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              Active Snapshot
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 mt-0.5">
                          {formatSize(ver.file_size)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* View / Download Action */}
                      <button
                        type="button"
                        disabled={loadingUrlId === ver.id}
                        onClick={() => handleOpenVersionUrl(ver.id)}
                        className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition flex items-center gap-1.5"
                        title="Download/Preview this version"
                      >
                        {loadingUrlId === ver.id ? (
                          <svg className="animate-spin h-3.5 w-3.5 text-slate-300" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                        )}
                        View
                      </button>

                      {/* Restore Action */}
                      <button
                        type="button"
                        disabled={restoringId === ver.id}
                        onClick={() => handleRestoreVersion(ver.id, ver.version_number)}
                        className="px-3 py-1.5 rounded-lg border border-indigo-500/40 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-xs font-semibold transition flex items-center gap-1.5"
                        title="Restore this version as active file"
                      >
                        {restoringId === ver.id ? (
                          <>
                            <svg className="animate-spin h-3.5 w-3.5 text-indigo-300" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Restoring...
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                            </svg>
                            Restore
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
