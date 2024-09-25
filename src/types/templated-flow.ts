// ----------------------------------------------------------------------

export type TemplatedFlowFilters = {
  name: string;
};

export type TemplatedFlow = {
  id?: number;
  name: string;
  parameters: any[];
  templateSid: number;
};

export const defaultTemplatedFlowFilters: TemplatedFlowFilters = {
  name: '',
};
