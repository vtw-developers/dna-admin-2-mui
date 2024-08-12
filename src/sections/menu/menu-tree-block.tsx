import { v4 as uuidv4 } from 'uuid';
import { ReactSortable } from 'react-sortablejs';

import Box from '@mui/material/Box';

import { defaultPage } from '../../types/menu';
import { Iconify } from '../../components/iconify';
import { icon } from '../../layouts/config-nav-dashboard';

import type { MenuTree } from '../../types/menu';
import type { UseBooleanReturn } from '../../hooks/use-boolean';

type FunctionProps = {
  menu: MenuTree;
  setRootMenuTree: any;
  menuIndex: number[];
  setMenuTree: any;
  selectedMenu: MenuTree;
  setSelectedMenu: any;
  setMenuList: any;
  confirm: UseBooleanReturn;
};

export const sortableOptions = {
  animation: 150,
  fallbackOnBody: true,
  swapThreshold: 0.2,
  ghostClass: 'ghost',
  group: 'shared',
};

export const Container = ({
  menu,
  setRootMenuTree,
  menuIndex,
  setMenuTree,
  selectedMenu,
  setSelectedMenu,
  setMenuList,
  confirm,
}: FunctionProps) => {
  if (!menu || !setRootMenuTree) {
    return;
  }
  return (
    <ReactSortable
      {...sortableOptions}
      key={menu.id}
      list={menu.children}
      setList={(currentList) => {
        console.log(currentList);
        if (currentList.length < 1) return;

        setRootMenuTree((rootMenuTree: any) => {
          console.log(rootMenuTree);

          menu.children = currentList;
          console.log(menu);

          setRootMenuTree({ ...rootMenuTree });

          // const tempList = [...sourceList];
          // const _blockIndex = [...menuIndex];
          // const lastIndex = _blockIndex.pop() || 0;
          // console.log(lastIndex);
          // const lastArr = _blockIndex.reduce((arr, i) => arr[i].children, tempList);
          // console.log(lastArr);
          // lastArr[lastIndex].children = currentList;
          return rootMenuTree;
          /*          return { id: 'test', name: '테스트', children: [] }; */
        });
        /*        setMenuTree((sourceList: any) => {
          console.log(currentList); // 안쪽
          console.log(sourceList);
          const tempList = [...sourceList];
          // const _blockIndex = [...menuIndex];
          // const lastIndex = _blockIndex.pop() || 0;
          // console.log(lastIndex);
          // const lastArr = _blockIndex.reduce((arr, i) => arr[i].children, tempList);
          // console.log(lastArr);
          // lastArr[lastIndex].children = currentList;
          return tempList;
          /!* const tempList = [...sourceList];
        const _blockIndex = [...menuIndex];
        const lastIndex = _blockIndex.pop() || 0;
        const lastArr = _blockIndex.reduce((arr, i) => arr[i].children, tempList);
        console.log(menu);
        console.log(lastIndex);
        console.log(lastArr);
        console.log(children);
        console.log(sourceList);
        const find = tempList.findIndex((e) => e.id === menu.id);
        console.log(find);
        lastArr[find].children = children;
        console.log(lastArr);
        return lastArr; *!/
        }); */
      }}
    >
      {menu.children &&
        menu.children.map((childBlock, idx) => (
          <MenuTreeBlock
            key={childBlock.id}
            menu={childBlock}
            setRootMenuTree={setRootMenuTree}
            menuIndex={[...menuIndex, idx]}
            setMenuTree={setMenuTree}
            selectedMenu={selectedMenu}
            setMenuList={setMenuList}
            setSelectedMenu={setSelectedMenu}
            confirm={confirm}
          />
        ))}
    </ReactSortable>
  );
};

export const MenuTreeBlock = ({
  menu,
  setRootMenuTree,
  menuIndex,
  setMenuTree,
  selectedMenu,
  setSelectedMenu,
  setMenuList,
  confirm,
}: FunctionProps) => {
  if (!menu) return null;

  const addPage = () => {
    setMenuList((prev: any) => [defaultPage(menu.id, uuidv4()), ...prev]);
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
          setRootMenuTree={setRootMenuTree}
          menuIndex={menuIndex}
          confirm={confirm}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
          setMenuList={setMenuList}
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
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ pr: 2 }}>
          <Iconify icon="mingcute:selector-vertical-line" />
        </Box>
        <Box>
          {icon(
            `ic-${menu.icon?.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase())}`
          )}
        </Box>
        <Box sx={{ px: 2 }}>{menu.name} </Box>
        <Box sx={{ color: 'text.disabled' }}>
          <i>{menu?.pageInfoPath}</i>
        </Box>
      </Box>
      <Iconify icon="mingcute:delete-2-line" onClick={confirm.onTrue} />
    </Box>
  );
};
