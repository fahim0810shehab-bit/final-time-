import React, { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { VibeNode } from '../../types';
import { useEditorStore } from '../../store/editorStore';
import { useDroppable } from '@dnd-kit/core';

interface Props {
  node: VibeNode;
  depth: number;
}

const NodeRenderer = memo(({ node, depth }: Props) => {
  const { type, styles, children, content, src, shapeType, elementId, id } = node;
  const { selectedNodeId, setSelectedNodeId } = useEditorStore();

  const isSelected = selectedNodeId === id;
  const isRoot = type === 'root';
  const isContainer = ['root', 'section', 'container', 'grid'].includes(type);

  const { attributes, listeners, setNodeRef: setSortableRef, transform, transition, isDragging } = useSortable({
    id,
    data: { fromCanvas: true, nodeType: type },
    disabled: isRoot
  });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `drop-${id}`,
    disabled: !isContainer
  });

  const setRef = React.useCallback((el: HTMLElement | null) => {
    setSortableRef(el);
    setDropRef(el);
  }, [setSortableRef, setDropRef]);

  const styleObj: any = { ...styles };

  if (shapeType === 'circle') styleObj.borderRadius = '50%';
  else if (shapeType === 'pill') styleObj.borderRadius = '9999px';
  else if (shapeType === 'triangle') {
    styleObj.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
    styleObj.borderRadius = '0';
  }

  const dndStyles = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedNodeId(id);
  };

  const commonProps: any = {
    id: elementId,
    style: { ...styleObj, ...dndStyles },
    className: `relative group/node ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : 'hover:ring-1 hover:ring-blue-400 hover:ring-inset'} ${isOver && isContainer ? 'ring-2 ring-blue-400 ring-dashed ring-inset' : ''}`,
    onClick: handleSelect,
  };

  if (!isRoot) {
    Object.assign(commonProps, { ...attributes, ...listeners });
  }

  const renderContent = () => {
    if (type === 'text' || type === 'heading') {
      const Tag = type === 'heading' ? 'h2' : 'p';
      return React.createElement(Tag, commonProps, content);
    }
    if (type === 'image') {
      return <img {...commonProps} src={src || 'https://placehold.co/600x400'} alt={node.name} draggable={false} />;
    }
    if (type === 'button') {
      return <button {...commonProps}>{content}</button>;
    }
    if (type === 'divider' || type === 'spacer' || type === 'shape') {
      return <div {...commonProps} />;
    }

    // Container types
    const containerContent = (
      <div {...commonProps} style={{...commonProps.style, minHeight: isRoot ? '100vh' : '20px'}}>
        {children?.map(child => <NodeRenderer key={child.id} node={child} depth={depth + 1} />)}
        {children?.length === 0 && !isRoot && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/node:opacity-100 transition-opacity pointer-events-none">
            <span className="bg-blue-500 text-white text-[10px] px-2 py-1 rounded">Empty {type}</span>
          </div>
        )}
      </div>
    );

    if (isContainer) {
      commonProps.ref = setRef;
      return (
        <div {...commonProps} style={{...commonProps.style, minHeight: isRoot ? '100vh' : '20px'}}>
          {children?.map(child => <NodeRenderer key={child.id} node={child} depth={depth + 1} />)}
          {children?.length === 0 && !isRoot && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/node:opacity-100 transition-opacity pointer-events-none">
              <span className="bg-blue-500 text-white text-[10px] px-2 py-1 rounded">Empty {type}</span>
            </div>
          )}
        </div>
      );
    }

    // fallback for normal elements
    if (!isRoot) commonProps.ref = setSortableRef;
    
    return containerContent;
  };

  return renderContent();
});

export default NodeRenderer;
