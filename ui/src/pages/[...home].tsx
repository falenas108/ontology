import type { NextPage } from 'next';
import React from 'react';
import { mockLayout } from '../__fixtures__/layout/testLayout';
import { mockData } from '../__fixtures__/layout/testData';
import createDOMPurify from 'isomorphic-dompurify';

interface HomeProps {
  layout: string;
}

export async function getServerSideProps() {
  const Handlebars = await import('handlebars');
  const template = Handlebars.compile(mockLayout);
  return { props: { layout: template(mockData) } };
}

const Home: NextPage<HomeProps> = ({ layout }) => {
  return <div dangerouslySetInnerHTML={{ __html: createDOMPurify.sanitize(layout) }} />;
};

export default Home;
