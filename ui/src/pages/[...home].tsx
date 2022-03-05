import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { SparqlSource } from '../common/sparqlTable';
import { RenderLayout } from '../components/renderLayout';
import { fetchDefaultData } from '../services/defaultData';

const Home: NextPage = () => {
  const [data, setData] = useState<SparqlSource[]>([]);

  const fetchData = async () => {
    const newData = await fetchDefaultData();
    setData((oldData) => [...oldData, newData]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <RenderLayout layout={undefined} data={data} />;
};

export default Home;
