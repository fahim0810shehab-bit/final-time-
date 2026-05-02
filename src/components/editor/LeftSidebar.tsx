import { useState } from 'react';
import { Layers, Plus, LayoutTemplate } from 'lucide-react';
import ComponentPalette from './ComponentPalette';
import LayerPanel from './LayerPanel';
import TemplatePanel from './TemplatePanel';

export default function LeftSidebar() {
  const [activeTab, setActiveTab] = useState<'add' | 'layers' | 'templates'>('add');

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-full shrink-0 z-10">
      <div className="flex p-2 gap-1 border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('add')}
          className={`flex-1 flex flex-col items-center py-2 px-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'add' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}
        >
          <Plus className="w-4 h-4 mb-1" />
          Add
        </button>
        <button
          onClick={() => setActiveTab('layers')}
          className={`flex-1 flex flex-col items-center py-2 px-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'layers' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}
        >
          <Layers className="w-4 h-4 mb-1" />
          Layers
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 flex flex-col items-center py-2 px-1 rounded-md text-xs font-medium transition-colors ${activeTab === 'templates' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}
        >
          <LayoutTemplate className="w-4 h-4 mb-1" />
          Templates
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {activeTab === 'add' && <ComponentPalette />}
        {activeTab === 'layers' && <LayerPanel />}
        {activeTab === 'templates' && <TemplatePanel />}
      </div>
    </div>
  );
}
