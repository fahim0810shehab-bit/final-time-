import { useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { VibeNode } from '../../types';
import { findNode } from '../../utils/nodeUtils';
import { ChevronDown, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { SeliseMedia } from '../../lib/selise';
import { useAuthStore } from '../../store/authStore';

export default function Inspector() {
  const { pages, activePageId, selectedNodeId, updateNode } = useEditorStore();
  const { user } = useAuthStore();
  
  const activePage = pages.find(p => p.id === activePageId);
  const selectedNode = activePage && selectedNodeId ? findNode([activePage.rootNode], selectedNodeId) : null;

  if (!selectedNode) {
    return (
      <div className="w-72 bg-zinc-950 border-l border-zinc-800 h-full flex flex-col items-center justify-center p-6 text-center text-zinc-500 shrink-0 z-10">
        <p className="text-sm">Select an element on the canvas to edit its properties.</p>
      </div>
    );
  }

  const handleStyleChange = (key: string, value: string) => {
    updateNode(selectedNode.id, { styles: { ...selectedNode.styles, [key]: value } });
  };

  const handleChange = (key: keyof VibeNode, value: any) => {
    updateNode(selectedNode.id, { [key]: value });
  };

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user) return;
    setUploading(true);
    try {
      const url = await SeliseMedia.upload(user.token, e.target.files[0]);
      handleChange('src', url);
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-72 bg-zinc-950 border-l border-zinc-800 h-full flex flex-col shrink-0 z-10 overflow-y-auto custom-scrollbar">
      <div className="p-4 border-b border-zinc-800 sticky top-0 bg-zinc-950 z-10">
        <h2 className="text-sm font-semibold text-white">Inspector</h2>
        <p className="text-xs text-zinc-400 capitalize">{selectedNode.type}</p>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <Section title="General">
          <Input label="Layer Name" value={selectedNode.name} onChange={(v) => handleChange('name', v)} />
          <Input label="Element ID" value={selectedNode.elementId || ''} onChange={(v) => handleChange('elementId', v)} />
          
          {(selectedNode.type === 'text' || selectedNode.type === 'heading' || selectedNode.type === 'button') && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400">Content</label>
              <textarea
                value={selectedNode.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500 min-h-[60px]"
              />
            </div>
          )}

          {selectedNode.type === 'button' && (
            <Input label="Link URL" value={selectedNode.href || ''} onChange={(v) => handleChange('href', v)} />
          )}

          {selectedNode.type === 'image' && (
            <>
              <Input label="Image URL" value={selectedNode.src || ''} onChange={(v) => handleChange('src', v)} />
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-xs text-zinc-400">Upload Media</label>
                <label className="flex items-center justify-center gap-2 w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 border-dashed rounded-md px-2.5 py-4 cursor-pointer transition-colors">
                  <ImageIcon className="w-4 h-4 text-zinc-500" />
                  <span className="text-xs text-zinc-400">{uploading ? 'Uploading...' : 'Choose file'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </>
          )}

          {selectedNode.type === 'shape' && (
            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-xs text-zinc-400">Shape</label>
              <select
                value={selectedNode.shapeType || 'rectangle'}
                onChange={(e) => handleChange('shapeType', e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="rectangle">Rectangle</option>
                <option value="circle">Circle</option>
                <option value="pill">Pill</option>
                <option value="triangle">Triangle</option>
              </select>
            </div>
          )}
        </Section>

        <Section title="Layout & Position">
          <Input label="Display" value={selectedNode.styles.display || ''} onChange={(v) => handleStyleChange('display', v)} placeholder="flex, grid, block..." />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input label="Width" value={selectedNode.styles.width || ''} onChange={(v) => handleStyleChange('width', v)} />
            <Input label="Height" value={selectedNode.styles.height || ''} onChange={(v) => handleStyleChange('height', v)} />
            <Input label="Min Height" value={selectedNode.styles.minHeight || ''} onChange={(v) => handleStyleChange('minHeight', v)} />
            <Input label="Max Width" value={selectedNode.styles.maxWidth || ''} onChange={(v) => handleStyleChange('maxWidth', v)} />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input label="Margin" value={selectedNode.styles.margin || ''} onChange={(v) => handleStyleChange('margin', v)} />
            <Input label="Padding" value={selectedNode.styles.padding || ''} onChange={(v) => handleStyleChange('padding', v)} />
          </div>

          {(selectedNode.styles.display === 'flex' || selectedNode.type === 'section' || selectedNode.type === 'container') && (
            <div className="mt-4 pt-4 border-t border-zinc-800/50 flex flex-col gap-2">
              <span className="text-xs text-zinc-500 font-medium">Flexbox</span>
              <Input label="Flex Direction" value={selectedNode.styles.flexDirection || ''} onChange={(v) => handleStyleChange('flexDirection', v)} />
              <Input label="Justify Content" value={selectedNode.styles.justifyContent || ''} onChange={(v) => handleStyleChange('justifyContent', v)} />
              <Input label="Align Items" value={selectedNode.styles.alignItems || ''} onChange={(v) => handleStyleChange('alignItems', v)} />
              <Input label="Gap" value={selectedNode.styles.gap || ''} onChange={(v) => handleStyleChange('gap', v)} />
            </div>
          )}

          {(selectedNode.styles.display === 'grid' || selectedNode.type === 'grid') && (
            <div className="mt-4 pt-4 border-t border-zinc-800/50 flex flex-col gap-2">
              <span className="text-xs text-zinc-500 font-medium">Grid</span>
              <Input label="Grid Columns" value={selectedNode.styles.gridTemplateColumns || ''} onChange={(v) => handleStyleChange('gridTemplateColumns', v)} />
              <Input label="Grid Rows" value={selectedNode.styles.gridTemplateRows || ''} onChange={(v) => handleStyleChange('gridTemplateRows', v)} />
              <Input label="Gap" value={selectedNode.styles.gap || ''} onChange={(v) => handleStyleChange('gap', v)} />
            </div>
          )}
        </Section>

        <Section title="Typography">
          <Input label="Font Family" value={selectedNode.styles.fontFamily || ''} onChange={(v) => handleStyleChange('fontFamily', v)} placeholder="Inter, serif..." />
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input label="Font Size" value={selectedNode.styles.fontSize || ''} onChange={(v) => handleStyleChange('fontSize', v)} />
            <Input label="Font Weight" value={selectedNode.styles.fontWeight || ''} onChange={(v) => handleStyleChange('fontWeight', v)} />
            <Input label="Line Height" value={selectedNode.styles.lineHeight || ''} onChange={(v) => handleStyleChange('lineHeight', v)} />
            <Input label="Letter Spacing" value={selectedNode.styles.letterSpacing || ''} onChange={(v) => handleStyleChange('letterSpacing', v)} />
          </div>
          <Input label="Text Align" value={selectedNode.styles.textAlign || ''} onChange={(v) => handleStyleChange('textAlign', v)} className="mt-2" />
          <div className="mt-2 flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400">Color</label>
            <div className="flex gap-2">
              <input type="color" value={selectedNode.styles.color || '#000000'} onChange={(e) => handleStyleChange('color', e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-zinc-900 border-0 p-0" />
              <input type="text" value={selectedNode.styles.color || ''} onChange={(e) => handleStyleChange('color', e.target.value)} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="#000000" />
            </div>
          </div>
        </Section>

        <Section title="Visual">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400">Background Color</label>
            <div className="flex gap-2">
              <input type="color" value={selectedNode.styles.backgroundColor || '#ffffff'} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-zinc-900 border-0 p-0" />
              <input type="text" value={selectedNode.styles.backgroundColor || ''} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="#ffffff" />
            </div>
          </div>
          <Input label="Border Radius" value={selectedNode.styles.borderRadius || ''} onChange={(v) => handleStyleChange('borderRadius', v)} className="mt-2" />
          <Input label="Border" value={selectedNode.styles.border || ''} onChange={(v) => handleStyleChange('border', v)} className="mt-2" />
          <Input label="Box Shadow" value={selectedNode.styles.boxShadow || ''} onChange={(v) => handleStyleChange('boxShadow', v)} className="mt-2" />
          <Input label="Opacity" value={selectedNode.styles.opacity || ''} onChange={(v) => handleStyleChange('opacity', v)} className="mt-2" />
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children, defaultOpen = true }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="flex flex-col border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between p-3 bg-zinc-900 hover:bg-zinc-800 transition-colors">
        <span className="text-xs font-semibold text-white">{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-zinc-400" /> : <ChevronRight className="w-4 h-4 text-zinc-400" />}
      </button>
      {open && <div className="p-3 border-t border-zinc-800">{children}</div>}
    </div>
  );
}

function Input({ label, value, onChange, placeholder, className = '' }: { label: string, value: string | number, onChange: (v: string) => void, placeholder?: string, className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-xs text-zinc-400">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}
