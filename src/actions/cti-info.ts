import type { ApiInfo } from 'src/types/api-info';
import type { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import type { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher } from 'src/utils/axios';

import type { CtiInfo, CtiInfoFilters } from '../types/cti-info';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type CtiInfosData = {
  totalCount: number;
  data: ApiInfo[];
};

const PATH_PREFIX = '/ctiInfo';

export function useGetCtiInfos(
  pagination: GridPaginationModel,
  sortModel: GridSortModel,
  filters: CtiInfoFilters
) {
  const url = `${PATH_PREFIX}/list`;
  const sort = () => {
    if (sortModel.length > 0) {
      return `${sortModel[0].field},${sortModel[0].sort}`;
    }
    return '';
  };

  const { data, isLoading, error, isValidating } = useSWR<CtiInfosData>(
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

export const getCtiInfo = async (id: string | number) =>
  (
    await axiosInstance.get(`${PATH_PREFIX}/find`, {
      params: { id },
    })
  ).data;

export const createCtiInfo = async (params: CtiInfo) =>
  (await axiosInstance.post(`${PATH_PREFIX}/create`, params)).data;

export const updateCtiInfo = async (params: CtiInfo) =>
  (await axiosInstance.post(`${PATH_PREFIX}/update`, params)).data;

export const deleteCtiInfo = async (params: CtiInfo) =>
  (await axiosInstance.post(`${PATH_PREFIX}/delete`, params)).data;
