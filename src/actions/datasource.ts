import type { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import type { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher } from 'src/utils/axios';

import type { Datasource, DatasourceFilters } from '../types/datasource';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type DatasourcesData = {
  totalCount: number;
  data: Datasource[];
};

const PATH_PREFIX = '/datasource';

export function useGetDatasources(
  pagination: GridPaginationModel,
  sortModel: GridSortModel,
  filters: DatasourceFilters
) {
  const url = `${PATH_PREFIX}/list`;
  const sort = () => {
    if (sortModel.length > 0) {
      return `${sortModel[0].field},${sortModel[0].sort}`;
    }
    return '';
  };

  const { data, isLoading, error, isValidating } = useSWR<DatasourcesData>(
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

export const getDatasource = async (id: string | number) =>
  (
    await axiosInstance.get(`${PATH_PREFIX}/find`, {
      params: { id },
    })
  ).data;

export const getDatasources = async () => (await axiosInstance.get(`${PATH_PREFIX}/findAll`)).data;

export const createDatasource = async (params: Datasource) =>
  (await axiosInstance.post(`${PATH_PREFIX}/create`, params)).data;

export const updateDatasource = async (params: Datasource) =>
  (await axiosInstance.post(`${PATH_PREFIX}/update`, params)).data;

export const deleteDatasource = async (params: Datasource) =>
  (await axiosInstance.post(`${PATH_PREFIX}/delete`, params)).data;
