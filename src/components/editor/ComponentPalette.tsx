import { useDraggable } from '@dnd-kit/core';
import { Type, Image, Square, Layout, Columns, Box, SplitSquareHorizontal, Minus, ArrowDownToLine } from 'lucide-react';

const elements = [
  { type: 'section', name: 'Section', icon: <Square className="w-4 h-4" /> },
  { type: 'container', name: 'Container', icon: <Box className="w-4 h-4" /> },
  { type: 'grid', name: 'Grid', icon: <Columns className="w-4 h-4" /> },
  { type: 'heading', name: 'Heading', icon: <Type className="w-4 h-4 font-bold" /> },
  { type: 'text', name: 'Text', icon: <Type className="w-4 h-4" /> },
  { type: 'button', name: 'Button', icon: <Layout className="w-4 h-4" /> },
  { type: 'image', name: 'Image', icon: <Image className="w-4 h-4" /> },
  { type: 'divider', name: 'Divider', icon: <Minus className="w-4 h-4" /> },
  { type: 'spacer', name: 'Spacer', icon: <ArrowDownToLine className="w-4 h-4" /> },
  { type: 'shape', name: 'Shape', icon: <SplitSquareHorizontal className="w-4 h-4" /> },
];

export default function ComponentPalette() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Basics</h3>
      <div className="grid grid-cols-2 gap-2">
        {elements.map((el) => (
          <DraggableItem key={el.type} item={el} />
        ))}
      </div>
    </div>
  );
}

function DraggableItem({ item }: { item: any }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${item.type}`,
    data: { fromPalette: true, elementType: item.type },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex flex-col items-center justify-center gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-600 hover:bg-zinc-800 transition-colors cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="text-zinc-400">{item.icon}</div>
      <span className="text-xs font-medium text-zinc-300">{item.name}</span>
    </div>
  );
}
