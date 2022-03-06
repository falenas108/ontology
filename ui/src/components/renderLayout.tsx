import Head from 'next/head';
import { SparqlSimplified } from '../common/sparqlTable';
import styles from '../styles/Home.module.css';

export interface RenderLayoutProps {
  layout: unknown;
  data: SparqlSimplified | undefined;
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
        <p>Data! {data?.['o']}</p>
      </main>

      <footer className={styles.footer} />
    </div>
  );
};
