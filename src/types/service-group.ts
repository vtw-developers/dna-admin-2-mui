// ----------------------------------------------------------------------

export type ServiceGroupFilters = {
  name: string;
};

export type ServiceGroup = {
  id?: number;
  name: string;
  description: string;
};

export const defaultServiceGroupFilters: ServiceGroupFilters = { name: '' };
