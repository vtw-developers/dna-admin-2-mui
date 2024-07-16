// ----------------------------------------------------------------------

export type ApiInfoFilters = {
  name: string;
  httpMethod: string;
  enabled: undefined | boolean;
  startModifiedTime: undefined | string;
  endModifiedTime: undefined | string;
};

export type ApiInfo = {
  id?: number;
  name: string;
  httpMethod: string;
  url: string;
  // serviceGroupId: number;
  enabled: boolean;
};

export const defaultApiInfoFilters: ApiInfoFilters = {
  name: '',
  httpMethod: '',
  enabled: undefined,
  startModifiedTime: undefined,
  endModifiedTime: undefined,
};
