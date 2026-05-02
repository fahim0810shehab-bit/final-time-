import React from 'react';

export interface User {
  id: string;        // JWT sub
  email: string;
  username: string;  // used in /site/:username URL
  name: string;
  token: string;     // access_token
}

export interface VibeNode {
  id: string;
  type: 'root' | 'section' | 'container' | 'grid' | 'text' | 'heading' | 'image' | 'button' | 'shape' | 'spacer' | 'divider';
  name: string;
  elementId?: string;
  content?: string;
  src?: string;
  href?: string;
  shapeType?: 'rectangle' | 'circle' | 'triangle' | 'pill';
  styles: React.CSSProperties;
  children?: VibeNode[];
}

export interface VibePage {
  id: string;
  name: string;
  slug: string;
  rootNode: VibeNode;
}

export interface SiteDocument {
  pages: VibePage[];
  siteSettings: { title: string; favicon: string; };
}

export interface SiteData {
  user_id: string;
  username: string;
  is_published: boolean;
  document: SiteDocument;
}
