import Head from 'next/head';
import { SparqlSource } from '../common/sparqlTable';
import styles from '../styles/Home.module.css';

export interface RenderLayoutProps {
  layout: unknown;
  data: SparqlSource[];
}

export const RenderLayout = ({ data }: RenderLayoutProps) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ontology</title>
        <meta name="description" content="Ontology application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>The Application</h1>
        <p>Data! {data[0]?.['$o']}</p>
      </main>

      <footer className={styles.footer} />
    </div>
  );
};
