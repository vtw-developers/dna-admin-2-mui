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

export type Schedule = {
  id?: number;
  serviceGroupName: string;
  ctiInfoId: number;
  ctiInfoName: string;
  cronExpr: string;
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
