import { ReactSortable } from 'react-sortablejs';

import Box from '@mui/material/Box';

import { Iconify } from '../../components/iconify';
import { icon } from '../../layouts/config-nav-dashboard';

import type { MenuTree } from '../../types/menu';
import type { UseBooleanReturn } from '../../hooks/use-boolean';

type FunctionProps = {
  rootMenuTree: MenuTree;
  setRootMenuTree: any;
  selectedMenu: MenuTree;
  setSelectedMenu: any;
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
  rootMenuTree,
  setRootMenuTree,
  selectedMenu,
  setSelectedMenu,
  confirm,
}: FunctionProps) => {
  if (!rootMenuTree || !setRootMenuTree) {
    return null;
  }
  return (
    <ReactSortable
      {...sortableOptions}
      key={rootMenuTree.id}
      list={rootMenuTree.children}
      setList={(currentList) => {
        if (currentList.length < 1) return;
        setRootMenuTree((tree: any) => {
          rootMenuTree.children = currentList;
          setRootMenuTree({ ...tree });
          return tree;
        });
      }}
    >
      {rootMenuTree.children &&
        rootMenuTree.children.map((childBlock, idx) => (
          <MenuTreeBlock
            key={childBlock.id}
            rootMenuTree={childBlock}
            setRootMenuTree={setRootMenuTree}
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
            confirm={confirm}
          />
        ))}
    </ReactSortable>
  );
};

export const MenuTreeBlock = ({
  rootMenuTree,
  setRootMenuTree,
  selectedMenu,
  setSelectedMenu,
  confirm,
}: FunctionProps) => {
  if (!rootMenuTree) return null;

  const selectItem = (item: MenuTree) => {
    setSelectedMenu(item);
  };

  if (rootMenuTree.type === 'group') {
    return (
      <Box
        className={`block group ${selectedMenu.id === rootMenuTree.id ? 'selected' : ''}`}
        onClick={() => selectItem(rootMenuTree)}
      >
        <div className="header">
          {rootMenuTree.name}
          <div>
            <Iconify icon="mingcute:delete-2-line" onClick={confirm.onTrue} />
          </div>
        </div>
        <Container
          rootMenuTree={rootMenuTree}
          setRootMenuTree={setRootMenuTree}
          confirm={confirm}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />
      </Box>
    );
  }
  return (
    <Box
      className={`block page ${selectedMenu.id === rootMenuTree.id ? 'selected' : ''}`}
      onClick={(e) => {
        selectItem(rootMenuTree);
        e.stopPropagation();
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ pr: 2 }}>
          <Iconify icon="mingcute:selector-vertical-line" />
        </Box>
        <Box>
          {icon(
            `ic-${rootMenuTree.icon?.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase())}`
          )}
        </Box>
        <Box sx={{ px: 2 }}>{rootMenuTree.name} </Box>
        <Box sx={{ color: 'text.disabled' }}>
          <i>{rootMenuTree?.pageInfoPath}</i>
        </Box>
      </Box>
      <Iconify icon="mingcute:delete-2-line" onClick={confirm.onTrue} />
    </Box>
  );
};
