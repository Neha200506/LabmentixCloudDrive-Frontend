import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../config';

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
  onOpenVersionHistory,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedHtml, setEditedHtml] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const editorRef = useRef(null);

  useEffect(() => {
    if (!selectedPreviewFile) return;
    let contentHtml = '';
    if (previewDocxHtml) {
      contentHtml = previewDocxHtml;
    } else if (previewTextContent) {
      contentHtml = previewTextContent
        .split('\n')
        .map(line => `<p>${line.replace(/</g, '&lt;').replace(/>/g, '&gt;') || '<br/>'}</p>`)
        .join('');
    }

    const timer = setTimeout(() => {
      setEditedHtml(contentHtml);
      setIsEditing(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [selectedPreviewFile, previewTextContent, previewDocxHtml]);

  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.innerHTML = editedHtml || '<p>Type document content here...</p>';
    }
  }, [isEditing, editedHtml]);

  if (!selectedPreviewFile) return null;

  const perm = (
    selectedPreviewFile.permission ||
    selectedPreviewFile.shared_permission ||
    (selectedPreviewFile.owner === 'me' ? 'owner' : 'view')
  ).toLowerCase();

  const isEditor = perm === 'edit' || perm === 'editor' || perm === 'owner' || selectedPreviewFile.owner === 'me';
  const isTextOrDocx = ['txt', 'html', 'css', 'js', 'jsx', 'json', 'md', 'docx', 'doc', 'pdf'].includes(selectedPreviewFile.extension);

  const handleStartEdit = async () => {
    let initialContent = editedHtml;
    if (selectedPreviewFile.extension === 'pdf') {
      setPdfLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/files/${selectedPreviewFile.id}/pdf-text`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.html) {
          initialContent = data.html;
          setEditedHtml(data.html);
        }
      } catch (err) {
        console.error("PDF text load error:", err);
      } finally {
        setPdfLoading(false);
      }
    }

    setIsEditing(true);

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = initialContent || '<p>Type document content here...</p>';
      }
    }, 0);
  };

  const executeCmd = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleSave = async () => {
    if (!onSaveContent) return;
    setIsSaving(true);
    try {
      const finalHtml = editorRef.current ? editorRef.current.innerHTML : editedHtml;
      await onSaveContent(selectedPreviewFile.id, finalHtml);
      setIsEditing(false);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[94vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-3.5 py-3 sm:px-6 sm:py-4 border-b border-slate-800 bg-slate-950/50 shrink-0 gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <span className="shrink-0">{getFileIcon(selectedPreviewFile.extension)}</span>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                  <span className="text-xs sm:text-sm font-bold text-slate-100 truncate max-w-[140px] xs:max-w-[220px] sm:max-w-md" title={selectedPreviewFile.name}>
                    {selectedPreviewFile.name}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0 ${isEditor
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                    {isEditor ? (selectedPreviewFile.owner === 'me' ? 'Owner' : 'Editor') : 'Viewer (Read-only)'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 truncate">
                  {selectedPreviewFile.size} • Modified {selectedPreviewFile.updatedAt}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0 w-full sm:w-auto justify-end">
            {/* Editor Action Buttons */}
            {isEditor && isTextOrDocx && !previewLoading && (
              isEditing ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
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
                  onClick={handleStartEdit}
                  disabled={pdfLoading}
                  className="px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  {pdfLoading ? (
                    <svg className="animate-spin h-3.5 w-3.5 text-indigo-300" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                  )}
                  Edit Document
                </button>
              )
            )}

            {onOpenVersionHistory && (
              <button
                onClick={() => onOpenVersionHistory(selectedPreviewFile)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition flex items-center gap-1.5"
                title="View version history"
              >
                <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                History
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition shrink-0"
              title="Close preview"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body / Viewer / Editor */}
        <div className="flex-1 overflow-auto p-2 sm:p-6 flex items-center justify-center bg-slate-950/40 min-h-0">
          {previewLoading ? (
            <div className="flex flex-col items-center justify-center my-auto gap-3 py-12">
              <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xs text-slate-400 font-medium">Loading document...</span>
            </div>
          ) : isEditing ? (
            <div className="w-full max-w-4xl flex flex-col h-[70vh] sm:h-[65vh] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              {/* Document Editor Formatting Toolbar */}
              <div className="flex items-center gap-1 p-1.5 sm:p-2 bg-slate-950 border-b border-slate-800 flex-wrap shrink-0 select-none overflow-x-auto max-w-full">
                <button
                  type="button"
                  onClick={() => executeCmd('undo')}
                  className="p-1.5 text-xs font-medium hover:bg-slate-800 text-slate-300 hover:text-white rounded px-2 transition flex items-center gap-1 shrink-0"
                  title="Undo (Ctrl+Z)"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                  </svg>
                  Undo
                </button>
                <button
                  type="button"
                  onClick={() => executeCmd('redo')}
                  className="p-1.5 text-xs font-medium hover:bg-slate-800 text-slate-300 hover:text-white rounded px-2 transition flex items-center gap-1 shrink-0"
                  title="Redo (Ctrl+Y)"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
                  </svg>
                  Redo
                </button>
                <div className="hidden xs:block h-4 w-px bg-slate-800 mx-0.5 shrink-0" />
                <button
                  type="button"
                  onClick={() => executeCmd('bold')}
                  className="p-1.5 text-xs font-bold hover:bg-slate-800 text-slate-200 rounded px-2 transition shrink-0"
                  title="Bold"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => executeCmd('italic')}
                  className="p-1.5 text-xs italic hover:bg-slate-800 text-slate-200 rounded px-2 transition shrink-0"
                  title="Italic"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => executeCmd('underline')}
                  className="p-1.5 text-xs underline hover:bg-slate-800 text-slate-200 rounded px-2 transition shrink-0"
                  title="Underline"
                >
                  U
                </button>
                <div className="hidden xs:block h-4 w-px bg-slate-800 mx-0.5 shrink-0" />
                <button
                  type="button"
                  onClick={() => executeCmd('formatBlock', '<h1>')}
                  className="p-1.5 text-xs font-semibold hover:bg-slate-800 text-slate-200 rounded px-2 transition shrink-0"
                  title="Heading 1"
                >
                  H1
                </button>
                <button
                  type="button"
                  onClick={() => executeCmd('formatBlock', '<h2>')}
                  className="p-1.5 text-xs font-semibold hover:bg-slate-800 text-slate-200 rounded px-2 transition shrink-0"
                  title="Heading 2"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => executeCmd('formatBlock', '<p>')}
                  className="p-1.5 text-xs hover:bg-slate-800 text-slate-200 rounded px-2 transition shrink-0"
                  title="Paragraph"
                >
                  P
                </button>
                <div className="hidden xs:block h-4 w-px bg-slate-800 mx-0.5 shrink-0" />
                <button
                  type="button"
                  onClick={() => executeCmd('insertUnorderedList')}
                  className="p-1.5 text-xs hover:bg-slate-800 text-slate-200 rounded px-2 transition shrink-0"
                  title="Bulleted List"
                >
                  • List
                </button>
                <button
                  type="button"
                  onClick={() => executeCmd('insertOrderedList')}
                  className="p-1.5 text-xs hover:bg-slate-800 text-slate-200 rounded px-2 transition shrink-0"
                  title="Numbered List"
                >
                  1. List
                </button>
                <div className="hidden xs:block h-4 w-px bg-slate-800 mx-0.5 shrink-0" />
                <button
                  type="button"
                  onClick={() => executeCmd('justifyLeft')}
                  className="p-1.5 text-xs hover:bg-slate-800 text-slate-200 rounded px-2 transition shrink-0"
                  title="Align Left"
                >
                  Left
                </button>
                <button
                  type="button"
                  onClick={() => executeCmd('justifyCenter')}
                  className="p-1.5 text-xs hover:bg-slate-800 text-slate-200 rounded px-2 transition shrink-0"
                  title="Align Center"
                >
                  Center
                </button>
                <button
                  type="button"
                  onClick={() => executeCmd('justifyRight')}
                  className="p-1.5 text-xs hover:bg-slate-800 text-slate-200 rounded px-2 transition shrink-0"
                  title="Align Right"
                >
                  Right
                </button>
              </div>

              {/* Styled Document Paper Container */}
              <div className="flex-1 p-2.5 sm:p-6 overflow-auto bg-slate-950/60 flex justify-center w-full min-h-0">
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  className="w-full max-w-3xl min-h-[350px] sm:min-h-[480px] bg-slate-900 text-slate-100 border border-slate-800 rounded-lg p-3.5 sm:p-8 shadow-inner font-sans text-sm leading-relaxed outline-none focus:border-indigo-500/60 select-text docx-preview-content break-words overflow-x-hidden max-w-full"
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {/* Image Preview */}
              {['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(selectedPreviewFile.extension) && previewUrl && (
                <div className="w-full max-w-4xl h-[65vh] flex items-center justify-center overflow-hidden">
                  <img
                    src={previewUrl}
                    alt={selectedPreviewFile.name}
                    loading="lazy"
                    className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-lg"
                  />
                </div>
              )}

              {/* PDF Preview */}
              {selectedPreviewFile.extension === 'pdf' && previewUrl && (
                <div className="w-full max-w-4xl h-[65vh] overflow-hidden border border-slate-800 rounded-xl bg-slate-900 shadow-lg flex items-center justify-center">
                  <iframe
                    src={`${previewUrl}#toolbar=0`}
                    title={selectedPreviewFile.name}
                    className="w-full h-full border-0 rounded-xl"
                  />
                </div>
              )}

              {/* Text Preview */}
              {['txt', 'html', 'css', 'js', 'jsx', 'json', 'md'].includes(selectedPreviewFile.extension) && (
                <div className="w-full max-w-4xl h-[65vh] overflow-auto border border-slate-800 rounded-xl p-3.5 sm:p-6 bg-slate-950 font-mono text-xs text-slate-300 whitespace-pre-wrap break-words max-w-full select-text text-left leading-relaxed shadow-lg">
                  {previewTextContent || "Empty file content."}
                </div>
              )}

              {/* DOCX Preview */}
              {['docx', 'doc'].includes(selectedPreviewFile.extension) && (
                previewError ? (
                  <div className="flex flex-col items-center justify-center text-center max-w-sm py-10">
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
                  <div className="w-full max-w-4xl h-[65vh] overflow-auto border border-slate-800 rounded-xl bg-slate-900 p-3.5 sm:p-8 text-slate-200 text-sm select-text text-left leading-relaxed docx-preview-content break-words max-w-full shadow-lg">
                    <div dangerouslySetInnerHTML={{ __html: previewDocxHtml || "<p className='text-slate-500 italic'>Empty document.</p>" }} />
                  </div>
                )
              )}

              {/* PPT / PPTX Preview */}
              {['ppt', 'pptx'].includes(selectedPreviewFile.extension) && previewUrl && (
                <div className="w-full max-w-4xl h-[65vh] overflow-hidden border border-slate-800 rounded-xl bg-slate-900 shadow-lg flex items-center justify-center">
                  <iframe
                    src={previewUrl.includes('localhost') || previewUrl.includes('127.0.0.1') ? previewUrl : `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewUrl)}`}
                    title={selectedPreviewFile.name}
                    className="w-full h-full border-0 rounded-xl"
                  />
                </div>
              )}

              {/* Video Preview */}
              {['mp4', 'webm'].includes(selectedPreviewFile.extension) && previewUrl && (
                <video controls src={previewUrl} className="max-w-full max-h-[65vh] rounded-lg shadow-md" />
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
