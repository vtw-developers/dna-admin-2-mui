// ----------------------------------------------------------------------

export type UserFilters = {
  id: string;
  name: string;
  roleId: number | undefined;
  approval: boolean | null;
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
  approval: null,
};

export type Role = {
  id?: number;
  name: string;
  level?: number;
};
