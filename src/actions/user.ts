import type { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import type { GridPaginationModel } from '@mui/x-data-grid/models/gridPaginationProps';

import useSWR from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher } from 'src/utils/axios';

import type { User, UserFilters } from '../types/user';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

type UserData = {
  totalCount: number;
  data: User[];
};

const PATH_PREFIX = '/user';
const ROLE_PATH_PREFIX = '/role';

export function useGetUsers(
  pagination: GridPaginationModel,
  sortModel: GridSortModel,
  filters: UserFilters
) {
  const url = `${PATH_PREFIX}/list`;
  const sort = () => {
    if (sortModel.length > 0) {
      return `${sortModel[0].field},${sortModel[0].sort}`;
    }
    return '';
  };

  const { data, isLoading, error, isValidating, mutate } = useSWR<UserData>(
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
      mutate,
      empty: !isLoading && !data?.data.length,
      totalCount: data?.totalCount || 0,
    }),
    [data?.data, data?.totalCount, isLoading, error, isValidating, mutate]
  );

  return memoizedValue;
}

export const getUser = async (id: string) =>
  (
    await axiosInstance.get(`${PATH_PREFIX}/find`, {
      params: { id },
    })
  ).data;

export const getRoles = async () => (await axiosInstance.get(`${ROLE_PATH_PREFIX}/list`)).data;

export const updateUser = async (params: User) =>
  (await axiosInstance.post(`${PATH_PREFIX}/update`, params)).data;

export const createUser = async (params: User) =>
  (await axiosInstance.post(`${PATH_PREFIX}/create`, params)).data;

export const approveUser = async (id: string) =>
  (await axiosInstance.get(`${PATH_PREFIX}/approval`, { params: { id } })).data;

export const deleteUser = async (id: string) =>
  (await axiosInstance.get(`${PATH_PREFIX}/delete`, { params: { id } })).data;
