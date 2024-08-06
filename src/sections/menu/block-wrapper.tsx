import { v4 as uuidv4 } from 'uuid';
import { ReactSortable } from 'react-sortablejs';

import Box from '@mui/material/Box';

import { defaultPage } from '../../types/menu';
import { sortableOptions } from './menu-edit-tree';
import { Iconify } from '../../components/iconify';

import type { MenuTree } from '../../types/menu';
import type { UseBooleanReturn } from '../../hooks/use-boolean';

type FunctionProps = {
  menu: MenuTree;
  menuIndex: number[];
  setMenus: any;
  selectedMenu: MenuTree;
  setSelectedMenu: any;
  setPlainMenus: any;
  confirm: UseBooleanReturn;
};

const Container = ({
  menu,
  menuIndex,
  setMenus,
  selectedMenu,
  setSelectedMenu,
  setPlainMenus,
  confirm,
}: FunctionProps) => (
  <ReactSortable
    {...sortableOptions}
    key={menu.id}
    list={menu.children}
    setList={(currentList) => {
      setMenus((sourceList: any) => {
        const tempList = [...sourceList];
        const _blockIndex = [...menuIndex];
        const lastIndex = _blockIndex.pop() || 0;
        const lastArr = _blockIndex.reduce((arr, i) => arr[i].children, tempList);
        lastArr[lastIndex].children = currentList;
        return tempList;
      });
    }}
  >
    {menu.children &&
      menu.children.map((childBlock, idx) => (
        <BlockWrapper
          key={childBlock.id}
          menu={childBlock}
          menuIndex={[...menuIndex, idx]}
          setMenus={setMenus}
          selectedMenu={selectedMenu}
          setPlainMenus={setPlainMenus}
          setSelectedMenu={setSelectedMenu}
          confirm={confirm}
        />
      ))}
  </ReactSortable>
);

export const BlockWrapper = ({
  menu,
  menuIndex,
  setMenus,
  selectedMenu,
  setSelectedMenu,
  setPlainMenus,
  confirm,
}: FunctionProps) => {
  if (!menu) return null;
  const addPage = () => {
    setPlainMenus((prev: any) => [defaultPage(menu.id, uuidv4()), ...prev]);
  };

  const selectItem = (item: MenuTree) => {
    setSelectedMenu(item);
  };

  if (menu.type === 'group') {
    return (
      <Box
        className={`block group ${selectedMenu?.id === menu.id ? 'selected' : ''}`}
        onClick={() => selectItem(menu)}
      >
        <div className="header">
          {menu.name}
          <div>
            <Iconify icon="mingcute:add-line" onClick={addPage} />
            <Iconify icon="mingcute:delete-2-line" onClick={confirm.onTrue} />
          </div>
        </div>
        <Container
          menu={menu}
          setMenus={setMenus}
          menuIndex={menuIndex}
          confirm={confirm}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          setPlainMenus={setPlainMenus}
        />
      </Box>
    );
  }
  return (
    <Box
      className={`block page ${selectedMenu?.id === menu.id ? 'selected' : ''}`}
      onClick={(e) => {
        selectItem(menu);
        e.stopPropagation();
      }}
    >
      <Iconify icon="mingcute:selector-vertical-line" />
      {menu.name}
      <Iconify icon="mingcute:delete-2-line" onClick={confirm.onTrue} />
    </Box>
  );
};
