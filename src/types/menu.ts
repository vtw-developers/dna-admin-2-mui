export type Menu = {
  menuId: string;
  name: string;
  type: string;
  icon?: string;
  upperMenuId?: string;
  pageInfoPath?: string;
  pageInfoId?: number;
  index?: number;
};

export type MenuTree = {
  id: string;
  name: string;
  icon?: string;
  pageInfoId?: number;
  pageInfoPath?: string;
  parentId?: string;
  type: string;
  seq?: number;
  children?: MenuTree[];
};

export const defaultGroup = (uuid: string) => ({
  menuId: uuid,
  name: 'New Group',
  type: 'group',
  upperMenuId: '0',
});

export const defaultPage = (menuId: string, uuid: string) => ({
  menuId: uuid,
  name: 'New Menu',
  type: 'page',
  upperMenuId: menuId,
});

export const defaultTree = (uuid: string) => ({
  id: uuid,
  name: '',
  type: '',
});
