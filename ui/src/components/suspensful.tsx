import { useData } from '../../../common/useData';

export const Suspensful = (): JSX.Element => {
  const data = useData<string>(
    'test',
    () =>
      new Promise((resolve) => {
        setTimeout(() => resolve('data!'), 4000);
      })
  );

  return <>{data}</>;
};
