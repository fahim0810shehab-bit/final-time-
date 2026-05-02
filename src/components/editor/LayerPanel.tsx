import { useEditorStore } from '../../store/editorStore';
import { VibeNode } from '../../types';
import { ChevronRight, ChevronDown, Copy, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function LayerPanel() {
  const { pages, activePageId } = useEditorStore();
  const activePage = pages.find(p => p.id === activePageId);

  if (!activePage) return <div className="text-sm text-zinc-500">No active page</div>;

  return (
    <div className="flex flex-col gap-1">
      <LayerItem node={activePage.rootNode} depth={0} />
    </div>
  );
}

function LayerItem({ node, depth }: { node: VibeNode, depth: number }) {
  const [expanded, setExpanded] = useState(true);
  const { selectedNodeId, setSelectedNodeId, removeNode, duplicateNode } = useEditorStore();
  const isSelected = selectedNodeId === node.id;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col">
      <div
        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer group transition-colors ${isSelected ? 'bg-blue-600/20 text-blue-400' : 'text-zinc-300 hover:bg-zinc-800'}`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
      >
        <div 
          className="w-4 h-4 flex items-center justify-center shrink-0"
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        >
          {hasChildren ? (
            expanded ? <ChevronDown className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-300" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-500 hover:text-zinc-300" />
          ) : <div className="w-3.5 h-3.5" />}
        </div>
        <span className="text-xs truncate flex-1">{node.name || node.type}</span>
        
        {node.type !== 'root' && (
          <div className="hidden group-hover:flex items-center gap-1">
            <button onClick={(e) => { e.stopPropagation(); duplicateNode(node.id); }} className="p-1 hover:bg-zinc-700 rounded text-zinc-500 hover:text-white" title="Duplicate">
              <Copy className="w-3 h-3" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); removeNode(node.id); }} className="p-1 hover:bg-zinc-700 rounded text-zinc-500 hover:text-red-400" title="Delete">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {expanded && hasChildren && (
        <div className="flex flex-col">
          {node.children!.map((child) => (
            <LayerItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
