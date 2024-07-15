// ----------------------------------------------------------------------

export type CtiInfoFilters = {
  name: string;
};

export type CtiInfo = {
  id?: number;
  name: string;
  // serviceGroupId: number;
  // enabled: boolean;
};

export const defaultCtiInfoFilters: CtiInfoFilters = { name: '' };
