// ----------------------------------------------------------------------

export type ServiceGroupFilters = {
  name: string;
};

export type ServiceGroup = {
  id?: number;
  name: string;
  // serviceGroupId: number;
  // enabled: boolean;
};

export const defaultServiceGroupFilters: ServiceGroupFilters = { name: '' };
