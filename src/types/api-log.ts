// ----------------------------------------------------------------------
import moment from 'moment';

export type ApiLogFilters = {
  result: string;
  fromTime: undefined | string;
  toTime: undefined | string;
  serviceGroupId: undefined | number;
  apiId: undefined | number;
};

export type ApiLog = {
  id?: number;
  name: string;
  httpMethod: string;
  url: string;
  serviceGroupId: number;
  enabled: boolean;
};

export const defaultApiLogFilters: ApiLogFilters = {
  result: '',
  fromTime: moment(Date.now() - 1000 * 60 * 60).format('YYYY-MM-DD HH:mm:ss'),
  toTime: moment().format('YYYY-MM-DD HH:mm:ss'),
  serviceGroupId: undefined,
  apiId: undefined,
};
