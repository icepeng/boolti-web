import { useShowDetail } from '@boolti/api';
import { useParams } from 'react-router-dom';

import ShowDetailLayout from '~/components/ShowDetailLayout';

import Styled from './ShowEnteryPage.styles';

const ShowEnteryPage = () => {
  const params = useParams<{ showId: string }>();

  const { data: show } = useShowDetail(Number(params!.showId));

  if (!show) return null;

  return (
    <ShowDetailLayout showName={show.name}>
      <Styled.Container></Styled.Container>
    </ShowDetailLayout>
  );
};

export default ShowEnteryPage;