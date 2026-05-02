import { Link } from 'react-router-dom';
import { VibePage } from '../../types';

interface Props {
  pages: VibePage[];
  username: string;
  currentSlug: string;
}

export default function SiteNav({ pages, username, currentSlug }: Props) {
  return (
    <nav className="w-full bg-white border-b border-zinc-200 px-8 py-4 flex items-center justify-between z-50 relative">
      <div className="font-bold text-xl text-zinc-900 tracking-tight">
        {username}
      </div>
      <div className="flex items-center gap-6">
        {pages.map(page => (
          <Link
            key={page.id}
            to={`/site/${username}/${page.slug}`}
            className={`text-sm font-medium transition-colors ${
              currentSlug === page.slug 
                ? 'text-blue-600' 
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            {page.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
