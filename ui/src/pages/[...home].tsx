import type { NextPage } from 'next';
import React from 'react';
import { mockLayout } from '../__fixtures__/layout/testLayout';
import { mockData } from '../__fixtures__/layout/testData';
import createDOMPurify from 'isomorphic-dompurify';
import { JSDOM } from 'jsdom';
import ReactDOM from 'react-dom';

interface HomeProps {
  layout: string;
}

// export async function getServerSideProps() {
//   const Handlebars = await import('handlebars');
//   const template = Handlebars.compile(mockLayout);

//   const parser = new JSDOM(template(mockData));
//   const root = parser.window.document.body;
//   const walker = parser.window.document.createTreeWalker(root);

//   // depth-first traversal
//   var path: Node[] = [root];

//   let previousNode: Node | null = root;
//   let componentDOM: HTMLElement | null = document.getElementById('app-root');
//   while (walker.nextNode()) {
//     console.log(walker.currentNode);
//     if (walker.currentNode.parentNode === previousNode) {
//       console.log('down');
//       componentDOM?.appendChild(React.createElement('div'));
//     } else if (walker.currentNode.previousSibling === previousNode) {
//       console.log('right');
//     } else {
//       console.log('up');
//     }
//     previousNode = walker.currentNode;
//   }

//   return { props: { layout: template(mockData) } };
// }

const Home: NextPage<HomeProps> = ({ layout }) => {
  return React.createElement('div', null, [
    React.createElement('div', null, ['Julia']),
    React.createElement('div', null, ['Julianna']),
  ]);
};

export default Home;
