// ----------------------------------------------------------------------

export type PageInfoFilters = {
  name: string;
  path: string;
  readRoleId: number | undefined;
  writeRoleId: number | undefined;
};

export type PageInfo = {
  id?: number;
  name: string;
  path: string;
  readRoleId?: number;
  readRoleName?: string;
  writeRoleId?: number;
  writeRoleName?: string;
};

export const defaultPageInfoFilters: PageInfoFilters = {
  name: '',
  path: '',
  readRoleId: undefined,
  writeRoleId: undefined,
};
