import type { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import type { BoardMaster, BoardMasterFilters } from 'src/types/board-master';
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

type BoardMastersData = {
  totalCount: number;
  data: BoardMaster[];
};

const PATH_PREFIX = '/boardMaster';

export function useGetBoardMasters(
  pagination: GridPaginationModel,
  sortModel: GridSortModel,
  filters: BoardMasterFilters
) {
  const url = `${PATH_PREFIX}/list`;
  const sort = () => {
    if (sortModel.length > 0) {
      return `${sortModel[0].field},${sortModel[0].sort}`;
    }
    return '';
  };

  const { data, isLoading, error, isValidating } = useSWR<BoardMastersData>(
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

export const getBoardMaster = async (id: string | number) =>
  (
    await axiosInstance.get(`${PATH_PREFIX}/find`, {
      params: { id },
    })
  ).data;

export const createBoardMaster = async (params: BoardMaster) =>
  (await axiosInstance.post(`${PATH_PREFIX}/create`, params)).data;

export const updateBoardMaster = async (params: BoardMaster) =>
  (await axiosInstance.post(`${PATH_PREFIX}/update`, params)).data;

export const deleteBoardMaster = async (params: BoardMaster) =>
  (await axiosInstance.post(`${PATH_PREFIX}/delete`, params)).data;
