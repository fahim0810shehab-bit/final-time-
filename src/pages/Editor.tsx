import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useEditorStore } from '../store/editorStore';
import { siteService } from '../services/siteService';
import TopBar from '../components/editor/TopBar';
import PageManager from '../components/editor/PageManager';
import LeftSidebar from '../components/editor/LeftSidebar';
import Inspector from '../components/editor/Inspector';
import Canvas from '../components/editor/Canvas';
import { useAutoSave } from '../hooks/useAutoSave';

export default function Editor() {
  const { user } = useAuthStore();
  const { loadSite, pages, selectedNodeId, removeNode, setSelectedNodeId, undo, redo } = useEditorStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      siteService.getSite(user.token, user.id)
        .then(data => {
          loadSite(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user, loadSite]);

  useAutoSave(); // Enable auto-save

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          e.preventDefault();
          removeNode(selectedNodeId);
        }
      } else if (e.key === 'Escape') {
        setSelectedNodeId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, removeNode, setSelectedNodeId, undo, redo]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (pages.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        Error loading site data
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-zinc-200 overflow-hidden font-sans">
      <TopBar />
      <div className="flex flex-1 overflow-hidden relative">
        <LeftSidebar />
        <div className="flex flex-1 flex-col bg-zinc-900 border-x border-zinc-800 shadow-inner relative">
          <PageManager />
          <div className="flex-1 overflow-hidden relative">
            <Canvas />
          </div>
        </div>
        <Inspector />
      </div>
    </div>
  );
}
