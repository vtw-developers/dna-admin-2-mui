// ----------------------------------------------------------------------

export type PageInfoFilters = {
  name: string;
  path: string;
  roleId: number | undefined;
};

export type PageInfo = {
  id?: number;
  name: string;
  path: string;
  roleId?: number;
  roleName?: string;
};

export const defaultPageInfoFilters: PageInfoFilters = {
  name: '',
  path: '',
  roleId: undefined,
};
