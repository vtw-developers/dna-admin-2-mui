// ----------------------------------------------------------------------

export type TemplatedFlowFilters = {
  name: string;
};

export type TemplatedFlow = {
  id?: number;
  name: string;
  templateId: number;
};

export const defaultTemplatedFlowFilters: TemplatedFlowFilters = {
  name: '',
};
