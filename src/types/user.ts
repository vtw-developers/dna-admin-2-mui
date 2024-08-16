// ----------------------------------------------------------------------

export type UserFilters = {
  id: string;
  name: string;
  roleId: number | undefined;
};

export type User = {
  id?: string;
  name: string;
  roleId?: number;
  roleName?: string;
};

export const defaultUserFilters: UserFilters = {
  id: '',
  name: '',
  roleId: undefined,
};

export type Role = {
  id?: number;
  name: string;
  level?: number;
};
