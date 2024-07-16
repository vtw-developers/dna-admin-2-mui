// ----------------------------------------------------------------------

export type CtiInfoFilters = {
  name: string;
  httpMethod: undefined | 'GET' | 'POST';
  author: string;
  startModifiedTime: undefined | string;
  endModifiedTime: undefined | string;
  enabled: undefined | boolean;
  serviceGroupId: undefined | number;
};

export type CtiInfo = {
  id?: number;
  name: string;
  // serviceGroupId: number;
  // enabled: boolean;
};

export const defaultCtiInfoFilters: CtiInfoFilters = {
  name: '',
  httpMethod: undefined,
  author: '',
  startModifiedTime: undefined,
  endModifiedTime: undefined,
  enabled: true,
  serviceGroupId: undefined,
};
