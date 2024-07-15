// ----------------------------------------------------------------------

export type ApiInfoFilters = {
  name: string;
  httpMethod: string;
};

export type ApiInfo = {
  id?: number;
  name: string;
  httpMethod: string;
  url: string;
  // serviceGroupId: number;
  // enabled: boolean;
};
