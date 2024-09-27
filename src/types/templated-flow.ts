// ----------------------------------------------------------------------

export type TemplatedFlowFilters = {
  name: string;
};

export type TemplatedFlow = {
  sid?: number;
  flowId: string;
  name: string;
  httpMethod: string;
  url: string;
  requestParameters: any[];
  responseBody: any;
  parameters: any[];
  templateSid: number;
  templateId: string;
};

export const defaultTemplatedFlowFilters: TemplatedFlowFilters = {
  name: '',
};

export type DataSchema = {
  id: string;
  name: string;
  type: string;
  arrayType?: string;
  description: string;
  depth: number;
  children: DataSchema[];
};
