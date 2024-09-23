import type { GridSortModel } from '@mui/x-data-grid/models/gridSortModel';
import type { FlowTemplate, FlowTemplateFilters } from 'src/types/flow-template';
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

type FlowTemplatesData = {
  totalCount: number;
  data: FlowTemplate[];
};

const PATH_PREFIX = '/flowTemplate';

export function useGetFlowTemplates(
  pagination: GridPaginationModel,
  sortModel: GridSortModel,
  filters: FlowTemplateFilters
) {
  const url = `${PATH_PREFIX}/list`;
  const sort = () => {
    if (sortModel.length > 0) {
      return `${sortModel[0].field},${sortModel[0].sort}`;
    }
    return '';
  };

  const { data, isLoading, error, isValidating, mutate } = useSWR<FlowTemplatesData>(
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

export const getFlowTemplate = async (sid: string | number) =>
  (
    await axiosInstance.get(`${PATH_PREFIX}/find`, {
      params: { sid },
    })
  ).data;

export const getFlowTemplates = async () =>
  (await axiosInstance.get(`${PATH_PREFIX}/findAll`, {})).data;

export const createFlowTemplate = async (params: FlowTemplate) =>
  (await axiosInstance.post(`${PATH_PREFIX}/create`, params)).data;

export const updateFlowTemplate = async (params: FlowTemplate) =>
  (await axiosInstance.post(`${PATH_PREFIX}/update`, params)).data;

export const deleteFlowTemplate = async (params: FlowTemplate) =>
  (await axiosInstance.post(`${PATH_PREFIX}/delete`, params)).data;
