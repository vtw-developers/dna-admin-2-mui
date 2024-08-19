import axiosInstance from 'src/utils/axios';

const PATH_PREFIX = '/comment';

export const getComments = async (id: string | number) =>
  (
    await axiosInstance.get(`${PATH_PREFIX}/list`, {
      params: { boardId: id },
    })
  ).data;

export const createComment = async (params: any) =>
  (await axiosInstance.post(`${PATH_PREFIX}/create`, params)).data;

export const deleteComment = async (params: any) =>
  (await axiosInstance.post(`${PATH_PREFIX}/delete`, params)).data;
