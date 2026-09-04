import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config';

export default function ShareModal({ file, onClose, showNotification }) {
  const [email, setEmail] = useState('');
  const [permissionType, setPermissionType] = useState('Viewer');
  const [sharedUsers, setSharedUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [publicLink, setPublicLink] = useState('');
  const [publicRole, setPublicRole] = useState('view'); // 'view' or 'edit'
  const [modalNotification, setModalNotification] = useState(null);

  const showModalNotification = (type, message) => {
    setModalNotification({ type, message });
    setTimeout(() => setModalNotification(null), 4000);
    if (showNotification) {
      showNotification(type, message);
    }
  };

  const token = localStorage.getItem('token');

  // Fetch users with access
  const fetchSharedUsers = async () => {
    if (!file) return;
    setLoadingUsers(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/share/file/${file.id}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setSharedUsers(data.users || []);
      } else {
        console.error(data.message || 'Failed to fetch shared users');
      }
    } catch (err) {
      console.error('Error fetching shared users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSharedUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // Share with another user by email
  const handleShare = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('error', 'Please enter a valid email address');
      return;
    }

    setSharing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/share/file`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_id: file.id,
          email: email.trim(),
          permission_type: permissionType,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        showModalNotification('success', `File shared successfully with ${email}`);
        setEmail('');
        fetchSharedUsers();
      } else {
        showModalNotification('error', data.message || 'Failed to share file');
      }
    } catch (err) {
      console.error('Share error:', err);
      showModalNotification('error', 'An error occurred while sharing the file');
    } finally {
      setSharing(false);
    }
  };

  // Update user permission
  const handleUpdatePermission = async (userId, newPermission) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/share/file/${file.id}/permission`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          permission_type: newPermission,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        showModalNotification('success', 'Permissions updated successfully');
        fetchSharedUsers();
      } else {
        showModalNotification('error', data.message || 'Failed to update permissions');
      }
    } catch (err) {
      console.error('Update permission error:', err);
      showModalNotification('error', 'An error occurred while updating permissions');
    }
  };

  // Remove user permission
  const handleRemovePermission = async (userId, userEmail) => {
    if (!confirm(`Are you sure you want to remove access for ${userEmail}?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/share/file/${file.id}/permission/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        showModalNotification('success', `Removed access for ${userEmail}`);
        fetchSharedUsers();
      } else {
        showModalNotification('error', data.message || 'Failed to remove access');
      }
    } catch (err) {
      console.error('Remove permission error:', err);
      showModalNotification('error', 'An error occurred while removing access');
    }
  };

  // Generate public link
  const handleGenerateLink = async () => {
    setGeneratingLink(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/share/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_id: file.id,
          role: publicRole,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setPublicLink(data.share_url);
        showModalNotification('success', 'Public share link generated');
      } else {
        showModalNotification('error', data.message || 'Failed to generate public link');
      }
    } catch (err) {
      console.error('Generate public link error:', err);
      showModalNotification('error', 'An error occurred while generating link');
    } finally {
      setGeneratingLink(false);
    }
  };

  // Copy link to clipboard
  const handleCopyLink = () => {
    if (!publicLink) return;
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(publicLink)
        .then(() => {
          showModalNotification('success', 'Link copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy using navigator.clipboard: ', err);
          fallbackCopyText(publicLink);
        });
    } else {
      fallbackCopyText(publicLink);
    }
  };

  const fallbackCopyText = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        showModalNotification('success', 'Link copied to clipboard!');
      } else {
        showModalNotification('error', 'Failed to copy link.');
      }
    } catch (err) {
      console.error('Fallback copy failed: ', err);
      showModalNotification('error', 'Failed to copy link.');
    }
    document.body.removeChild(textArea);
  };

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#090e18] border border-slate-800/80 rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/60 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186 2.015.938a2.25 2.25 0 1 0 0 1.248l-2.015-.938M7.217 10.907a2.25 2.25 0 1 1 0-2.186m0 2.186 2.015-.938a2.25 2.25 0 1 1 0-1.248l-2.015.938m0 0a2.25 2.25 0 1 0 2.25 2.25" />
              </svg>
            </span>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-slate-100">Share "{file.name}"</h3>
              <span className="text-[10px] text-slate-500 mt-0.5">Manage permissions and sharing access</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Notification Banner */}
        {modalNotification && (
          <div className={`mx-6 mt-4 px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition animate-in fade-in ${
            modalNotification.type === 'success' 
              ? 'bg-emerald-950/90 border-emerald-800 text-emerald-300' 
              : 'bg-rose-950/90 border-rose-800 text-rose-300'
          }`}>
            <div className="flex items-center gap-2">
              <span>{modalNotification.type === 'success' ? '✓' : '✕'}</span>
              <span>{modalNotification.message}</span>
            </div>
            <button onClick={() => setModalNotification(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Scrollable Container */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6 select-text">
          
          {/* Section A: Share with people */}
          <form onSubmit={handleShare} className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Share with people</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Add registered user email..."
                className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-800/80 text-white rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-slate-950 placeholder-slate-600 transition"
              />
              <select
                value={permissionType}
                onChange={(e) => setPermissionType(e.target.value)}
                className="px-2.5 py-2 text-xs bg-slate-900 border border-slate-800/80 text-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="Viewer">Viewer</option>
                <option value="Editor">Editor</option>
              </select>
              <button
                type="submit"
                disabled={sharing}
                className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 disabled:bg-indigo-800 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition"
              >
                {sharing ? 'Sharing...' : 'Share'}
              </button>
            </div>
          </form>

          {/* Section B: People with access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
              <span>People with access</span>
              {loadingUsers && (
                <svg className="animate-spin h-3.5 w-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
            </h4>

            {sharedUsers.length === 0 && !loadingUsers ? (
              <p className="text-xs text-slate-500 italic py-1">This file hasn't been shared with anyone yet.</p>
            ) : (
              <div className="border border-slate-800/50 rounded-xl overflow-hidden bg-slate-900/10 divide-y divide-slate-850/50 max-h-48 overflow-y-auto">
                {sharedUsers.map((user) => (
                  <div key={user.id} className="p-3 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {user.full_name ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-slate-200 truncate">{user.full_name || 'Nexora User'}</span>
                        <span className="text-[10px] text-slate-500 truncate">{user.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={user.permission_type}
                        onChange={(e) => handleUpdatePermission(user.id, e.target.value)}
                        className="px-2 py-1 text-[10px] bg-slate-900 border border-slate-800/80 text-slate-300 rounded focus:outline-none"
                      >
                        <option value="Viewer">Viewer</option>
                        <option value="Editor">Editor</option>
                      </select>
                      <button
                        onClick={() => handleRemovePermission(user.id, user.email)}
                        className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800/40 transition"
                        title="Remove Access"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section C: General access */}
          <div className="space-y-3 pt-2 border-t border-slate-800/60">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">General access</h4>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Anyone with the link can access as:</span>
                <select
                  value={publicRole}
                  onChange={(e) => setPublicRole(e.target.value)}
                  className="px-2 py-1 text-[10px] bg-slate-900 border border-slate-800/80 text-slate-300 rounded focus:outline-none"
                >
                  <option value="view">Viewer</option>
                  <option value="edit">Editor</option>
                </select>
              </div>

              {publicLink ? (
                <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 p-2 rounded-lg text-xs">
                  <span className="flex-1 truncate text-slate-300 font-mono text-[10px]">{publicLink}</span>
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 font-semibold rounded text-[10px] transition shrink-0"
                  >
                    Copy link
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGenerateLink}
                  disabled={generatingLink}
                  className="py-2.5 border border-slate-800 hover:bg-slate-900 text-slate-200 text-xs font-semibold rounded-lg shadow-xs transition text-center flex items-center justify-center gap-2"
                >
                  {generatingLink ? (
                    'Generating...'
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      <span>Generate public share link</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800/60 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-800 hover:bg-slate-900 text-slate-300 text-xs font-semibold rounded-lg transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
