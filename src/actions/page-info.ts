import type { PageInfo, PageInfoFilters } from 'src/types/page-info';
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

type PageInfosData = {
  totalCount: number;
  data: PageInfo[];
};

const PATH_PREFIX = '/pageInfo';

export function useGetPageInfos(
  pagination: GridPaginationModel,
  sortModel: GridSortModel,
  filters: PageInfoFilters
) {
  const url = `${PATH_PREFIX}/list`;
  const sort = () => {
    if (sortModel.length > 0) {
      return `${sortModel[0].field},${sortModel[0].sort}`;
    }
    return '';
  };

  const { data, isLoading, error, isValidating } = useSWR<PageInfosData>(
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

export const getPageInfo = async (id: string | number) =>
  (
    await axiosInstance.get(`${PATH_PREFIX}/find`, {
      params: { id },
    })
  ).data;

export const createPageInfo = async (params: PageInfo) =>
  (await axiosInstance.post(`${PATH_PREFIX}/create`, params)).data;

export const updatePageInfo = async (params: PageInfo) =>
  (await axiosInstance.post(`${PATH_PREFIX}/update`, params)).data;

export const deletePageInfo = async (params: PageInfo) =>
  (await axiosInstance.post(`${PATH_PREFIX}/delete`, params)).data;

export const pageRoleLevel = async (path: string) =>
  (await axiosInstance.get(`${PATH_PREFIX}/pageLevel`, { params: { path } })).data;
