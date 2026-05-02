import React from 'react';
import { VibeNode } from '../../types';

interface RendererProps {
  node: VibeNode;
}

const VibeRenderer: React.FC<RendererProps> = ({ node }) => {
  const { type, styles, children, content, src, href, shapeType, elementId } = node;

  const styleObj: any = { ...styles };

  if (type === 'shape' && shapeType) {
    if (shapeType === 'circle') styleObj.borderRadius = '50%';
    else if (shapeType === 'pill') styleObj.borderRadius = '9999px';
    else if (shapeType === 'triangle') {
      styleObj.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
      styleObj.borderRadius = '0';
    }
  }

  const commonProps: any = {
    id: elementId,
    style: styleObj,
  };

  if (type === 'heading') {
    let Tag = 'h2';
    if (styles.fontSize) {
      const size = parseInt(styles.fontSize as string);
      if (size >= 48) Tag = 'h1';
      else if (size >= 32) Tag = 'h2';
      else if (size >= 24) Tag = 'h3';
      else if (size >= 20) Tag = 'h4';
      else if (size >= 16) Tag = 'h5';
      else Tag = 'h6';
    }
    return React.createElement(Tag, commonProps, content);
  }

  if (type === 'text') {
    return <p {...commonProps}>{content}</p>;
  }

  if (type === 'image') {
    return <img {...commonProps} src={src || 'https://placehold.co/600x400'} alt={node.name} />;
  }

  if (type === 'button') {
    return (
      <a {...commonProps} href={href || '#'} style={{ textDecoration: 'none', ...styleObj }}>
        {content}
      </a>
    );
  }

  if (type === 'divider') {
    return <hr {...commonProps} />;
  }

  if (type === 'spacer') {
    return <div {...commonProps} />;
  }

  if (type === 'shape') {
    return <div {...commonProps} />;
  }

  // Root, section, container, grid
  const ContainerTag = type === 'section' ? 'section' : 'div';

  return React.createElement(
    ContainerTag,
    commonProps,
    children?.map((child) => (
      <VibeRenderer key={child.id} node={child} />
    ))
  );
};

export default VibeRenderer;
