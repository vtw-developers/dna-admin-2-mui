// ----------------------------------------------------------------------

export type FlowFilters = {
  name: string;
};

export type Flow = {
  sid?: number;
  flowType: string;
  flowId: string;
  name: string;
  httpMethod: string;
  url: string;
  requestParameters: any[];
  responseBody: any;
  parameters: any[];
  templated: boolean;
  templateSid: number | undefined;
  templateId: string;
};

export const defaultTemplatedFlowFilters: FlowFilters = {
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
