import { Suspense } from 'react';

export default function DashboardModals({
  notification,
  setNotification,
  selectedPreviewFile,
  setSelectedPreviewFile,
  previewLoading,
  previewUrl,
  previewTextContent,
  previewDocxHtml,
  previewError,
  getFileIcon,
  handleSaveFileContent,
  handleOpenVersionHistory,
  selectedShareFile,
  setSelectedShareFile,
  showNotification,
  selectedVersionFile,
  setSelectedVersionFile,
  handleVersionRestoreSuccess,
  FilePreviewModal,
  ShareModal,
  VersionHistoryModal,
}) {
  return (
    <>
      {/* Toast Notifications */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-lg text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2 duration-200 ${notification.type === 'success'
          ? 'bg-emerald-950/90 border-emerald-800 text-emerald-300'
          : 'bg-rose-950/90 border-rose-800 text-rose-300'
          }`}>
          <span>{notification.type === 'success' ? '✓' : '✕'}</span>
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* FILE PREVIEW MODAL */}
      <Suspense fallback={null}>
        <FilePreviewModal
          selectedPreviewFile={selectedPreviewFile}
          previewLoading={previewLoading}
          previewUrl={previewUrl}
          previewTextContent={previewTextContent}
          previewDocxHtml={previewDocxHtml}
          previewError={previewError}
          onClose={() => setSelectedPreviewFile(null)}
          getFileIcon={getFileIcon}
          onSaveContent={handleSaveFileContent}
          onOpenVersionHistory={handleOpenVersionHistory}
        />
      </Suspense>

      {/* SHARE MODAL */}
      {selectedShareFile && (
        <Suspense fallback={null}>
          <ShareModal
            file={selectedShareFile}
            onClose={() => setSelectedShareFile(null)}
            showNotification={showNotification}
          />
        </Suspense>
      )}

      {/* VERSION HISTORY MODAL */}
      {selectedVersionFile && (
        <Suspense fallback={null}>
          <VersionHistoryModal
            file={selectedVersionFile}
            onClose={() => setSelectedVersionFile(null)}
            onRestoreSuccess={handleVersionRestoreSuccess}
            showNotification={showNotification}
          />
        </Suspense>
      )}
    </>
  );
}
