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

export type DataSchema = {
  id: string;
  name: string;
  type: string;
  arrayType?: string;
  description: string;
  depth: number;
  children: DataSchema[];
};
