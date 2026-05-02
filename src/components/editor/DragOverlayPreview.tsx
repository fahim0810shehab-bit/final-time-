import { VibeNode } from '../../types';

interface Props {
  item: { id: string; fromPalette?: boolean; elementType?: string; node?: VibeNode };
}

export default function DragOverlayPreview({ item }: Props) {
  if (item.fromPalette) {
    return (
      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-xl font-medium text-sm border border-blue-400 rotate-3">
        Adding {item.elementType}...
      </div>
    );
  }

  if (item.node) {
    return (
      <div className="bg-blue-600/90 backdrop-blur text-white px-4 py-2 rounded-lg shadow-2xl font-medium text-sm border border-blue-400 rotate-2 pointer-events-none">
        Moving {item.node.name || item.node.type}
      </div>
    );
  }

  return null;
}
