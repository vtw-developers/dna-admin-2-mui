import type { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import type { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher } from 'src/utils/axios';

import type { Board, BoardFilters } from '../types/board';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type BoardsData = {
  totalCount: number;
  data: Board[];
};

const PATH_PREFIX = '/board';

export function useGetBoards(
  pagination: GridPaginationModel,
  sortModel: GridSortModel,
  filters: BoardFilters
) {
  const url = `${PATH_PREFIX}/list`;
  const sort = () => {
    if (sortModel.length > 0) {
      return `${sortModel[0].field},${sortModel[0].sort}`;
    }
    return '';
  };

  const { data, isLoading, error, isValidating } = useSWR<BoardsData>(
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
    [data?.data, data?.totalCount, isLoading, error, isValidating]
  );

  return memoizedValue;
}

export const getBoard = async (id: string | number) =>
  (
    await axiosInstance.get(`${PATH_PREFIX}/find`, {
      params: { id },
    })
  ).data;

export const createBoard = async (params: FormData) =>
  (
    await axiosInstance.post(`${PATH_PREFIX}/create`, params, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  ).data;

export const updateBoard = async (params: FormData) =>
  (
    await axiosInstance.post(`${PATH_PREFIX}/update`, params, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  ).data;

export const deleteBoard = async (params: Board) =>
  (await axiosInstance.post(`${PATH_PREFIX}/delete`, params)).data;

export const download = async (id: string | number) =>
  (
    await axiosInstance.get(`${PATH_PREFIX}/download`, {
      params: { id },
      responseType: 'blob',
    })
  ).data;

export const getPopups = async () =>
  (await axiosInstance.get(`${PATH_PREFIX}/find-popup-list`)).data;
