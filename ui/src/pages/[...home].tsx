import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Ontology</title>
        <meta name="description" content="Ontology application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>The application</h1>
      </main>

      <footer className={styles.footer} />
    </div>
  );
};

export default Home;
