import { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { Plus, X, Edit2 } from 'lucide-react';

export default function PageManager() {
  const { pages, activePageId, setActivePageId, addPage, renamePage, deletePage } = useEditorStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddPage = () => {
    const name = prompt('Enter page name:', 'New Page');
    if (name) addPage(name);
  };

  const handleRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const submitRename = () => {
    if (editingId && editName.trim()) {
      renamePage(editingId, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="h-10 bg-zinc-950 border-b border-zinc-800 flex items-center shrink-0 px-2 overflow-x-auto custom-scrollbar">
      {pages.map(page => (
        <div
          key={page.id}
          className={`group flex items-center gap-2 px-4 h-full border-r border-zinc-800 min-w-[120px] max-w-[200px] cursor-pointer transition-colors relative
            ${activePageId === page.id ? 'bg-zinc-900 text-white border-b-2 border-b-blue-500' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'}
          `}
          onClick={() => setActivePageId(page.id)}
          onDoubleClick={(e) => { e.stopPropagation(); handleRename(page.id, page.name); }}
        >
          {editingId === page.id ? (
            <input
              autoFocus
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onBlur={submitRename}
              onKeyDown={e => e.key === 'Enter' && submitRename()}
              className="bg-transparent text-sm font-medium text-white outline-none w-full"
            />
          ) : (
            <span className="text-sm font-medium truncate flex-1">{page.name}</span>
          )}
          
          <div className="hidden group-hover:flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); handleRename(page.id, page.name); }}
              className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            {pages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); deletePage(page.id); }}
                className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-red-400"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      ))}
      <button
        onClick={handleAddPage}
        className="h-full px-4 text-zinc-400 hover:bg-zinc-900 hover:text-white flex items-center transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
