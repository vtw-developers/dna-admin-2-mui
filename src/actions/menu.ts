import axiosInstance from 'src/utils/axios';

const PATH_PREFIX = '/menu';

export const getMenuView = async () => (await axiosInstance.get(`${PATH_PREFIX}/view`, {})).data;

export const saveMenu = async (params: any) =>
  (await axiosInstance.post(`${PATH_PREFIX}/save`, params, {})).data;
