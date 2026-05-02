import { useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, PointerSensor, KeyboardSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { useEditorStore } from '../../store/editorStore';
import { defaultNodes } from '../../utils/vibeDefaults';
import { generateId, findNode } from '../../utils/nodeUtils';
import NodeRenderer from './NodeRenderer';
import DragOverlayPreview from './DragOverlayPreview';
import { VibeNode } from '../../types';

export default function Canvas() {
  const { pages, activePageId, addNode, moveNode, setSelectedNodeId } = useEditorStore();
  const activePage = pages.find(p => p.id === activePageId);
  
  const [activeDragItem, setActiveDragItem] = useState<{ id: string, fromPalette?: boolean, elementType?: string, node?: VibeNode } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (e: DragStartEvent) => {
    const { active } = e;
    if (active.data.current?.fromPalette) {
      setActiveDragItem({
        id: active.id as string,
        fromPalette: true,
        elementType: active.data.current.elementType
      });
    } else if (active.data.current?.fromCanvas) {
      const node = activePage ? findNode([activePage.rootNode], active.id as string) : null;
      if (node) {
        setActiveDragItem({ id: active.id as string, node });
      }
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveDragItem(null);
    const { active, over } = e;
    if (!over || !activePage) return;

    const overIdStr = String(over.id);
    let targetParentId = '';
    let insertIndex: number | undefined = undefined;

    if (overIdStr.startsWith('drop-')) {
      targetParentId = overIdStr.replace('drop-', '');
    } else {
      // dropped on a sortable item directly
      // find its parent to insert as sibling
      const overNode = findNode([activePage.rootNode], overIdStr);
      if (overNode) {
        // Find parent
        const findParentId = (nodes: VibeNode[], id: string, pId: string = ''): string => {
          for (let n of nodes) {
            if (n.id === id) return pId;
            if (n.children) {
              const res = findParentId(n.children, id, n.id);
              if (res) return res;
            }
          }
          return '';
        };
        const parentId = findParentId([activePage.rootNode], overIdStr);
        if (parentId) {
          targetParentId = parentId;
          const parentNode = findNode([activePage.rootNode], parentId);
          if (parentNode?.children) {
            insertIndex = parentNode.children.findIndex(c => c.id === overIdStr) + 1;
          }
        }
      }
    }

    if (!targetParentId) {
      targetParentId = activePage.rootNode.id;
    }

    if (active.data.current?.fromPalette) {
      const type = active.data.current.elementType;
      const baseDef = defaultNodes[type];
      if (baseDef) {
        const newNode: VibeNode = {
          ...JSON.parse(JSON.stringify(baseDef)),
          id: generateId(),
        };
        addNode(targetParentId, newNode, insertIndex);
        setSelectedNodeId(newNode.id);
      }
    } else if (active.data.current?.fromCanvas) {
      if (active.id === targetParentId) return; // Can't drop on self
      moveNode(active.id as string, targetParentId, insertIndex);
    }
  };

  if (!activePage) return null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div 
        className="w-full h-full overflow-auto bg-zinc-800/50 relative p-8 flex justify-center custom-scrollbar"
        onClick={() => setSelectedNodeId(null)}
      >
        <div className="bg-white shadow-2xl transition-all duration-200" style={{ minHeight: '100vh', width: '100%', maxWidth: '1200px' }}>
          <NodeRenderer node={activePage.rootNode} depth={0} />
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        {activeDragItem ? <DragOverlayPreview item={activeDragItem} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
