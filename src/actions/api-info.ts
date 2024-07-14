import type { ApiInfo, ApiInfoFilters } from 'src/types/api-info';
import type { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type ApiInfosData = {
  totalCount: number;
  data: ApiInfo[];
};

const PATH_PREFIX = '/apiInfo';

export function useGetApiInfos(pagination: GridPaginationModel, filters: ApiInfoFilters) {
  const url = `${PATH_PREFIX}/list`;
  const { data, isLoading, error, isValidating } = useSWR<ApiInfosData>(
    [
      `${url}`,
      {
        params: {
          page: pagination?.page,
          size: pagination?.pageSize,
          name: filters.name || '',
        },
      },
    ],
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

export const getApiInfo = async (id: string | number) =>
  (
    await axiosInstance.get(`${PATH_PREFIX}/find`, {
      params: { id },
    })
  ).data;

export const createApiInfo = async (params: ApiInfo) =>
  (await axiosInstance.post(`${PATH_PREFIX}/create`, params)).data;

export const updateApiInfo = async (params: ApiInfo) =>
  (await axiosInstance.post(`${PATH_PREFIX}/update`, params)).data;

export const deleteApiInfo = async (params: ApiInfo) =>
  (await axiosInstance.post(`${PATH_PREFIX}/delete`, params)).data;
