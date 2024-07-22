import type { CtiLog, CtiLogFilters } from 'src/types/cti-log';
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

type CtiLogsData = {
  totalCount: number;
  data: CtiLog[];
};

const PATH_PREFIX = '/monitor/log/cti';

export function useGetCtiLogs(
  pagination: GridPaginationModel,
  sortModel: GridSortModel,
  filters: CtiLogFilters
) {
  const url = `${PATH_PREFIX}/list`;
  const sort = () => {
    if (sortModel.length > 0) {
      return `${sortModel[0].field},${sortModel[0].sort}`;
    }
    return '';
  };

  const { data, isLoading, error, isValidating } = useSWR<CtiLogsData>(
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

export const getCtiLog = async (id: string | number) =>
  (
    await axiosInstance.get(`${PATH_PREFIX}/find`, {
      params: { id },
    })
  ).data;

export const createCtiLog = async (params: CtiLog) =>
  (await axiosInstance.post(`${PATH_PREFIX}/create`, params)).data;

export const updateCtiLog = async (params: CtiLog) =>
  (await axiosInstance.post(`${PATH_PREFIX}/update`, params)).data;

export const deleteCtiLog = async (params: CtiLog) =>
  (await axiosInstance.post(`${PATH_PREFIX}/delete`, params)).data;
