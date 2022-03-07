import type { NextPage } from 'next';
import React from 'react';
import { mockLayout } from '../__fixtures__/layout/testLayout';
import { mockData } from '../__fixtures__/layout/testData';
import createDOMPurify from 'isomorphic-dompurify';
import { JSDOM } from 'jsdom';
import ReactDOM from 'react-dom';
import { Button } from './components/button';

interface HomeProps {
  layout: string;
}

export async function getServerSideProps() {
  const Handlebars = await import('handlebars');
  const template = Handlebars.compile(mockLayout);

  const parser = new JSDOM(template(mockData));
  const root = parser.window.document.body;
  const walker = parser.window.document.createTreeWalker(root);

  const mapNodeToCreateElement = (node: Node): JSX.Element => {
    // const type = nodeTypeToJSX(node.nodeType);
    const children: JSX.Element[] = [];
    node.childNodes.forEach((child) => {
      children.push(mapNodeToCreateElement(child));
    });
    return React.createElement(node.nodeName, null, children);
  };

  // // depth-first traversal
  // var path: Node[] = [root];

  // let previousNode: Node | null = root;
  // while (walker.nextNode()) {
  //   console.log(walker.currentNode.nodeName, walker.currentNode.nodeValue);

  //   if (walker.currentNode.parentNode === previousNode) {
  //     console.log('down');
  //   } else if (walker.currentNode.previousSibling === previousNode) {
  //     console.log('right');
  //   } else {
  //     console.log('up');
  //   }
  //   previousNode = walker.currentNode;
  // }

  return { props: { layout: template(mockData) } };
}

const Home: NextPage<HomeProps> = ({ layout }) => {
  return React.createElement('div', null, [
    React.createElement('div', null, ['Julia']),
    React.createElement('div', null, ['Julianna']),
    React.createElement(Button, null, ['press']),
  ]);
};

export default Home;
