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

  const parser = JSDOM.fragment(`<div>${template(resources)}</div>`);
  return mapNodeToCreateElement(parser.firstChild!);
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
  const reactNode = getReactNode(lowered);
  if (reactNode === '#text') {
    return reactNode;
  }
  return (props: Children): JSX.Element => {
    return React.createElement(reactNode, { ...getAllAttributes(node), ...props });
  };
};

const getReactNode = (nodeName: string): string | ((props: any) => JSX.Element) => {
  switch (nodeName) {
    case 'reactlink':
      return Link;
    case 'reactimage':
      return Image;
    default:
      return nodeName;
  }
};

const getAllAttributes = (node: Node): Record<string, unknown> => {
  const element = node as Element & Node;
  return element?.getAttributeNames?.()?.reduce((acc, attributeName) => {
    const attributeKey = attributeName === 'style' ? 'STYLE' : attributeName;

    return {
      ...acc,
      [attributeKey]: element.getAttribute(attributeName),
    };
  }, {});
};
