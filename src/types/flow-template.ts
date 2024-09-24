// ----------------------------------------------------------------------

export type FlowTemplateFilters = {
  name: string;
};

export type FlowTemplate = {
  sid?: number;
  name: string;
  parameters: any[];
};

export const defaultFlowTemplateFilters: FlowTemplateFilters = {
  name: '',
};
