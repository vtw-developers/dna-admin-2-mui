import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from 'src/utils/axios';

import type { ApiStats, ApiStatsFilters } from '../types/api-stats';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

const PATH_PREFIX = '/api/stats';

export function useGetApiStats(filters: ApiStatsFilters) {
  const url = `${PATH_PREFIX}`;

  const { data, isLoading, error, isValidating, mutate } = useSWR<ApiStats[]>(
    [
      `${url}`,
      {
        params: {
          ...filters,
        },
      },
    ],
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      data: data || [],
      loading: isLoading,
      error,
      isValidating,
      empty: false,
      mutate,
    }),
    [data, isLoading, error, isValidating, mutate]
  );

  return memoizedValue;
}
