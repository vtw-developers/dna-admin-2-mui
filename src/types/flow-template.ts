// ----------------------------------------------------------------------

export type FlowTemplateFilters = {
  name: string;
};

export type FlowTemplate = {
  id?: number;
  name: string;
};

export const defaultFlowTemplateFilters: FlowTemplateFilters = {
  name: '',
};
