import { templates } from '../../utils/vibeTemplates';
import { useEditorStore } from '../../store/editorStore';

export default function TemplatePanel() {
  const { applyTemplate } = useEditorStore();

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">Premade Templates</h3>
      {templates.map((tpl, i) => (
        <div
          key={i}
          className="group relative h-24 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
          onClick={() => {
            if (confirm('Applying a template will replace all content on the current page. Continue?')) {
              applyTemplate(tpl);
            }
          }}
        >
          <div className="absolute inset-0 flex flex-col" style={{ backgroundColor: tpl.styles.backgroundColor, color: tpl.styles.color }}>
            <div className="m-auto text-center p-2">
              <h4 className="text-sm font-bold opacity-90">{tpl.name}</h4>
            </div>
          </div>
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <span className="bg-blue-600 text-white text-xs font-medium px-3 py-1.5 rounded-full">Apply Template</span>
          </div>
        </div>
      ))}
    </div>
  );
}
