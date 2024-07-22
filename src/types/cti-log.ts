// ----------------------------------------------------------------------

export type CtiLogFilters = {
  result: string;
  fromTime: undefined | string;
  toTime: undefined | string;
  serviceGroupId: undefined | number;
  apiId: undefined | number;
};

export type CtiLog = {
  id?: number;
  name: string;
  httpMethod: string;
  url: string;
  serviceGroupId: number;
  enabled: boolean;
};

export const defaultCtiLogFilters: CtiLogFilters = {
  result: '',
  fromTime: undefined,
  toTime: undefined,
  serviceGroupId: undefined,
  apiId: undefined,
};
