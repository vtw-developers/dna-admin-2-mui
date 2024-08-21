// ----------------------------------------------------------------------

export type PageInfoFilters = {
  name: string;
  path: string;
  readRoleId: number | undefined;
};

export type PageInfo = {
  id?: number;
  name: string;
  path: string;
  readRoleId?: number;
  readRoleName?: string;
};

export const defaultPageInfoFilters: PageInfoFilters = {
  name: '',
  path: '',
  readRoleId: undefined,
};
