import { VibeNode } from '../types';
import { generateId } from './nodeUtils';

const baseTemplate = (name: string, bg: string, color: string): VibeNode => ({
  id: generateId(),
  type: 'root',
  name,
  styles: { width: '100%', minHeight: '100vh', backgroundColor: bg, color, display: 'flex', flexDirection: 'column' },
  children: [
    {
      id: generateId(),
      type: 'section',
      name: 'Hero Section',
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px', flexGrow: 1, gap: '24px' },
      children: [
        { id: generateId(), type: 'heading', name: 'Main Heading', content: name, styles: { fontSize: '64px', fontWeight: 800, textAlign: 'center' } },
        { id: generateId(), type: 'text', name: 'Subtext', content: 'This is the start of something amazing.', styles: { fontSize: '20px', opacity: 0.8, textAlign: 'center' } },
        { id: generateId(), type: 'button', name: 'CTA', content: 'Get Started', styles: { padding: '16px 32px', backgroundColor: color, color: bg, borderRadius: '9999px', fontSize: '18px', fontWeight: 600, marginTop: '24px' } }
      ]
    }
  ]
});

export const templates: VibeNode[] = [
  baseTemplate('Modern SaaS', '#09090b', '#ffffff'),
  baseTemplate('Bold Portfolio', '#ffffff', '#000000'),
  baseTemplate('Startup Landing', '#f8fafc', '#0f172a'),
  baseTemplate('Creator Profile', '#fdf4ff', '#701a75'),
  baseTemplate('Modern Agency', '#18181b', '#f4f4f5'),
  baseTemplate('Minimalist Blog', '#fdfbf7', '#27272a'),
  baseTemplate('Brutalist Shop', '#fef08a', '#000000'),
  baseTemplate('Photo Gallery', '#000000', '#ffffff'),
  baseTemplate('Glassmorphism', '#e0e7ff', '#1e3a8a'),
  baseTemplate('Bento Dashboard', '#f3f4f6', '#111827'),
  baseTemplate('Neo-Brutalism', '#bae6fd', '#000000'),
  baseTemplate('Web3 Protocol', '#020617', '#38bdf8'),
];
