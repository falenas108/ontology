import { NextPage } from 'next';
import React, { ReactElement, Suspense } from 'react';
import { layout } from '../../../layouts/test/test.layout';
import { testResources } from '../../../layouts/test/testResources';
import { JSDOM } from 'jsdom';

import { Link } from '../components/link';
import Handlebars from 'handlebars';
import { Suspensful } from '../components/suspensful';
import { NextRouter } from 'next/router';
import Image from 'next/image';

interface HomeProps {
  layout: string;
  router: NextRouter;
}

const Home: NextPage<HomeProps> = ({ router: _router }) => {
  const template = Handlebars.compile(layout);

  const parser = new JSDOM(template(testResources));
  const root = parser.window.document.body;
  const walker = parser.window.document.createTreeWalker(root);
  walker.nextNode(); // Starts at body, we want to start at the tag after that

  const nodeTypeToJSX = (node: Node) => {
    const lowered = node.nodeName.toLowerCase();
    console.log('node', node.nodeName, node.nodeValue);
    switch (lowered) {
      case 'div':
        return 'div';
      case 'reactbutton':
        return Link;
      case 'reactimage':
        const source = (node as Element).getAttribute('src');
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
  const filledLayout = mapNodeToCreateElement(walker.currentNode);
  return (
    <>
      {filledLayout as ReactElement}
      <div style={{ paddingBottom: 20 }} />
      <Suspense fallback={<div style={{ color: 'red' }}>loading...</div>}>
        <Suspensful />
      </Suspense>
    </>
  );
};

export default Home;
