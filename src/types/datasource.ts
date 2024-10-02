// ----------------------------------------------------------------------

export type DatasourceFilters = {
  name: string;
  database: string;
};

export type Datasource = {
  id?: number;
  name: string;
  database: string;
  url: string;
  username: string;
  password: string;
};

export const defaultDatasourceFilters: DatasourceFilters = { name: '', database: '' };
