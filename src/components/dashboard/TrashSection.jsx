import { AlertIcon, TrashIcon } from '../Icons';
import FileList from './FileList';

export default function TrashSection({
  items,
  onRestoreItem,
  onDeletePermanent,
  sortBy,
  sortOrder,
  onSort,
}) {
  return (
    <div className="space-y-4">
      {/* Notice Banner */}
      <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-300">
        <AlertIcon />
        <span>Items in trash will be permanently deleted automatically after 30 days.</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-slate-900/60 border border-slate-800/60 flex items-center justify-center text-slate-500 mx-auto mb-4">
            <TrashIcon />
          </div>
          <h3 className="text-sm font-semibold text-white">Trash is empty</h3>
          <p className="text-slate-400 text-xs mt-1">No deleted files or folders in your account.</p>
        </div>
      ) : (
        <FileList
          items={items}
          activeTab="trash"
          onRestoreItem={onRestoreItem}
          onDeletePermanent={onDeletePermanent}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
        />
      )}
    </div>
  );
}
