import { useEditorStore } from '../../store/editorStore';
import { useAuthStore } from '../../store/authStore';
import { siteService } from '../../services/siteService';
import { ArrowLeft, Check, Loader2, Undo, Redo, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../shared/Toast';

export default function TopBar() {
  const { saveStatus, undo, redo, history, historyIndex, pages, siteDataRef } = useEditorStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handlePublish = async () => {
    if (!user || !siteDataRef) return;
    try {
      const payload = {
        ...siteDataRef,
        is_published: true,
        document: {
          ...siteDataRef.document,
          pages
        }
      };
      await siteService.saveSite(user.token, payload);
      showToast('Site published successfully!', 'success');
    } catch (e) {
      showToast('Failed to publish site.', 'error');
    }
  };

  return (
    <div className="h-14 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 shrink-0 z-10">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors" title="Back to Dashboard">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <button onClick={undo} disabled={historyIndex <= 0} className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-400 disabled:opacity-30 disabled:hover:bg-transparent transition-colors" title="Undo">
            <Undo className="w-4 h-4" />
          </button>
          <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-400 disabled:opacity-30 disabled:hover:bg-transparent transition-colors" title="Redo">
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium tracking-wide">
          {user?.username}'s Site
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
          {saveStatus === 'saved' && <><Check className="w-3.5 h-3.5 text-emerald-500" /> Saved</>}
          {saveStatus === 'saving' && <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>}
          {saveStatus === 'unsaved' && <span className="text-amber-500">Unsaved changes</span>}
          {saveStatus === 'error' && <span className="text-red-500">Error saving</span>}
        </div>
        
        <button onClick={handlePublish} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors">
          <Play className="w-3.5 h-3.5" />
          Publish
        </button>
      </div>
    </div>
  );
}
