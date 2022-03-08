import type { NextPage } from 'next';
import React, { ReactElement } from 'react';
import { mockLayout } from '../__fixtures__/layout/testLayout';
import { mockData } from '../__fixtures__/layout/testData';
import { JSDOM } from 'jsdom';

import { Link } from './components/Link';
import Handlebars from 'handlebars';

interface HomeProps {
  layout: string;
}

const Home: NextPage<HomeProps> = ({ layout }) => {
  const template = Handlebars.compile(mockLayout);

  const parser = new JSDOM(template(mockData));
  const root = parser.window.document.body;
  const walker = parser.window.document.createTreeWalker(root);
  walker.nextNode(); // Starts at body, we want to start at the tag after that

  const nodeTypeToJSX = (nodeName: string) => {
    const lowered = nodeName.toLowerCase();
    switch (lowered) {
      case 'pressable':
        return Link;
      default:
        return lowered;
    }
  };

  const mapNodeToCreateElement = (node: Node): React.ReactNode => {
    const type = nodeTypeToJSX(node.nodeName);
    if (type === '#text') {
      return node.nodeValue;
    }
    const children: React.ReactNode[] = [];
    node.childNodes.forEach((child) => {
      children.push(mapNodeToCreateElement(child));
    });
    return React.createElement(type, null, children);
  };
  const filledLayout = mapNodeToCreateElement(walker.currentNode);
  return filledLayout as ReactElement;
};

export default Home;
