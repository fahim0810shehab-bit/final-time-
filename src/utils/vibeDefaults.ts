import { VibeNode, VibePage, SiteDocument } from '../types';


export const defaultRootNode: VibeNode = {
  id: 'root',
  type: 'root',
  name: 'Page',
  styles: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    color: '#09090b',
    fontFamily: 'Inter, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden'
  },
  children: []
};

export const createDefaultPage = (name: string, slug: string): VibePage => ({
  id: Math.random().toString(36).substr(2, 9),
  name,
  slug,
  rootNode: JSON.parse(JSON.stringify(defaultRootNode))
});

export const createDefaultDocument = (): SiteDocument => ({
  pages: [createDefaultPage('Home', 'home')],
  siteSettings: { title: 'My Site', favicon: '' }
});

export const defaultNodes: Record<string, Omit<VibeNode, 'id'>> = {
  section: { type: 'section', name: 'Section', styles: { display: 'flex', flexDirection: 'column', padding: '60px 24px', gap: '16px', width: '100%' }, children: [] },
  container: { type: 'container', name: 'Container', styles: { display: 'flex', flexDirection: 'column', padding: '16px', gap: '16px' }, children: [] },
  grid: { type: 'grid', name: 'Grid', styles: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', padding: '16px' }, children: [] },
  heading: { type: 'heading', name: 'Heading', content: 'Your Heading', styles: { fontSize: '48px', fontWeight: '800', letterSpacing: '-0.02em', lineHeight: '1.1', color: '#09090b' }, children: [] },
  text: { type: 'text', name: 'Text', content: 'Add your text here. Click to edit.', styles: { fontSize: '16px', lineHeight: '1.6', color: '#3f3f46' }, children: [] },
  button: { type: 'button', name: 'Button', content: 'Click Me', href: '#', styles: { display: 'inline-block', padding: '12px 28px', backgroundColor: '#09090b', color: '#ffffff', borderRadius: '9999px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textDecoration: 'none', border: 'none' }, children: [] },
  image: { type: 'image', name: 'Image', src: 'https://placehold.co/800x450', styles: { width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }, children: [] },
  divider: { type: 'divider', name: 'Divider', styles: { width: '100%', height: '1px', backgroundColor: '#e4e4e7', margin: '8px 0' }, children: [] },
  spacer: { type: 'spacer', name: 'Spacer', styles: { width: '100%', height: '48px', display: 'block' }, children: [] },
  shape: { type: 'shape', name: 'Shape', shapeType: 'rectangle', styles: { width: '80px', height: '80px', backgroundColor: '#3b82f6', borderRadius: '8px' }, children: [] },
  hero: {
    type: 'section', name: 'Hero Block',
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px', gap: '24px', backgroundColor: '#fafafa', width: '100%' },
    children: [
      { id: '__hero_h', type: 'heading', name: 'Hero Heading', content: 'Build Something Amazing', styles: { fontSize: '72px', fontWeight: '800', letterSpacing: '-0.04em', lineHeight: '1.05', color: '#09090b' }, children: [] },
      { id: '__hero_p', type: 'text', name: 'Hero Subtext', content: 'The fastest way to build and publish beautiful websites.', styles: { fontSize: '20px', color: '#71717a', maxWidth: '560px', lineHeight: '1.6' }, children: [] },
      { id: '__hero_b', type: 'button', name: 'Hero CTA', content: 'Get Started Free', href: '#', styles: { display: 'inline-block', padding: '16px 36px', backgroundColor: '#09090b', color: '#fff', borderRadius: '9999px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', textDecoration: 'none', border: 'none' }, children: [] }
    ]
  },
  navbar: {
    type: 'section', name: 'Nav Bar',
    styles: { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: '20px 40px', borderBottom: '1px solid #e4e4e7', width: '100%', backgroundColor: '#ffffff' },
    children: [
      { id: '__nav_logo', type: 'text', name: 'Logo', content: 'MySite', styles: { fontSize: '20px', fontWeight: '700', color: '#09090b', letterSpacing: '-0.02em' }, children: [] },
      { id: '__nav_links', type: 'container', name: 'Nav Links', styles: { display: 'flex', flexDirection: 'row', gap: '32px', alignItems: 'center' }, children: [
        { id: '__nav_l1', type: 'button', name: 'Link 1', content: 'Home', href: '#', styles: { color: '#3f3f46', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none', padding: '0' }, children: [] },
        { id: '__nav_l2', type: 'button', name: 'Link 2', content: 'About', href: '#', styles: { color: '#3f3f46', fontSize: '14px', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none', padding: '0' }, children: [] },
        { id: '__nav_cta', type: 'button', name: 'CTA', content: 'Get Started', href: '#', styles: { color: '#fff', backgroundColor: '#09090b', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer', padding: '10px 20px', borderRadius: '9999px', textDecoration: 'none' }, children: [] },
      ]},
    ]
  },
  cardrow: {
    type: 'section', name: 'Card Row',
    styles: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', padding: '80px 40px', backgroundColor: '#ffffff', width: '100%' },
    children: [
      { id: '__c1', type: 'container', name: 'Card 1', styles: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '32px', backgroundColor: '#fafafa', borderRadius: '16px', border: '1px solid #e4e4e7' }, children: [
        { id: '__c1h', type: 'heading', name: 'Card Title', content: 'Feature One', styles: { fontSize: '24px', fontWeight: '700', color: '#09090b' }, children: [] },
        { id: '__c1p', type: 'text', name: 'Card Text', content: 'Describe your feature here. Keep it short and impactful.', styles: { fontSize: '15px', color: '#71717a', lineHeight: '1.6' }, children: [] },
      ]},
      { id: '__c2', type: 'container', name: 'Card 2', styles: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '32px', backgroundColor: '#fafafa', borderRadius: '16px', border: '1px solid #e4e4e7' }, children: [
        { id: '__c2h', type: 'heading', name: 'Card Title', content: 'Feature Two', styles: { fontSize: '24px', fontWeight: '700', color: '#09090b' }, children: [] },
        { id: '__c2p', type: 'text', name: 'Card Text', content: 'Describe your feature here. Keep it short and impactful.', styles: { fontSize: '15px', color: '#71717a', lineHeight: '1.6' }, children: [] },
      ]},
      { id: '__c3', type: 'container', name: 'Card 3', styles: { display: 'flex', flexDirection: 'column', gap: '12px', padding: '32px', backgroundColor: '#fafafa', borderRadius: '16px', border: '1px solid #e4e4e7' }, children: [
        { id: '__c3h', type: 'heading', name: 'Card Title', content: 'Feature Three', styles: { fontSize: '24px', fontWeight: '700', color: '#09090b' }, children: [] },
        { id: '__c3p', type: 'text', name: 'Card Text', content: 'Describe your feature here. Keep it short and impactful.', styles: { fontSize: '15px', color: '#71717a', lineHeight: '1.6' }, children: [] },
      ]},
    ]
  },
};
