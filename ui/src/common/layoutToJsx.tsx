/* eslint-disable react/display-name */
import { JSDOM } from 'jsdom';
import { AvailableResources } from '../../../common';
import { Link } from '../components/link';
import { Image } from '../components/image';
import React from 'react';
import Handlebars from 'handlebars';

export interface HandlebarsToJsxProps {
  layout: string;
  resources: AvailableResources;
}

type Children = React.PropsWithChildren<unknown>;

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
      return (props: Children): JSX.Element => {
        return <Link {...getAllAttributes(node)} {...props} />;
      };
    case 'reactimage':
      return (props: Children): JSX.Element => {
        // The Image component internally assures that alt text is present, cannot render image without it
        // eslint-disable-next-line jsx-a11y/alt-text
        return <Image {...getAllAttributes(node)} {...props} />;
      };
    default:
      return lowered;
  }
};

const getAllAttributes = (node: Node): Record<string, unknown> => {
  const element = node as Element;
  return element
    .getAttributeNames()
    .reduce(
      (acc, attributeName) => ({ ...acc, [attributeName]: element.getAttribute(attributeName) }),
      {}
    );
};
