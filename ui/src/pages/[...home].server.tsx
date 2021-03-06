import { NextPage } from 'next';
import { NextRouter } from 'next/router';
import { layoutToJsx } from '../common/layoutToJsx';
import { routeToLayout } from '../common/routeToLayout';
import { getRoute } from '../common/getRoute';

interface HomeProps {
  layout: string;
  router: NextRouter;
}

const Home: NextPage<HomeProps> = ({ router }) => {
  const filledLayout = layoutToJsx(routeToLayout(getRoute(router.query)));
  return <>{filledLayout}</>;
};

export default Home;
