import { useState, useEffect } from 'react';

export default function FilePreviewModal({
  selectedPreviewFile,
  previewLoading,
  previewUrl,
  previewTextContent,
  previewDocxHtml,
  previewError,
  onClose,
  getFileIcon,
  onSaveContent,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!selectedPreviewFile) return;
    let text = '';
    if (selectedPreviewFile.extension === 'pdf') {
      text = '';
    } else if (previewTextContent) {
      text = previewTextContent;
    } else if (previewDocxHtml) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = previewDocxHtml;
      text = tempDiv.textContent || tempDiv.innerText || '';
    }

    const timer = setTimeout(() => {
      setEditedText(text);
      setIsEditing(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [selectedPreviewFile, previewTextContent, previewDocxHtml]);

  if (!selectedPreviewFile) return null;

  const perm = (
    selectedPreviewFile.permission ||
    selectedPreviewFile.shared_permission ||
    (selectedPreviewFile.owner === 'me' ? 'owner' : 'view')
  ).toLowerCase();

  const isEditor = perm === 'edit' || perm === 'editor' || perm === 'owner' || selectedPreviewFile.owner === 'me';

  const handleSave = async () => {
    if (!onSaveContent) return;
    setIsSaving(true);
    try {
      await onSaveContent(selectedPreviewFile.id, editedText);
      setIsEditing(false);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const isTextOrDocx = ['txt', 'html', 'css', 'js', 'jsx', 'json', 'md', 'docx', 'doc', 'pdf'].includes(selectedPreviewFile.extension);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3 min-w-0">
            <span className="shrink-0">{getFileIcon(selectedPreviewFile.extension)}</span>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100 truncate" title={selectedPreviewFile.name}>
                  {selectedPreviewFile.name}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  isEditor 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {isEditor ? (selectedPreviewFile.owner === 'me' ? 'Owner' : 'Editor') : 'Viewer (Read-only)'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5">
                {selectedPreviewFile.size} • Modified {selectedPreviewFile.updatedAt}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Editor Action Buttons */}
            {isEditor && isTextOrDocx && !previewLoading && (
              isEditing ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3.5 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Edit Document
                </button>
              )
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="Close preview"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body / Viewer / Editor */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-950/20 min-h-[400px]">
          {previewLoading ? (
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xs text-slate-400 font-medium">Loading document...</span>
            </div>
          ) : isEditing ? (
            selectedPreviewFile.extension === 'pdf' ? (
              <div className="w-full h-[60vh] flex flex-col md:flex-row gap-4">
                {/* Left: Original PDF Viewer (100% Visible) */}
                <div className="flex-1 h-full border border-slate-800 rounded-lg overflow-hidden bg-slate-900">
                  <iframe 
                    src={`${previewUrl}#toolbar=0`} 
                    title={selectedPreviewFile.name} 
                    className="w-full h-full border-0"
                  />
                </div>
                {/* Right: PDF Edit Panel */}
                <div className="flex-1 h-full flex flex-col gap-2 text-left">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Edit Document Text / Annotations:</span>
                    <span className="text-[10px] text-slate-500 font-normal">Original PDF visible on left</span>
                  </label>
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full flex-1 border border-slate-700 focus:border-indigo-500 rounded-lg p-3 bg-slate-950 font-sans text-sm text-slate-100 outline-none resize-none leading-relaxed shadow-inner"
                    placeholder="Type document text edits or notes to save to this PDF..."
                  />
                </div>
              </div>
            ) : (
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full h-[60vh] border border-slate-700 focus:border-indigo-500 rounded-lg p-4 bg-slate-950 font-sans text-sm text-slate-100 outline-none resize-none leading-relaxed shadow-inner"
                placeholder="Edit document content..."
              />
            )
          ) : (
            <>
              {/* Image Preview */}
              {['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(selectedPreviewFile.extension) && previewUrl && (
                <img 
                  src={previewUrl} 
                  alt={selectedPreviewFile.name} 
                  loading="lazy"
                  className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-md"
                />
              )}

              {/* PDF Preview */}
              {selectedPreviewFile.extension === 'pdf' && previewUrl && (
                <iframe 
                  src={`${previewUrl}#toolbar=0`} 
                  title={selectedPreviewFile.name} 
                  className="w-full h-[60vh] border border-slate-800 rounded-lg bg-slate-900"
                />
              )}

              {/* Text Preview */}
              {['txt', 'html', 'css', 'js', 'jsx', 'json', 'md'].includes(selectedPreviewFile.extension) && (
                <div className="w-full h-[60vh] overflow-auto border border-slate-800 rounded-lg p-4 bg-slate-950 font-mono text-xs text-slate-300 whitespace-pre-wrap select-text text-left leading-relaxed">
                  {previewTextContent || "Empty file content."}
                </div>
              )}

              {/* DOCX Preview */}
              {['docx', 'doc'].includes(selectedPreviewFile.extension) && (
                previewError ? (
                  <div className="flex flex-col items-center text-center max-w-sm py-10">
                    <div className="w-16 h-16 rounded-full bg-rose-950/60 border border-rose-800/80 flex items-center justify-center text-rose-400 mb-5 shadow-sm">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-bold text-white">Preview unavailable</h4>
                    <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                      {previewError}
                    </p>
                  </div>
                ) : (
                  <div 
                    className="w-full h-[60vh] overflow-auto border border-slate-800 rounded-lg p-6 bg-slate-900 text-slate-200 text-sm select-text text-left leading-relaxed docx-preview-content"
                    dangerouslySetInnerHTML={{ __html: previewDocxHtml || "<p className='text-slate-500 italic'>Empty document.</p>" }}
                  />
                )
              )}              {/* PPT / PPTX Preview */}
              {['ppt', 'pptx'].includes(selectedPreviewFile.extension) && previewUrl && (
                <iframe 
                  src={previewUrl.includes('localhost') ? previewUrl : `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewUrl)}`}
                  title={selectedPreviewFile.name} 
                  className="w-full h-[60vh] border border-slate-800 rounded-lg bg-slate-900"
                />
              )}

              {/* Video Preview */}
              {['mp4', 'webm'].includes(selectedPreviewFile.extension) && previewUrl && (
                <video controls src={previewUrl} className="max-w-full max-h-[60vh] rounded-lg shadow-md" />
              )}

              {/* Audio Preview */}
              {['mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(selectedPreviewFile.extension) && previewUrl && (
                <audio controls src={previewUrl} className="w-full max-w-md" />
              )}

              {/* Unsupported File Preview */}
              {!['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'txt', 'html', 'css', 'js', 'jsx', 'json', 'md', 'docx', 'doc', 'ppt', 'pptx', 'mp4', 'webm', 'mp3', 'wav', 'ogg', 'm4a', 'flac'].includes(selectedPreviewFile.extension) && (
                <div className="flex flex-col items-center text-center max-w-sm py-10">
                  <div className="w-16 h-16 rounded-full bg-slate-900/60 border border-slate-800/80 flex items-center justify-center text-slate-500 mb-5 shadow-sm">
                    <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12h9m9 3H12m1.5-4.5H12M3.75 6H7.5m-.75 3h7.5M3.75 21h16.5c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H16.5L12 3H5.25A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-white">Preview not available</h4>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed mb-5">
                    Nexora Drive does not support in-app previews for <b>.{selectedPreviewFile.extension}</b> files. You can download the file to view it.
                  </p>
                  {previewUrl && (
                    <a
                      href={previewUrl}
                      download={selectedPreviewFile.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      Download File
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
