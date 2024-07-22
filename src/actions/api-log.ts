import type { ApiLog, ApiLogFilters } from 'src/types/api-log';
import type { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
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

type ApiLogsData = {
  totalCount: number;
  data: ApiLog[];
};

const PATH_PREFIX = '/monitor/log/api';

export function useGetApiLogs(
  pagination: GridPaginationModel,
  sortModel: GridSortModel,
  filters: ApiLogFilters
) {
  const url = `${PATH_PREFIX}/list`;
  const sort = () => {
    if (sortModel.length > 0) {
      return `${sortModel[0].field},${sortModel[0].sort}`;
    }
    return '';
  };

  const { data, isLoading, error, isValidating } = useSWR<ApiLogsData>(
    [
      `${url}`,
      {
        params: {
          ...filters,
          page: pagination?.page,
          size: pagination?.pageSize,
          sort: sort(),
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
      error,
      isValidating,
      empty: !isLoading && !data?.data.length,
      totalCount: data?.totalCount || 0,
    }),
    [data?.data, error, isLoading, isValidating, pagination, filters]
  );

  return memoizedValue;
}

export const getApiLog = async (id: string | number) =>
  (
    await axiosInstance.get(`${PATH_PREFIX}/find`, {
      params: { id },
    })
  ).data;

export const createApiLog = async (params: ApiLog) =>
  (await axiosInstance.post(`${PATH_PREFIX}/create`, params)).data;

export const updateApiLog = async (params: ApiLog) =>
  (await axiosInstance.post(`${PATH_PREFIX}/update`, params)).data;

export const deleteApiLog = async (params: ApiLog) =>
  (await axiosInstance.post(`${PATH_PREFIX}/delete`, params)).data;
