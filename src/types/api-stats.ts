// ----------------------------------------------------------------------

export type ApiStatsFilters = {
  startDate: undefined | string;
  endDate: undefined | string;
};

export type ApiStats = {
  serviceGroup: string;
  api: string;
  year: number;
  month: number;
  count: number;
};

export const defaultApiStatsFilters: ApiStatsFilters = {
  startDate: undefined,
  endDate: undefined,
};
