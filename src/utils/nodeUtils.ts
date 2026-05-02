import { VibeNode } from '../types';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const findNode = (nodes: VibeNode[], id: string): VibeNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const findParent = (nodes: VibeNode[], id: string, parent: VibeNode | null = null): VibeNode | null => {
  for (const node of nodes) {
    if (node.id === id) return parent;
    if (node.children) {
      const found = findParent(node.children, id, node);
      if (found) return found;
    }
  }
  return null;
};

export const updateNodeInTree = (nodes: VibeNode[], id: string, updates: Partial<VibeNode>): VibeNode[] => {
  return nodes.map(node => {
    if (node.id === id) return { ...node, ...updates };
    if (node.children) return { ...node, children: updateNodeInTree(node.children, id, updates) };
    return node;
  });
};

export const addNodeToTree = (nodes: VibeNode[], parentId: string, newNode: VibeNode, index?: number): VibeNode[] => {
  return nodes.map(node => {
    if (node.id === parentId) {
      const children = [...(node.children || [])];
      if (typeof index === 'number') {
        children.splice(index, 0, newNode);
      } else {
        children.push(newNode);
      }
      return { ...node, children };
    }
    if (node.children) return { ...node, children: addNodeToTree(node.children, parentId, newNode, index) };
    return node;
  });
};

export const removeNodeFromTree = (nodes: VibeNode[], id: string): VibeNode[] => {
  return nodes.filter(node => node.id !== id).map(node => {
    if (node.children) return { ...node, children: removeNodeFromTree(node.children, id) };
    return node;
  });
};
