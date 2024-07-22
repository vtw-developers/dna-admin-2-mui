// ----------------------------------------------------------------------

export type ApiLogFilters = {
  result: string;
  fromTime: undefined | string;
  toTime: undefined | string;
  serviceGroupId: undefined | number;
  apiId: undefined | number;
};

export type ApiLog = {
  id?: number;
  name: string;
  httpMethod: string;
  url: string;
  serviceGroupId: number;
  enabled: boolean;
};

export const defaultApiLogFilters: ApiLogFilters = {
  result: '',
  fromTime: undefined,
  toTime: undefined,
  serviceGroupId: undefined,
  apiId: undefined,
};
