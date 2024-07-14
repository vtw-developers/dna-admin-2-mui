import type { ApiInfoItem, ApiInfoFilters } from 'src/types/api-info';
import type { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type ApiInfosData = {
  totalCount: number;
  data: ApiInfoItem[];
};

export function useGetApiInfos(pagination: GridPaginationModel, filters: ApiInfoFilters) {
  console.log('useGetApiInfos');
  const url = endpoints.apiInfo.list;
  console.log(
    `${url}?page=${pagination?.page}&size=${pagination?.pageSize}&name=${filters.name || ''}`
  );
  const { data, isLoading, error, isValidating } = useSWR<ApiInfosData>(
    `${url}?page=${pagination?.page}&size=${pagination?.pageSize}&name=${filters.name || ''}`,
    fetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      data: data?.data || [],
      loading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.data.length,
      totalCount: data?.totalCount || 0,
    }),
    [data?.data, error, isLoading, isValidating, pagination, filters]
  );

  return memoizedValue;
}
