import { create } from 'zustand';
import { VibePage, VibeNode, SiteData } from '../types';
import { createDefaultPage } from '../utils/vibeDefaults';
import { generateId, updateNodeInTree, addNodeToTree, removeNodeFromTree, findNode, findParent } from '../utils/nodeUtils';

interface EditorState {
  pages: VibePage[];
  activePageId: string;
  setActivePageId: (id: string) => void;
  addPage: (name: string) => void;
  deletePage: (id: string) => void;
  renamePage: (id: string, name: string) => void;

  updateNode: (nodeId: string, updates: Partial<VibeNode>) => void;
  addNode: (parentId: string, node: VibeNode, index?: number) => void;
  removeNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  moveNode: (nodeId: string, targetParentId: string, index?: number) => void;

  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;

  history: VibeNode[];
  historyIndex: number;
  commitHistory: () => void;
  undo: () => void;
  redo: () => void;

  saveStatus: 'saved' | 'saving' | 'unsaved' | 'error';
  setSaveStatus: (s: EditorState['saveStatus']) => void;

  applyTemplate: (rootNode: VibeNode) => void;
  loadSite: (data: SiteData) => void;
  
  siteDataRef: SiteData | null;
}

const MAX_HISTORY = 50;

export const useEditorStore = create<EditorState>((set, get) => ({
  pages: [],
  activePageId: '',
  selectedNodeId: null,
  history: [],
  historyIndex: -1,
  saveStatus: 'saved',
  siteDataRef: null,

  setActivePageId: (id) => {
    const { pages, activePageId } = get();
    if (id === activePageId) return;
    const activePage = pages.find(p => p.id === id);
    if (activePage) {
      set({ 
        activePageId: id, 
        history: [activePage.rootNode], 
        historyIndex: 0,
        selectedNodeId: null
      });
    }
  },

  addPage: (name) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newPage = createDefaultPage(name, slug);
    set(state => {
      const newPages = [...state.pages, newPage];
      return { pages: newPages, activePageId: newPage.id, history: [newPage.rootNode], historyIndex: 0, selectedNodeId: null, saveStatus: 'unsaved' };
    });
  },

  deletePage: (id) => {
    set(state => {
      if (state.pages.length <= 1) return state; // cannot delete last page
      const newPages = state.pages.filter(p => p.id !== id);
      const newActiveId = state.activePageId === id ? newPages[0].id : state.activePageId;
      const newActivePage = newPages.find(p => p.id === newActiveId)!;
      return { 
        pages: newPages, 
        activePageId: newActiveId,
        history: [newActivePage.rootNode],
        historyIndex: 0,
        saveStatus: 'unsaved'
      };
    });
  },

  renamePage: (id, name) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    set(state => ({
      pages: state.pages.map(p => p.id === id ? { ...p, name, slug } : p),
      saveStatus: 'unsaved'
    }));
  },

  commitHistory: () => {
    set(state => {
      const activePage = state.pages.find(p => p.id === state.activePageId);
      if (!activePage) return state;
      
      const currentHistory = state.history.slice(0, state.historyIndex + 1);
      currentHistory.push(activePage.rootNode);
      if (currentHistory.length > MAX_HISTORY) currentHistory.shift();
      
      return { history: currentHistory, historyIndex: currentHistory.length - 1, saveStatus: 'unsaved' };
    });
  },

  updateNode: (nodeId, updates) => {
    set(state => {
      const newPages = state.pages.map(p => {
        if (p.id !== state.activePageId) return p;
        return { ...p, rootNode: updateNodeInTree([p.rootNode], nodeId, updates)[0] };
      });
      return { pages: newPages };
    });
    get().commitHistory();
  },

  addNode: (parentId, node, index) => {
    set(state => {
      const newPages = state.pages.map(p => {
        if (p.id !== state.activePageId) return p;
        return { ...p, rootNode: addNodeToTree([p.rootNode], parentId, node, index)[0] };
      });
      return { pages: newPages };
    });
    get().commitHistory();
  },

  removeNode: (nodeId) => {
    set(state => {
      const newPages = state.pages.map(p => {
        if (p.id !== state.activePageId) return p;
        if (p.rootNode.id === nodeId) return p; // prevent removing root
        return { ...p, rootNode: removeNodeFromTree([p.rootNode], nodeId)[0] };
      });
      return { pages: newPages, selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId };
    });
    get().commitHistory();
  },

  duplicateNode: (nodeId) => {
    set(state => {
      const activePage = state.pages.find(p => p.id === state.activePageId);
      if (!activePage || activePage.rootNode.id === nodeId) return state;
      
      const nodeToDuplicate = findNode([activePage.rootNode], nodeId);
      if (!nodeToDuplicate) return state;
      
      const parent = findParent([activePage.rootNode], nodeId);
      if (!parent) return state;

      const deepCopy = (node: VibeNode): VibeNode => ({
        ...node,
        id: generateId(),
        children: node.children?.map(deepCopy)
      });
      
      const clone = deepCopy(nodeToDuplicate);
      const parentChildren = parent.children || [];
      const index = parentChildren.findIndex(n => n.id === nodeId);
      
      const newPages = state.pages.map(p => {
        if (p.id !== state.activePageId) return p;
        return { ...p, rootNode: addNodeToTree([p.rootNode], parent.id, clone, index + 1)[0] };
      });
      
      return { pages: newPages, selectedNodeId: clone.id };
    });
    get().commitHistory();
  },

  moveNode: (nodeId, targetParentId, index) => {
    set(state => {
      const activePage = state.pages.find(p => p.id === state.activePageId);
      if (!activePage || activePage.rootNode.id === nodeId) return state;

      const nodeToMove = findNode([activePage.rootNode], nodeId);
      if (!nodeToMove) return state;

      let tempRoot = removeNodeFromTree([activePage.rootNode], nodeId)[0];
      let newRoot = addNodeToTree([tempRoot], targetParentId, nodeToMove, index)[0];

      const newPages = state.pages.map(p => {
        if (p.id !== state.activePageId) return p;
        return { ...p, rootNode: newRoot };
      });
      
      return { pages: newPages };
    });
    get().commitHistory();
  },

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  undo: () => {
    set(state => {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        const newPages = state.pages.map(p => {
          if (p.id !== state.activePageId) return p;
          return { ...p, rootNode: state.history[newIndex] };
        });
        return { historyIndex: newIndex, pages: newPages, saveStatus: 'unsaved' };
      }
      return state;
    });
  },

  redo: () => {
    set(state => {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        const newPages = state.pages.map(p => {
          if (p.id !== state.activePageId) return p;
          return { ...p, rootNode: state.history[newIndex] };
        });
        return { historyIndex: newIndex, pages: newPages, saveStatus: 'unsaved' };
      }
      return state;
    });
  },

  setSaveStatus: (s) => set({ saveStatus: s }),

  applyTemplate: (rootNode) => {
    const clone = JSON.parse(JSON.stringify(rootNode));
    clone.id = generateId(); // New root id
    set(state => {
      const newPages = state.pages.map(p => {
        if (p.id !== state.activePageId) return p;
        return { ...p, rootNode: clone };
      });
      return { pages: newPages, selectedNodeId: null };
    });
    get().commitHistory();
  },

  loadSite: (data) => {
    const pages = data.document.pages;
    const activePage = pages[0];
    set({
      siteDataRef: data,
      pages,
      activePageId: activePage.id,
      history: [activePage.rootNode],
      historyIndex: 0,
      saveStatus: 'saved',
      selectedNodeId: null
    });
  }
}));
