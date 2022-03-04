import type { NextPage } from 'next';
import Head from 'next/head';
import { DynamicRenderer } from '../components/dynamicRenderer';
import styles from '../styles/Home.module.css';
import { mockPageLayout } from '../__fixtures__/mockPageLayout';
import { mockRDFResponse } from '../__fixtures__/mockRdfResponse';
import { mockSparqlTable } from '../__fixtures__/mockSparqlTableResponse';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ontology</title>
        <meta name="description" content="Ontology application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <DynamicRenderer
          layout={mockPageLayout}
          resources={{
            HeatherRDF: mockRDFResponse,
            Knows: mockSparqlTable,
          }}
        />
      </main>

      <footer className={styles.footer} />
    </div>
  );
};

export default Home;
