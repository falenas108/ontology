import { useData } from '../../../common';

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
