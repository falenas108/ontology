import { JSDOM } from 'jsdom';
import { AvailableResources } from '../../../common';
import { Link } from '../components';
import Image from 'next/image';
import React from 'react';
import Handlebars from 'handlebars';

export interface HandlebarsToJsxProps {
  layout: string;
  resources: AvailableResources;
}

export const layoutToJsx = ({ layout, resources }: HandlebarsToJsxProps) => {
  const template = Handlebars.compile(layout);

  const parser = new JSDOM(template(resources));
  const root = parser.window.document.body;
  const walker = parser.window.document.createTreeWalker(root);
  walker.nextNode(); // Starts at body, we want to start at the tag after that

  return mapNodeToCreateElement(walker.currentNode);
};

const mapNodeToCreateElement = (node: Node): React.ReactNode => {
  const type = nodeTypeToJSX(node);
  if (type === '#text') {
    return node.nodeValue;
  }
  const children: React.ReactNode[] = [];
  node.childNodes.forEach((child) => {
    children.push(mapNodeToCreateElement(child));
  });
  return React.createElement(type, null, children);
};

const nodeTypeToJSX = (node: Node) => {
  const lowered = node.nodeName.toLowerCase();
  switch (lowered) {
    case 'div':
      return 'div';
    case 'reactbutton':
      return Link;
    case 'reactimage':
      const source = (node as Element).getAttribute('src');
      console.log('source', source);
      if (source) {
        return function image() {
          return <Image alt="blanket" width={200} height={200} src={source} />;
        };
      } else {
        console.warn('Must define src inside image tag');
        return 'div';
      }
    default:
      return lowered;
  }
};
