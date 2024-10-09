import type { Flow, FlowFilters } from 'src/types/flow';
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

type FlowsData = {
  totalCount: number;
  data: Flow[];
};

const PATH_PREFIX = '/flow';

export function useGetFlows(
  pagination: GridPaginationModel,
  sortModel: GridSortModel,
  filters: FlowFilters
) {
  const url = `${PATH_PREFIX}/list`;
  const sort = () => {
    if (sortModel.length > 0) {
      return `${sortModel[0].field},${sortModel[0].sort}`;
    }
    return '';
  };

  const { data, isLoading, error, isValidating, mutate } = useSWR<FlowsData>(
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
      mutate,
    }),
    [data?.data, data?.totalCount, isLoading, error, isValidating, mutate]
  );

  return memoizedValue;
}

export const getTemplatedFlow = async (sid: string | number) =>
  (
    await axiosInstance.get(`${PATH_PREFIX}/find`, {
      params: { sid },
    })
  ).data;

export const createTemplatedFlow = async (params: Flow) =>
  (await axiosInstance.post(`${PATH_PREFIX}/create`, params)).data;

export const updateTemplatedFlow = async (params: Flow) =>
  (await axiosInstance.post(`${PATH_PREFIX}/update`, params)).data;

export const deleteTemplatedFlow = async (params: Flow) =>
  (await axiosInstance.post(`${PATH_PREFIX}/delete`, params)).data;

export const importTemplatedFlow = async (params: any) =>
  (await axiosInstance.post(`${PATH_PREFIX}/import`, params)).data;

export const exportTemplatedFlow = async (params: any) =>
  (await axiosInstance.post(`${PATH_PREFIX}/export`, params)).data;

export const getScheduableFlows = async () =>
  (await axiosInstance.get(`${PATH_PREFIX}/getSchedulableFlows`)).data;
