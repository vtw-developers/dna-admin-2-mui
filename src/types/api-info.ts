// ----------------------------------------------------------------------

export type ApiInfoFilters = {
  name: string;
  httpMethod: string | undefined;
  author: string;
  startModifiedTime: undefined | string;
  endModifiedTime: undefined | string;
  enabled: undefined | boolean;
  serviceGroupId: undefined | number;
};

export type ApiInfo = {
  id?: number;
  name: string;
  httpMethod: string;
  url: string;
  serviceGroupId: number;
  enabled: boolean;
  flowId: string;
};

export const defaultApiInfoFilters: ApiInfoFilters = {
  name: '',
  httpMethod: undefined,
  author: '',
  startModifiedTime: undefined,
  endModifiedTime: undefined,
  enabled: undefined,
  serviceGroupId: undefined,
};
