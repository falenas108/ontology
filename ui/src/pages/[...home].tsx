import type { NextPage } from 'next';
import React from 'react';
import { mockLayout } from '../__fixtures__/layout/testLayout';
import { mockData } from '../__fixtures__/layout/testData';
// import createDOMPurify from 'isomorphic-dompurify';
import { JSDOM } from 'jsdom';
// import ReactDOM from 'react-dom';

interface HomeProps {
  layout: string;
}

interface LayoutDomElement {
  type: string; // <- eventually should be enum | HTTP element name;
  attributes?: unknown[]; // TODO: Figure out
  children: LayoutDomElement[];
  value: string | null;
}

export async function getServerSideProps() {
  const Handlebars = await import('handlebars');
  const template = Handlebars.compile(mockLayout);

  const parser = new JSDOM(template(mockData));
  const root = parser.window.document.body;
  const walker = parser.window.document.createTreeWalker(root);

  // depth-first traversal
  const path: number[] = []; // Child index from root, empty array means index
  const layoutDom: LayoutDomElement = {
    type: 'div',
    attributes: [],
    children: [],
    value: null,
  };

  const nodeTypeToLayoutType = (nodeType: number): string => {
    switch (nodeType) {
      case 1:
        return 'div';
      default:
        return nodeType.toString(); // TODO: Proper mapping
    }
  };

  const nodeToDomElement = (node: Node): LayoutDomElement => {
    return {
      type: nodeTypeToLayoutType(node.nodeType),
      children: [],
      value: node.nodeValue,
    };
  };

  const getLatestElementOnPath = (path: number[]) => {
    return path.reduce((currentNode, nextPathElement) => {
      return currentNode.children[nextPathElement];
    }, layoutDom);
  };

  const getCurrentDepth = (node: Node | null, depth = 0): number => {
    if (node === null) {
      // at the root, depth is final depth
      return depth;
    }
    // Not yet at root, bump up by one and try parent
    return getCurrentDepth(node.parentNode, depth + 1);
  };

  // Get depth of body -1, so that body returns depth 0, everything further works as expected
  const DEPTH_OFFSET = -getCurrentDepth(walker.currentNode) - 1;

  let previousNode: Node | null = root;
  while (walker.nextNode()) {
    // console.log(walker.currentNode);
    if (/^\n[ ]+$/.test(walker.currentNode.nodeValue ?? '')) {
      continue;
    }
    if (walker.currentNode.parentNode === previousNode) {
      console.log('down');
      const currentElement = getLatestElementOnPath(path);
      const nextNodeIndex = currentElement.children.push(nodeToDomElement(walker.currentNode)) - 1;
      path.push(nextNodeIndex);
    } else if (walker.currentNode.previousSibling === previousNode) {
      console.log('right');
      path.pop(); // Get out of current element to find parent
      const parentElement = getLatestElementOnPath(path);
      const nextNodeIndex = parentElement.children.push(nodeToDomElement(walker.currentNode)) - 1;
      path.push(nextNodeIndex);
    } else {
      const depth = getCurrentDepth(walker.currentNode, DEPTH_OFFSET);
      console.log('up', path, 'depth', depth);
      while (depth < path.length) {
        path.pop();
      }
      const parentElement = getLatestElementOnPath(path);
      const nextNodeIndex = parentElement.children.push(nodeToDomElement(walker.currentNode)) - 1;
      path.push(nextNodeIndex);
    }
    previousNode = walker.currentNode;
  }

  // console.log('layout is', JSON.stringify(layoutDom));

  return { props: { layout: layoutDom } };
}

const Home: NextPage<HomeProps> = ({ layout }) => {
  console.log('layout!', layout);
  return React.createElement('div', null, [
    React.createElement('div', null, ['Julia']),
    React.createElement('div', null, ['Julianna']),
  ]);
};

export default Home;
