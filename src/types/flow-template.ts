// ----------------------------------------------------------------------

export type FlowTemplateFilters = {
  name: string;
};

export type FlowTemplate = {
  sid?: number;
  name: string;
};

export const defaultFlowTemplateFilters: FlowTemplateFilters = {
  name: '',
};
