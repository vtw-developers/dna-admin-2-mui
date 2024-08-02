import { v4 as uuidv4 } from 'uuid';

export type Menu = {
  menuId: string;
  name: string;
  type: string;
  icon?: string;
  upperMenuId?: string;
  pageInfoId?: number;
  index?: number;
};

export type MenuTree = {
  id: string;
  name: string;
  icon?: string;
  pageInfoId?: number;
  parentId?: string;
  type: string;
  children?: MenuTree[];
};

export const defaultGroup: Menu = {
  menuId: uuidv4(),
  name: 'New Group',
  type: 'group',
  upperMenuId: '0',
};

export const defaultPage = (menuId: string) => ({
  menuId: uuidv4(),
  name: 'New Menu',
  type: 'page',
  upperMenuId: menuId,
});

export const defaultTree: MenuTree = {
  id: uuidv4(),
  name: '',
  type: '',
};
