import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { siteService } from '../services/siteService';
import { SiteData } from '../types';
import VibeRenderer from '../components/renderer/VibeRenderer';
import SiteNav from '../components/renderer/SiteNav';

export default function PublicSite() {
  const { username, slug } = useParams();
  const [site, setSite] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) {
      siteService.getSiteByUsername(username)
        .then(data => {
          setSite(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [username]);

  if (loading) return null;

  if (!site || !site.is_published) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <h1 className="text-2xl font-semibold text-zinc-800">404 - Site not found or not published</h1>
      </div>
    );
  }

  const page = slug 
    ? site.document.pages.find(p => p.slug === slug) 
    : site.document.pages[0];

  if (!page) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <h1 className="text-2xl font-semibold text-zinc-800">404 - Page not found</h1>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full">
      {site.document.pages.length > 1 && (
        <SiteNav pages={site.document.pages} username={site.username} currentSlug={page.slug} />
      )}
      
      <VibeRenderer node={page.rootNode} />

      <div className="fixed bottom-4 right-4 z-50 bg-white/90 backdrop-blur-sm shadow-xl rounded-full px-4 py-2 text-xs font-medium text-zinc-800 border border-zinc-200">
        Built with ✨ VibeBuilder
      </div>
    </div>
  );
}


