import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { siteService } from '../services/siteService';
import { SiteData } from '../types';
import Navbar from '../components/shared/Navbar';
import { Copy, ExternalLink, Edit3, LayoutTemplate } from 'lucide-react';
import { useToast } from '../components/shared/Toast';

import { createDefaultDocument } from '../utils/vibeDefaults';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [site, setSite] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      siteService.getSite(user.token, user.id)
        .then(data => {
          setSite(data);
          setLoading(false);
        })
        .catch(async () => {
          // If no site exists, create default
          try {
            const defaultSite: SiteData = {
              user_id: user.id,
              username: user.username,
              is_published: false,
              document: createDefaultDocument()
            };
            await siteService.saveSite(user.token, defaultSite);
            setSite(defaultSite);
          } catch (e) {
            console.error('Failed to create default site', e);
          }
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  const siteUrl = `${import.meta.env.VITE_APP_DOMAIN}/site/${user?.username}`;

  const countElements = (node: any): number => {
    let count = 1;
    if (node.children) {
      node.children.forEach((child: any) => {
        count += countElements(child);
      });
    }
    return count;
  };

  const totalElements = site?.document.pages.reduce((acc, page) => acc + countElements(page.rootNode), 0) || 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-6xl w-full mx-auto p-8 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Welcome, {user?.username}</h1>
          <p className="text-zinc-400 text-lg">Manage your site and pages.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">Live Site</h2>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${site?.is_published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${site?.is_published ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                    {site?.is_published ? 'Published' : 'Draft'}
                  </span>
                  <a href={siteUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline text-sm flex items-center gap-1">
                    {siteUrl}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(siteUrl);
                      showToast('URL copied to clipboard', 'success');
                    }}
                    className="p-1.5 text-zinc-500 hover:text-white transition-colors rounded-md hover:bg-zinc-800"
                    title="Copy URL"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/editor')}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Open Editor
                </button>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-6">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Pages ({site?.document.pages.length})</h3>
              <div className="flex flex-col gap-3">
                {site?.document.pages.map(page => (
                  <div key={page.id} className="flex items-center justify-between bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50 hover:border-zinc-600 transition-colors">
                    <div className="flex items-center gap-3">
                      <LayoutTemplate className="w-5 h-5 text-zinc-500" />
                      <div>
                        <p className="font-medium text-white">{page.name}</p>
                        <p className="text-xs text-zinc-400">/{page.slug}</p>
                      </div>
                    </div>
                    <div className="text-sm text-zinc-500">
                      {countElements(page.rootNode)} elements
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-6">
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                <p className="text-xs text-zinc-400 mb-1">Total Pages</p>
                <p className="text-2xl font-semibold text-white">{site?.document.pages.length}</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                <p className="text-xs text-zinc-400 mb-1">Total Elements</p>
                <p className="text-2xl font-semibold text-white">{totalElements}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
