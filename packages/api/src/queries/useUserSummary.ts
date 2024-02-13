import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../queryKey';

const useUserSummary = () => useQuery(queryKeys.user.summary);

export default useUserSummary;
