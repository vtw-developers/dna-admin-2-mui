// ----------------------------------------------------------------------

export type FlowTemplateFilters = {
  name: string;
};

export type FlowTemplate = {
  sid?: number;
  flowType: string;
  name: string;
  templateId: string;
  parameters: any[];
};

export const defaultFlowTemplateFilters: FlowTemplateFilters = {
  name: '',
};
