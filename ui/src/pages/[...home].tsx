import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import React, { useCallback, useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

export interface HomeProps {
  layout: unknown;
  initialLayout?: React.ReactNode;
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const layout = null; // getLayout();
  let initialLayout;
  if (false) {
    // if (!hasExternalDependencies(layout)) {
    initialLayout = null; // fillLayout(layout, internalDependencies);
  }
  return {
    props: { initialLayout, layout },
  };
};

const Home: NextPage<HomeProps> = ({ initialLayout, layout }) => {
  const [filledLayout, setFilledLayout] = useState<React.ReactNode | undefined>(initialLayout);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await (() => null)(); // <- API call to external source
      const layoutFilled = null; // <- call to fill template layout from data fillLayout(result, layoutTemplate);
      setFilledLayout(layoutFilled);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!filledLayout) {
      fetchData();
    }
  }, [fetchData, filledLayout]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Ontology</title>
        <meta name="description" content="Ontology application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>The Application</h1>
        <p>{filledLayout}</p>
      </main>

      <footer className={styles.footer} />
    </div>
  );
};

export default Home;
