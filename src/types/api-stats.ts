// ----------------------------------------------------------------------

export type ApiStatsFilters = {
  name: string;
  httpMethod: string | undefined;
  author: string;
  startModifiedTime: undefined | string;
  endModifiedTime: undefined | string;
  enabled: undefined | boolean;
  serviceGroupId: undefined | number;
};

export type ApiStats = {
  id?: number;
  name: string;
  httpMethod: string;
  url: string;
  serviceGroupId: number;
  enabled: boolean;
  flowId: string;
  flowMetaYaml: string;
  requestParameters: any[];
  responseElements: any[];
};

export const defaultApiStatsFilters: ApiStatsFilters = {
  name: '',
  httpMethod: undefined,
  author: '',
  startModifiedTime: undefined,
  endModifiedTime: undefined,
  enabled: undefined,
  serviceGroupId: undefined,
};
