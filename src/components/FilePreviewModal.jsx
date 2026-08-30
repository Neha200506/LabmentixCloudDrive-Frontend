export default function FilePreviewModal({
  selectedPreviewFile,
  previewLoading,
  previewUrl,
  previewTextContent,
  onClose,
  getFileIcon,
}) {
  if (!selectedPreviewFile) return null;

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
              <span className="text-sm font-bold text-slate-100 truncate" title={selectedPreviewFile.name}>
                {selectedPreviewFile.name}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                {selectedPreviewFile.size} • Modified {selectedPreviewFile.updatedAt}
              </span>
            </div>
          </div>
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

        {/* Modal Body / Viewer */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-slate-950/20 min-h-[400px]">
          {previewLoading ? (
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xs text-slate-400 font-medium">Generating preview...</span>
            </div>
          ) : (
            <>
              {/* Image Preview */}
              {['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(selectedPreviewFile.extension) && previewUrl && (
                <img 
                  src={previewUrl} 
                  alt={selectedPreviewFile.name} 
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

              {/* Unsupported File Preview */}
              {!['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'pdf', 'txt', 'html', 'css', 'js', 'jsx', 'json', 'md'].includes(selectedPreviewFile.extension) && (
                <div className="flex flex-col items-center text-center max-w-sm py-10">
                  <div className="w-16 h-16 rounded-full bg-slate-900/60 border border-slate-800/80 flex items-center justify-center text-slate-500 mb-5 shadow-sm">
                    <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12h9m9 3H12m1.5-4.5H12M3.75 6H7.5m-.75 3h7.5M3.75 21h16.5c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H16.5L12 3H5.25A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-white">Preview not available</h4>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                    Nexora Drive does not support previews for <b>.{selectedPreviewFile.extension}</b> files. You can download the file to view it.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
