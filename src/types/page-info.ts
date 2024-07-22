// ----------------------------------------------------------------------

export type PageInfoFilters = {
  name: string;
  path: string;
};

export type PageInfo = {
  id?: number;
  name: string;
  path: string;
};

export const defaultPageInfoFilters: PageInfoFilters = {
  name: '',
  path: '',
};
